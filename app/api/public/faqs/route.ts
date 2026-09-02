import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const items = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return json(items);
}
