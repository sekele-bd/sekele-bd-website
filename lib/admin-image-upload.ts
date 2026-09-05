export const MAX_IMAGE_UPLOAD_BYTES = 25 * 1024 * 1024;

export type AdminImageUpload = {
  url: string;
  publicId?: string;
  width?: number | null;
  height?: number | null;
  storage: "cloudinary" | "local";
};

function validateImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error("File too large (max 25MB)");
  }
}

async function uploadThroughServer(file: File, folder: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const result = await response.json();
  if (!response.ok || !result.url) {
    throw new Error(result.error || "Upload failed");
  }
  return result as AdminImageUpload;
}

/**
 * Uploads directly from the browser to Cloudinary. Only the small signed request
 * touches the Next.js server, avoiding serverless body-size and memory limits.
 */
export async function uploadAdminImage(file: File, folder: string) {
  validateImage(file);

  const signatureResponse = await fetch("/api/admin/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const signed = await signatureResponse.json();

  if (!signatureResponse.ok) {
    throw new Error(signed.error || "Could not authorize upload");
  }
  if (signed.storage === "local") {
    return uploadThroughServer(file, folder);
  }

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signed.apiKey);
  body.append("timestamp", String(signed.timestamp));
  body.append("signature", signed.signature);
  body.append("folder", signed.folder);

  const response = await fetch(signed.uploadUrl, { method: "POST", body });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Cloudinary upload failed");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width || null,
    height: result.height || null,
    storage: "cloudinary",
  } satisfies AdminImageUpload;
}

export async function deleteAdminImage(url: string) {
  if (!url) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}
