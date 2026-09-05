import type { ImageLoaderProps } from "next/image";

export function isCloudinaryImage(src: string) {
  return src.includes("res.cloudinary.com") && src.includes("/upload/");
}

/**
 * Cloudinary responsive loader. The original URL remains unchanged in the DB;
 * only the delivered derivative is resized and encoded for the browser.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (!isCloudinaryImage(src)) return src;

  const transform = `c_limit,w_${width}/q_${quality || "auto"}/f_auto`;
  return src.replace("/upload/", `/upload/${transform}/`);
}

export function optimizedCloudinaryUrl(
  src: string,
  options: { width: number; quality?: number | "auto" | "auto:best" } 
) {
  if (!isCloudinaryImage(src)) return src;
  const transform = `c_limit,w_${options.width}/q_${options.quality || "auto"}/f_auto`;
  return src.replace("/upload/", `/upload/${transform}/`);
}
