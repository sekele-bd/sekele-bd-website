import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  const story = await prisma.siteContent.findUnique({ where: { key: "our_story" } });
  let paragraphs: string[] = [];
  if (story?.content) {
    try {
      paragraphs = JSON.parse(story.content);
    } catch {
      paragraphs = [story.content];
    }
  }
  return json({ title: story?.title, paragraphs });
}
