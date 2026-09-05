import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadKind = "albums" | "packages" | "sliders" | "general";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Original image Cloudinary-তে upload।
 * Sharp resize/compress নেই — Cloudinary নিজে optimize করে serve করতে পারে।
 */
export async function uploadImageToCloudinary(
  file: File | Buffer,
  options: { folder?: string; kind?: UploadKind } = {}
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials missing");
  }

  const kind = options.kind || "general";
  const folder = (options.folder || `sekele/${kind}`).replace(/^\/+|\/+$/g, "");

  const inputBuffer = Buffer.isBuffer(file)
    ? file
    : Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          overwrite: false,
          // Keep the original untouched. Responsive q_auto/f_auto derivatives
          // are generated only when the website requests a delivery URL.
        },
        (err, uploaded) => {
          if (err || !uploaded) {
            reject(err || new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            secure_url: uploaded.secure_url!,
            public_id: uploaded.public_id!,
            width: uploaded.width || 0,
            height: uploaded.height || 0,
          });
        }
      )
      .end(inputBuffer);
  });

  return {
    // Original delivery URL (no forced transform in path)
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * Optional helper — website-এ দরকার হলে optimized URL বানাতে।
 * এখন original URL-ই DB-তে save হয়; এটা শুধু প্রয়োজনমতো use করুন।
 *
 * Example: getOptimizedCloudinaryUrl(url, { width: 1200 })
 */
export function getOptimizedCloudinaryUrl(
  urlOrPublicId: string,
  opts: { width?: number; height?: number; quality?: string } = {}
): string {
  if (!urlOrPublicId) return urlOrPublicId;

  // Already a full Cloudinary URL → inject transforms after /upload/
  if (urlOrPublicId.includes("res.cloudinary.com") && urlOrPublicId.includes("/upload/")) {
    const dimensions = [
      "c_limit",
      opts.width ? `w_${opts.width}` : "",
      opts.height ? `h_${opts.height}` : "",
    ].filter(Boolean).join(",");
    const transform = `${dimensions}/q_${opts.quality || "auto"}/f_auto`;
    return urlOrPublicId.replace("/upload/", `/upload/${transform}/`);
  }

  // public_id only
  if (!urlOrPublicId.startsWith("http") && isCloudinaryConfigured()) {
    return cloudinary.url(urlOrPublicId, {
      secure: true,
      width: opts.width,
      height: opts.height,
      crop: "limit",
      quality: opts.quality || "auto",
      fetch_format: "auto",
    });
  }

  return urlOrPublicId;
}

/** URL বা public_id থেকে Cloudinary public_id */
export function extractPublicId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.startsWith("http")) {
    return urlOrId.replace(/\.[a-zA-Z0-9]+$/, "");
  }
  try {
    const u = new URL(urlOrId);
    if (!u.hostname.includes("cloudinary.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    let rest = parts.slice(uploadIdx + 1);
    // skip version (v123) and transformation segments
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    // if first segment looks like transforms (contains _), skip until no comma/_ pattern is tricky;
    // standard stored URLs from this app have no transforms
    if (!rest.length) return null;
    const last = rest[rest.length - 1];
    rest[rest.length - 1] = last.replace(/\.[a-zA-Z0-9]+$/, "");
    return rest.join("/");
  } catch {
    return null;
  }
}

/** একটা image Cloudinary থেকে delete */
export async function deleteImageFromCloudinary(urlOrPublicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;
  const publicId = extractPublicId(urlOrPublicId);
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return result.result === "ok" || result.result === "not found";
  } catch (e) {
    console.error("Cloudinary delete error:", e);
    return false;
  }
}

/** অনেকগুলো image একসাথে delete */
export async function deleteManyFromCloudinary(urls: (string | null | undefined)[]) {
  const list = urls.filter((u): u is string => Boolean(u));
  await Promise.all(list.map((url) => deleteImageFromCloudinary(url)));
}
