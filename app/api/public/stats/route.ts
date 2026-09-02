import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

const defaults = [
  { value: 180, suffix: "+", label: "Completed Projects", description: "Weddings & celebrations captured" },
  { value: 150, suffix: "+", label: "Happy Couples", description: "Stories told with heart" },
  { value: 6, suffix: "+", label: "Years Experience", description: "Documenting real moments" },
  { value: 12, suffix: "K+", label: "Photos Delivered", description: "Memories preserved forever" },
];

export async function GET() {
  const row = await prisma.siteContent.findUnique({ where: { key: "stats" } });
  let items = defaults;
  if (row?.content) {
    try {
      const parsed = JSON.parse(row.content);
      if (Array.isArray(parsed) && parsed.length) items = parsed;
    } catch {
      /* keep defaults */
    }
  }
  return json({
    sectionTitle: row?.title || "Moments we've been trusted with",
    items,
  });
}