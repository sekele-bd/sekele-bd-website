/** Cache tags — admin mutation-এ এগুলো revalidate করবেন */
export const CACHE_TAGS = {
  sliders: "sliders",
  story: "story",
  stats: "stats",
  contact: "contact",
  socials: "socials",
  albums: "albums",
  films: "films",
  packages: "packages",
  packagesNote: "packages-note",
  faqs: "faqs",
  team: "team",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];