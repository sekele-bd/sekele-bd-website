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
      Partial<{
        platform: string;
        url: string;
        icon: string;
        order: number;
        isActive: boolean;
      }>
    >(req);
    const item = await prisma.socialLink.update({ where: { id }, data: body });

    // Footer / contact block uses socials
    afterAdminChange(CACHE_TAGS.socials, CACHE_TAGS.contact);

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
    await prisma.socialLink.delete({ where: { id } });

    afterAdminChange(CACHE_TAGS.socials, CACHE_TAGS.contact);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    console.error(e);
    return error("Failed to delete", 500);
  }
}