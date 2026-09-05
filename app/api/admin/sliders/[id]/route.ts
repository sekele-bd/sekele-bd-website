import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody<
      Partial<{ image: string; alt: string; order: number; isActive: boolean }>
    >(req);

    const existing = body.image !== undefined
      ? await prisma.slider.findUnique({ where: { id } })
      : null;
    const previousImage =
      existing?.image && existing.image !== body.image ? existing.image : null;

    const item = await prisma.slider.update({ where: { id }, data: body });
    if (previousImage) await deleteImageFromCloudinary(previousImage);

    afterAdminChange(CACHE_TAGS.sliders);

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

    const slider = await prisma.slider.findUnique({ where: { id } });
    if (!slider) return error("Not found", 404);

    await prisma.slider.delete({ where: { id } });
    if (slider.image) await deleteImageFromCloudinary(slider.image);

    afterAdminChange(CACHE_TAGS.sliders);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to delete", 500);
  }
}
