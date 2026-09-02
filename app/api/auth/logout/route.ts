import { logoutAdmin } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST() {
  await logoutAdmin();
  return json({ ok: true });
}
