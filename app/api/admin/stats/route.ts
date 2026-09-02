import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const row = await prisma.siteContent.findUnique({ where: { key: "stats" } });
    let items: unknown[] = [];
    if (row?.content) {
      try {
        items = JSON.parse(row.content);
      } catch {
        items = [];
      }
    }
    return json({
      title: row?.title || "Moments we've been trusted with",
      items: Array.isArray(items) ? items : [],
    });
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      title?: string;
      items: Array<{
        value: number;
        suffix?: string;
        label: string;
        description?: string;
      }>;
    }>(req);

    if (!Array.isArray(body.items)) {
      return error("items must be an array", 400);
    }

    const content = JSON.stringify(body.items);
    const row = await prisma.siteContent.upsert({
      where: { key: "stats" },
      update: {
        title: body.title || "Moments we've been trusted with",
        content,
      },
      create: {
        key: "stats",
        title: body.title || "Moments we've been trusted with",
        content,
      },
    });
afterAdminChange(CACHE_TAGS.stats);
    return json(row);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to save", 500);
  }
}