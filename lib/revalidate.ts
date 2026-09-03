import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "./cache-tags";

/** এক বা একাধিক tag invalidate */
export function revalidateTags(...tags: CacheTag[]) {
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }
}

/** Public pages refresh */
export function revalidatePublicPages() {
  revalidatePath("/", "layout"); // public layout + সব child
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/albums");
  revalidatePath("/packages");
  revalidatePath("/faq");
  revalidatePath("/booking");
}

/**
 * Admin mutation-এর পর কল করুন।
 * example: afterSave("albums") বা afterSave("story", "sliders")
 */
export function afterAdminChange(...tags: CacheTag[]) {
  revalidateTags(...tags);
  revalidatePublicPages();
}

/** Album detail path */
export function revalidateAlbum(slugOrId: string) {
  revalidateTag(CACHE_TAGS.albums, "default");
  revalidatePath("/albums");
  revalidatePath(`/albums/${slugOrId}`);
  revalidatePath("/"); // featured albums on home
}
