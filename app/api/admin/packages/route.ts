import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { afterAdminChange } from "@/lib/revalidate";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.package.findMany({ orderBy: { order: "asc" } });
    return json(
      items.map((p) => ({
        ...p,
        features: safeParseFeatures(p.features),
      }))
    );
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await parseBody<{
      name: string;
      type?: string;
      price: string;
      oldPrice?: string;
      image?: string;
      features?: string[];
      popular?: boolean;
      order?: number;
      isActive?: boolean;
    }>(req);

    if (!body.name || !body.price) return error("Name and price required");

    const item = await prisma.package.create({
      data: {
        name: body.name,
        type: body.type || null,
        price: body.price,
        oldPrice: body.oldPrice || null,
        image: body.image || null,
        features: JSON.stringify(body.features || []),
        popular: body.popular ?? false,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    afterAdminChange(CACHE_TAGS.packages);
    return json({ ...item, features: body.features || [] }, 201);
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") return error("Unauthorized", 401);
    return error("Failed to create", 500);
  }
}

function safeParseFeatures(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
