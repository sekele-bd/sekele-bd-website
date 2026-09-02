import { NextResponse } from "next/server";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseBody<T = Record<string, unknown>>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
