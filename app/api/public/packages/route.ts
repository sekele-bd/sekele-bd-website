import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const items = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return json(
    items.map((p) => {
      let features: string[] = [];
      try {
        features = JSON.parse(p.features);
      } catch {
        features = [];
      }
      return { ...p, features };
    })
  );
}
