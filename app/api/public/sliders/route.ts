import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const items = await prisma.slider.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return json(items);
}
