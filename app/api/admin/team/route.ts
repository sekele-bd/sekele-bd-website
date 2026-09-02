import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return json(members);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      name: string;
      role?: string;
      image?: string;
      facebook?: string;
      instagram?: string;
      email?: string;
      order?: number;
      isActive?: boolean;
    }>(req);

    if (!body.name?.trim()) return error("Name is required", 400);

    const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } });
    const member = await prisma.teamMember.create({
      data: {
        name: body.name.trim(),
        role: body.role?.trim() || null,
        image: body.image || null,
        facebook: body.facebook?.trim() || null,
        instagram: body.instagram?.trim() || null,
        email: body.email?.trim() || null,
        order: body.order ?? (maxOrder._max.order ?? 0) + 1,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.team);
    return json(member, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}