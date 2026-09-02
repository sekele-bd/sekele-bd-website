import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return json(items);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      platform: string;
      url: string;
      icon?: string;
      order?: number;
      isActive?: boolean;
    }>(req);
    if (!body.platform || !body.url) return error("Platform and URL required");
    const item = await prisma.socialLink.create({
      data: {
        platform: body.platform,
        url: body.url,
        icon: body.icon || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.socials);
    return json(item, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}
