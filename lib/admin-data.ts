import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";

const FIVE_MINUTES = 60 * 5;

export const getAdminDashboardData = unstable_cache(async () => {
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
}, ["admin-dashboard"], {
  tags: Object.values(CACHE_TAGS),
  revalidate: FIVE_MINUTES,
});

export const getAdminAbout = unstable_cache(
  async () => prisma.siteContent.findUnique({ where: { key: "our_story" } }),
  ["admin-about"],
  { tags: [CACHE_TAGS.story], revalidate: FIVE_MINUTES }
);

export const getAdminContact = unstable_cache(
  async () => prisma.siteContent.findUnique({ where: { key: "contact" } }),
  ["admin-contact"],
  { tags: [CACHE_TAGS.contact], revalidate: FIVE_MINUTES }
);

export const getAdminAlbums = unstable_cache(
  async () =>
    prisma.album.findMany({
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
    }),
  ["admin-albums"],
  { tags: [CACHE_TAGS.albums], revalidate: FIVE_MINUTES }
);

export const getAdminFaqs = unstable_cache(
  async () => prisma.faq.findMany({ orderBy: { order: "asc" } }),
  ["admin-faqs"],
  { tags: [CACHE_TAGS.faqs], revalidate: FIVE_MINUTES }
);

export const getAdminFilms = unstable_cache(
  async () => prisma.film.findMany({ orderBy: { order: "asc" } }),
  ["admin-films"],
  { tags: [CACHE_TAGS.films], revalidate: FIVE_MINUTES }
);

export const getAdminPackages = unstable_cache(async () => {
  const items = await prisma.package.findMany({ orderBy: { order: "asc" } });
  return items.map((item) => ({
    ...item,
    features: safeParseArray<string>(item.features),
  }));
}, ["admin-packages"], {
  tags: [CACHE_TAGS.packages],
  revalidate: FIVE_MINUTES,
});

export const getAdminPackagesNote = unstable_cache(async () => {
  const row = await prisma.siteContent.findUnique({
    where: { key: "packages_note" },
  });
  return {
    title: row?.title || "Good to know",
    items: safeParseArray<string>(row?.content),
  };
}, ["admin-packages-note"], {
  tags: [CACHE_TAGS.packagesNote],
  revalidate: FIVE_MINUTES,
});

export const getAdminSliders = unstable_cache(
  async () => prisma.slider.findMany({ orderBy: { order: "asc" } }),
  ["admin-sliders"],
  { tags: [CACHE_TAGS.sliders], revalidate: FIVE_MINUTES }
);

export const getAdminSocials = unstable_cache(
  async () => prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
  ["admin-socials"],
  { tags: [CACHE_TAGS.socials], revalidate: FIVE_MINUTES }
);

export const getAdminStats = unstable_cache(async () => {
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
}, ["admin-stats"], {
  tags: [CACHE_TAGS.stats],
  revalidate: FIVE_MINUTES,
});

export const getAdminTeam = unstable_cache(
  async () => prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
  ["admin-team"],
  { tags: [CACHE_TAGS.team], revalidate: FIVE_MINUTES }
);

function safeParseArray<T>(raw?: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
