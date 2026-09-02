import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return json(members);
}