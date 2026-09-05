"use client";

import Image, { type ImageProps } from "next/image";
import cloudinaryLoader, { isCloudinaryImage } from "@/lib/cloudinary-loader";

/** Uses Cloudinary directly for responsive derivatives and Next.js for others. */
export default function OptimizedImage({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";

  return (
    <Image
      {...props}
      alt={alt}
      loader={isCloudinaryImage(src) ? cloudinaryLoader : props.loader}
    />
  );
}
