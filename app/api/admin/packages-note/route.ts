import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const row = await prisma.siteContent.findUnique({
      where: { key: "packages_note" },
    });
    let items: string[] = [];
    if (row?.content) {
      try {
        const parsed = JSON.parse(row.content);
        items = Array.isArray(parsed) ? parsed : [];
      } catch {
        items = [];
      }
    }
    return json({
      title: row?.title || "Good to know",
      items,
    });
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{ title?: string; items: string[] }>(req);

    if (!Array.isArray(body.items)) {
      return error("items must be an array", 400);
    }

    const cleaned = body.items.map((s) => String(s).trim()).filter(Boolean);
    const content = JSON.stringify(cleaned);

    const row = await prisma.siteContent.upsert({
      where: { key: "packages_note" },
      update: {
        title: body.title?.trim() || "Good to know",
        content,
      },
      create: {
        key: "packages_note",
        title: body.title?.trim() || "Good to know",
        content,
      },
    });
afterAdminChange(CACHE_TAGS.packagesNote);
    return json(row);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to save", 500);
  }
}