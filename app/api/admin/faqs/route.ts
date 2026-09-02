import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.faq.findMany({ orderBy: { order: "asc" } });
    return json(items);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      question: string;
      answer: string;
      order?: number;
      isActive?: boolean;
    }>(req);
    if (!body.question || !body.answer) return error("Question and answer required");
    const item = await prisma.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.faqs);
    return json(item, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}
