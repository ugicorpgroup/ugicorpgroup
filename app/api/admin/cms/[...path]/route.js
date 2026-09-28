import { cookies } from "next/headers";

const CMS_URL = (process.env.STRAPI_URL || "http://127.0.0.1:1337").replace(/\/$/, "");

async function proxy(request, context) {
  const token = (await cookies()).get("ugi_cms_token")?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { path } = await context.params;
    const headers = { Authorization: `Bearer ${token}` };
    const contentType = request.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
    const init = { method: request.method, headers, cache: "no-store" };
    if (!["GET", "HEAD"].includes(request.method)) init.body = await request.arrayBuffer();
    const response = await fetch(`${CMS_URL}/api/cms-admin/${path.join("/")}`, init);
    const body = await response.arrayBuffer();
    if (!body.byteLength) {
      return Response.json({ error: response.ok ? "The CMS returned an empty response." : "The CMS could not process this request." }, { status: response.ok ? 502 : response.status });
    }
    return new Response(body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") || "application/json" } });
  } catch (error) {
    console.error("CMS proxy request failed:", error);
    return Response.json({ error: "The CMS is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
