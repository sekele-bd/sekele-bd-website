import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.album.findMany({
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
    afterAdminChange(CACHE_TAGS.albums);
    return json(items);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      title: string;
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

    if (!body.title) return error("Title required");
    const slug = body.slug || slugify(body.title) + "-" + Date.now().toString(36);

    const item = await prisma.album.create({
      data: {
        title: body.title,
        location: body.location || null,
        date: body.date || null,
        type: body.type || null,
        description: body.description || null,
        cover: body.cover || null,
        slug,
        order: body.order ?? 0,
        isFeatured: body.isFeatured ?? false,
        isPublished: body.isPublished ?? true,
        images: body.images?.length
          ? {
              create: body.images.map((img, i) => ({
                url: img.url,
                alt: img.alt || null,
                order: img.order ?? i,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
    return json(item, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error(e);
    return error("Failed to create", 500);
  }
}
