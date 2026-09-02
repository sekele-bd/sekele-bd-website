import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";

/** Default: 1 hour ISR-style; admin change = instant via revalidateTag */
const HOUR = 3600;

export const getSliders = unstable_cache(
  async () => {
    return prisma.slider.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["public-sliders"],
  { tags: [CACHE_TAGS.sliders], revalidate: HOUR }
);

export const getOurStory = unstable_cache(
  async () => {
    const story = await prisma.siteContent.findUnique({
      where: { key: "our_story" },
    });
    let paragraphs: string[] = [];
    if (story?.content) {
      try {
        const parsed = JSON.parse(story.content);
        paragraphs = Array.isArray(parsed) ? parsed : [story.content];
      } catch {
        paragraphs = [story.content];
      }
    }
    return {
      title: story?.title || "Welcome to Sekele",
      paragraphs,
    };
  },
  ["public-story"],
  { tags: [CACHE_TAGS.story], revalidate: HOUR }
);

export const getStats = unstable_cache(
  async () => {
    const defaults = [
      { value: 180, suffix: "+", label: "Completed Projects", description: "Weddings & celebrations captured" },
      { value: 150, suffix: "+", label: "Happy Couples", description: "Stories told with heart" },
      { value: 6, suffix: "+", label: "Years Experience", description: "Documenting real moments" },
      { value: 12, suffix: "K+", label: "Photos Delivered", description: "Memories preserved forever" },
    ];
    const row = await prisma.siteContent.findUnique({ where: { key: "stats" } });
    let items = defaults;
    if (row?.content) {
      try {
        const parsed = JSON.parse(row.content);
        if (Array.isArray(parsed) && parsed.length) items = parsed;
      } catch {
        /* keep defaults */
      }
    }
    return {
      sectionTitle: row?.title || "Moments we've been trusted with",
      items,
    };
  },
  ["public-stats"],
  { tags: [CACHE_TAGS.stats], revalidate: HOUR }
);

export const getContact = unstable_cache(
  async () => {
    const contact = await prisma.siteContent.findUnique({
      where: { key: "contact" },
    });
    const socials = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    let data = {
      address: "",
      phone: "",
      email: "",
      note: "",
      heroImage: "",
    };
    if (contact?.content) {
      try {
        data = { ...data, ...JSON.parse(contact.content) };
      } catch {
        /* ignore */
      }
    }
    return {
      title: contact?.title || "Get in touch",
      ...data,
      socials,
    };
  },
  ["public-contact"],
  { tags: [CACHE_TAGS.contact, CACHE_TAGS.socials], revalidate: HOUR }
);

export const getTeam = unstable_cache(
  async () => {
    return prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["public-team"],
  { tags: [CACHE_TAGS.team], revalidate: HOUR }
);

export const getAlbums = unstable_cache(
  async (featuredOnly = false) => {
    return prisma.album.findMany({
      where: {
        isPublished: true,
        ...(featuredOnly ? { isFeatured: true } : {}),
      },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
  },
  ["public-albums"],
  { tags: [CACHE_TAGS.albums], revalidate: HOUR }
);

export const getAlbumBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.album.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isPublished: true,
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
  },
  ["public-album-by-slug"],
  { tags: [CACHE_TAGS.albums], revalidate: HOUR }
);

export const getFilms = unstable_cache(
  async () => {
    return prisma.film.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["public-films"],
  { tags: [CACHE_TAGS.films], revalidate: HOUR }
);

export const getPackages = unstable_cache(
  async () => {
    const items = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return items.map((p) => {
      let features: string[] = [];
      try {
        features = JSON.parse(p.features);
      } catch {
        features = [];
      }
      return { ...p, features };
    });
  },
  ["public-packages"],
  { tags: [CACHE_TAGS.packages], revalidate: HOUR }
);

export const getPackagesNote = unstable_cache(
  async () => {
    const defaults = [
      "80% advance payment required to confirm booking",
      "Free rescheduling (subject to availability)",
      "Cancellation fee 30%",
      "Extra hours charged separately",
      "Custom packages available on request",
    ];
    const row = await prisma.siteContent.findUnique({
      where: { key: "packages_note" },
    });
    let items = defaults;
    if (row?.content) {
      try {
        const parsed = JSON.parse(row.content);
        if (Array.isArray(parsed) && parsed.length) items = parsed;
      } catch {
        /* keep defaults */
      }
    }
    return {
      title: row?.title || "Good to know",
      items,
    };
  },
  ["public-packages-note"],
  { tags: [CACHE_TAGS.packagesNote], revalidate: HOUR }
);

export const getFaqs = unstable_cache(
  async () => {
    return prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["public-faqs"],
  { tags: [CACHE_TAGS.faqs], revalidate: HOUR }
);