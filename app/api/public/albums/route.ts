import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

  const items = await prisma.album.findMany({
    where: {
      isPublished: true,
      ...(featured === "1" ? { isFeatured: true } : {}),
    },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return json(items);
}
