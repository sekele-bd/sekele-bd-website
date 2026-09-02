import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody<
      Partial<{ title: string; youtubeUrl: string; order: number; isActive: boolean }>
    >(req);

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl.trim();
    if (body.order !== undefined) data.order = body.order;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const item = await prisma.film.update({ where: { id }, data });

    afterAdminChange(CACHE_TAGS.films);

    return json(item);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to update", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await prisma.film.delete({ where: { id } });

    afterAdminChange(CACHE_TAGS.films);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to delete", 500);
  }
}