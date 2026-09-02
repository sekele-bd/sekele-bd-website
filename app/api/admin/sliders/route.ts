import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.slider.findMany({ orderBy: { order: "asc" } });
    return json(items);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{ image: string; alt?: string; order?: number; isActive?: boolean }>(req);
    if (!body.image) return error("Image required");
    const item = await prisma.slider.create({
      data: {
        image: body.image,
        alt: body.alt || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.sliders);
    return json(item, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}
