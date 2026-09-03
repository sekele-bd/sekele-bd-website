import { prisma } from "./prisma";

export async function getAdminDashboardData() {
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
    prisma.admin.findFirst({ select: { name: true } }),
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

  return {
    adminName: admin?.name || "Admin",
    counts: { albums, packages, sliders, faqs, socials, films },
    recentItems,
  };
}

export function getAdminAbout() {
  return prisma.siteContent.findUnique({ where: { key: "our_story" } });
}

export function getAdminContact() {
  return prisma.siteContent.findUnique({ where: { key: "contact" } });
}

export function getAdminAlbums() {
  return prisma.album.findMany({
    select: {
      id: true,
      title: true,
      location: true,
      type: true,
      cover: true,
      isFeatured: true,
      isPublished: true,
      images: {
        select: { id: true, url: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });
}

export function getAdminFaqs() {
  return prisma.faq.findMany({ orderBy: { order: "asc" } });
}

export function getAdminFilms() {
  return prisma.film.findMany({ orderBy: { order: "asc" } });
}

export async function getAdminPackages() {
  const items = await prisma.package.findMany({ orderBy: { order: "asc" } });
  return items.map((item) => ({
    ...item,
    features: safeParseArray<string>(item.features),
  }));
}

export async function getAdminPackagesNote() {
  const row = await prisma.siteContent.findUnique({
    where: { key: "packages_note" },
  });
  return {
    title: row?.title || "Good to know",
    items: safeParseArray<string>(row?.content),
  };
}

export function getAdminSliders() {
  return prisma.slider.findMany({ orderBy: { order: "asc" } });
}

export function getAdminSocials() {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function getAdminStats() {
  const row = await prisma.siteContent.findUnique({ where: { key: "stats" } });
  return {
    title: row?.title || "Moments we've been trusted with",
    items: safeParseArray<{
      value: number;
      suffix: string;
      label: string;
      description: string;
    }>(row?.content),
  };
}

export function getAdminTeam() {
  return prisma.teamMember.findMany({ orderBy: { order: "asc" } });
}

function safeParseArray<T>(raw?: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
