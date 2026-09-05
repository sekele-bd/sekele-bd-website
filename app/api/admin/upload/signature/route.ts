import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth";
import { error, json } from "@/lib/api";
import { isCloudinaryConfigured, type UploadKind } from "@/lib/cloudinary";

function detectKind(folder: string): UploadKind {
  if (folder.includes("album")) return "albums";
  if (folder.includes("package")) return "packages";
  if (folder.includes("slider")) return "sliders";
  return "general";
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const kind = detectKind(String(body.folder || ""));

    if (!isCloudinaryConfigured()) {
      return json({ storage: "local" });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `sekele/${kind}`;
    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      apiSecret
    );

    return json({
      storage: "cloudinary",
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error("Upload signature error:", e);
    return error("Could not authorize upload", 500);
  }
}
