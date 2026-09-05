import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody<{
      name?: string;
      role?: string | null;
      image?: string | null;
      facebook?: string | null;
      instagram?: string | null;
      email?: string | null;
      order?: number;
      isActive?: boolean;
    }>(req);

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return error("Not found", 404);

    const previousImage =
      body.image !== undefined && body.image !== existing.image
        ? existing.image
        : null;

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.role !== undefined ? { role: body.role?.trim() || null } : {}),
        ...(body.image !== undefined ? { image: body.image || null } : {}),
        ...(body.facebook !== undefined
          ? { facebook: body.facebook?.trim() || null }
          : {}),
        ...(body.instagram !== undefined
          ? { instagram: body.instagram?.trim() || null }
          : {}),
        ...(body.email !== undefined
          ? { email: body.email?.trim() || null }
          : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    if (previousImage?.includes("cloudinary.com")) {
      await deleteImageFromCloudinary(previousImage);
    }

    afterAdminChange(CACHE_TAGS.team);

    return json(member);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to update", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return error("Not found", 404);

    await prisma.teamMember.delete({ where: { id } });
    if (existing.image?.includes("cloudinary.com")) {
      await deleteImageFromCloudinary(existing.image);
    }

    afterAdminChange(CACHE_TAGS.team);

    return json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to delete", 500);
  }
}
