import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();

    const [
      albums,
      packages,
      sliders,
      faqs,
      socials,
      films,
      recentAlbums,
      recentPackages,
      admin,
    ] = await Promise.all([
      prisma.album.count(),
      prisma.package.count(),
      prisma.slider.count(),
      prisma.faq.count(),
      prisma.socialLink.count(),
      prisma.film.count(),
      prisma.album.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.package.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, name: true, updatedAt: true },
      }),
      prisma.admin.findFirst({
        select: { name: true, email: true },
      }),
    ]);

    const recentItems = [
      ...recentAlbums.map((item) => ({
        id: item.id,
        label: item.title,
        kind: "Album" as const,
        href: "/admin/albums",
        updatedAt: item.updatedAt.toISOString(),
      })),
      ...recentPackages.map((item) => ({
        id: item.id,
        label: item.name,
        kind: "Package" as const,
        href: "/admin/packages",
        updatedAt: item.updatedAt.toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);

    return json({
      adminName: admin?.name || "Admin",
      counts: { albums, packages, sliders, faqs, socials, films },
      recentItems,
    });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error(e);
    return error("Failed to load dashboard", 500);
  }
}