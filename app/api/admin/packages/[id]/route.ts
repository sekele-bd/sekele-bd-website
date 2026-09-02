import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import {
  deleteImageFromCloudinary,
  deleteManyFromCloudinary,
} from "@/lib/cloudinary";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody<{
      name?: string;
      type?: string;
      price?: string;
      oldPrice?: string | null;
      image?: string | null;
      features?: string[];
      popular?: boolean;
      order?: number;
      isActive?: boolean;
    }>(req);

    if (body.image !== undefined) {
      const existing = await prisma.package.findUnique({ where: { id } });
      if (existing?.image && existing.image !== body.image) {
        await deleteImageFromCloudinary(existing.image);
      }
    }

    const data: Record<string, unknown> = { ...body };
    if (body.features) data.features = JSON.stringify(body.features);

    const item = await prisma.package.update({ where: { id }, data });
    let features: string[] = [];
    try {
      features = JSON.parse(item.features);
    } catch {
      features = [];
    }

    afterAdminChange(CACHE_TAGS.packages);

    return json({ ...item, features });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to update", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) return error("Not found", 404);

    await deleteManyFromCloudinary([pkg.image]);
    await prisma.package.delete({ where: { id } });

    afterAdminChange(CACHE_TAGS.packages);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to delete", 500);
  }
}