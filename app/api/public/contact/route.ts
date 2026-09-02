import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const contact = await prisma.siteContent.findUnique({ where: { key: "contact" } });
  const socials = await prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  let data = {
    address: "",
    phone: "",
    email: "",
    note: "",
    heroImage: "",
  };

  if (contact?.content) {
    try {
      data = { ...data, ...JSON.parse(contact.content) };
    } catch {
      /* ignore */
    }
  }

  return json({ title: contact?.title, ...data, socials });
}