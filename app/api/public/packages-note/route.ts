import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

const defaults = [
  "80% advance payment required to confirm booking",
  "Free rescheduling (subject to availability)",
  "Cancellation fee 30%",
  "Extra hours charged separately",
  "Custom packages available on request",
];

export async function GET() {
  const row = await prisma.siteContent.findUnique({
    where: { key: "packages_note" },
  });

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
    title: row?.title || "Good to know",
    items,
  });
}