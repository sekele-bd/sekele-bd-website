import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SESSION_COOKIE = "sekele_admin_session";
const SESSION_DAYS = 7;

// Simple signed token (for production use next-auth or jose JWT)
function sign(payload: string) {
  const secret = process.env.ADMIN_SECRET || "sekele-dev-secret-change-me";
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verify(token: string): string | null {
  const secret = process.env.ADMIN_SECRET || "sekele-dev-secret-change-me";
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp && Date.now() > data.exp) return null;
    return data.adminId as string;
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return null;

  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ adminId: admin.id, exp })).toString("base64url");
  const token = sign(payload);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return { id: admin.id, email: admin.email, name: admin.name };
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const adminId = verify(token);
  if (!adminId) return null;
  return prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, name: true },
  });
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
