import { getCurrentAdmin } from "@/lib/auth";
import { error, json } from "@/lib/api";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return error("Unauthorized", 401);
  return json({ admin });
}
