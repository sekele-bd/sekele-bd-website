import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.film.findMany({ orderBy: { order: "asc" } });
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
      youtubeUrl: string;
      order?: number;
      isActive?: boolean;
    }>(req);

    if (!body.title?.trim()) return error("Title required");
    if (!body.youtubeUrl?.trim()) return error("YouTube URL required");

    const item = await prisma.film.create({
      data: {
        title: body.title.trim(),
        youtubeUrl: body.youtubeUrl.trim(),
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.films);
    return json(item, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}