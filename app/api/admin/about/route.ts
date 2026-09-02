import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { afterAdminChange } from "@/lib/revalidate";


export async function GET() {
  try {
    await requireAdmin();
    const story = await prisma.siteContent.findUnique({ where: { key: "our_story" } });
    return json(story);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{ title?: string; content: string | string[] }>(req);
    const content =
      typeof body.content === "string" ? body.content : JSON.stringify(body.content);

    const story = await prisma.siteContent.upsert({
      where: { key: "our_story" },
      update: { title: body.title, content },
      create: { key: "our_story", title: body.title || "Our Story", content },
    });
    afterAdminChange(CACHE_TAGS.story);
    return json(story);
    
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to save", 500);
  }
}
