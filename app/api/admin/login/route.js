import { NextResponse } from "next/server";

const CMS_URL = (process.env.STRAPI_URL || "http://127.0.0.1:1337").replace(/\/$/, "");

export async function POST(request) {
  const response = await fetch(`${CMS_URL}/api/cms-admin/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: await request.text(), cache: "no-store",
  });
  const data = await response.json().catch(() => ({ error: "Unable to reach the CMS." }));
  if (!response.ok) return NextResponse.json({ error: data.error?.message || data.error || "Invalid login." }, { status: response.status });
  const result = NextResponse.json({ user: data.user });
  result.cookies.set("ugi_cms_token", data.token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return result;
}
