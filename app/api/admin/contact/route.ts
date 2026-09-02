import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { afterAdminChange } from "@/lib/revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET() {
  try {
    await requireAdmin();
    const contact = await prisma.siteContent.findUnique({ where: { key: "contact" } });
    return json(contact);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      title?: string;
      address?: string;
      phone?: string;
      email?: string;
      note?: string;
      heroImage?: string;
    }>(req);

    const content = JSON.stringify({
      address: body.address || "",
      phone: body.phone || "",
      email: body.email || "",
      note: body.note || "",
      heroImage: body.heroImage || "",
    });

    const contact = await prisma.siteContent.upsert({
      where: { key: "contact" },
      update: { title: body.title, content },
      create: {
        key: "contact",
        title: body.title || "Contact",
        content,
      },
    });
    afterAdminChange(CACHE_TAGS.contact);
    return json(contact);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to save", 500);
  }
}