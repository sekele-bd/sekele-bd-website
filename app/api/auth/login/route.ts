import { loginAdmin } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { email, password } = await parseBody<{ email: string; password: string }>(req);
    if (!email || !password) return error("Email and password required");

    const admin = await loginAdmin(email, password);
    if (!admin) return error("Invalid credentials", 401);

    return json({ admin });
  } catch (e) {
    console.error(e);
    return error("Login failed", 500);
  }
}
