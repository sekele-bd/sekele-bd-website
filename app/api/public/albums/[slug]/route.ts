import { prisma } from "@/lib/prisma";
import { error, json } from "@/lib/api";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const item = await prisma.album.findFirst({
    where: { OR: [{ slug }, { id: slug }], isPublished: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!item) return error("Not found", 404);
  return json(item);
}
