import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { deleteManyFromCloudinary } from "@/lib/cloudinary";
import { afterAdminChange, revalidateAlbum } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const item = await prisma.album.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (!item) return error("Not found", 404);
    return json(item);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody<{
      title?: string;
      location?: string;
      date?: string;
      type?: string;
      description?: string;
      cover?: string;
      slug?: string;
      order?: number;
      isFeatured?: boolean;
      isPublished?: boolean;
      images?: { url: string; alt?: string; order?: number }[];
    }>(req);

    if (body.images) {
      const existing = await prisma.album.findUnique({
        where: { id },
        include: { images: true },
      });
      if (existing) {
        const newUrls = new Set(body.images.map((i) => i.url));
        const removed = [
          ...existing.images.map((i) => i.url).filter((u) => !newUrls.has(u)),
        ];
        if (
          existing.cover &&
          body.cover !== undefined &&
          body.cover !== existing.cover
        ) {
          removed.push(existing.cover);
        }
        await deleteManyFromCloudinary(removed);
      }

      await prisma.albumImage.deleteMany({ where: { albumId: id } });
      await prisma.albumImage.createMany({
        data: body.images.map((img, i) => ({
          albumId: id,
          url: img.url,
          alt: img.alt || null,
          order: img.order ?? i,
        })),
      });
    } else if (body.cover !== undefined) {
      const existing = await prisma.album.findUnique({ where: { id } });
      if (existing?.cover && existing.cover !== body.cover) {
        await deleteManyFromCloudinary([existing.cover]);
      }
    }

    const { images: _images, ...rest } = body;
    const item = await prisma.album.update({
      where: { id },
      data: rest,
      include: { images: { orderBy: { order: "asc" } } },
    });

    // Cache refresh
    afterAdminChange(CACHE_TAGS.albums);
    revalidateAlbum(item.slug || item.id);
    if (body.slug && body.slug !== item.slug) {
      revalidateAlbum(body.slug);
    }

    return json(item);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error(e);
    return error("Failed to update", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!album) return error("Not found", 404);

    await deleteManyFromCloudinary([
      album.cover,
      ...album.images.map((img) => img.url),
    ]);

    await prisma.album.delete({ where: { id } });

    // Cache refresh
    afterAdminChange(CACHE_TAGS.albums);
    revalidateAlbum(album.slug || album.id);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error(e);
    return error("Failed to delete", 500);
  }
}