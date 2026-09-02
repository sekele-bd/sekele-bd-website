import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sekelebd.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let albums: { slug: string | null; updatedAt: Date }[] = [];

  try {
    albums = await prisma.album.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // build time-এ DB না থাকলে static pages দিয়ে চলবে
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/albums`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const albumPages: MetadataRoute.Sitemap = albums
    .filter((a) => a.slug)
    .map((album) => ({
      url: `${siteUrl}/albums/${album.slug}`,
      lastModified: album.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticPages, ...albumPages];
}