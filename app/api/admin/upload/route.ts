import { requireAdmin } from "@/lib/auth";
import { error, json } from "@/lib/api";
import {
  uploadImageToCloudinary,
  isCloudinaryConfigured,
  deleteImageFromCloudinary,
  type UploadKind,
} from "@/lib/cloudinary";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

function detectKind(folder: string): UploadKind {
  if (folder.includes("album")) return "albums";
  if (folder.includes("package")) return "packages";
  if (folder.includes("slider")) return "sliders";
  return "general";
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folder = ((form.get("folder") as string) || "uploads").replace(/^\/+|\/+$/g, "");

    if (!file) return error("No file");
    if (!file.type.startsWith("image/")) return error("Only image files are allowed");
    if (file.size > 25 * 1024 * 1024) return error("File too large (max 25MB)");

    const kind = detectKind(folder);
    const bytes = Buffer.from(await file.arrayBuffer());

    // Cloudinary path — no Sharp resize, original goes up
    if (isCloudinaryConfigured()) {
      const result = await uploadImageToCloudinary(bytes, {
        folder: `sekele/${kind}`,
        kind,
      });
      return json({
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        storage: "cloudinary",
      });
    }

    // Local fallback — original file as-is (no Sharp)
    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (file.type.split("/")[1] || "jpg");
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);

    return json({
      url: `/${folder}/${name}`,
      width: null,
      height: null,
      storage: "local",
    });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error("Upload error:", e);
    return error((e as Error).message || "Upload failed", 500);
  }
}

/** Trash icon → single image delete */
export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const url = (body.url as string) || "";
    if (!url) return error("URL required");

    if (url.includes("cloudinary.com")) {
      await deleteImageFromCloudinary(url);
      return json({ ok: true, storage: "cloudinary" });
    }

    if (url.startsWith("/")) {
      const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
      await unlink(filePath).catch(() => {});
    }

    return json({ ok: true, storage: "local" });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error("Delete error:", e);
    return error("Delete failed", 500);
  }
}