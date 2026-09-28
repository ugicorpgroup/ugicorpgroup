const CMS_URL = (process.env.STRAPI_URL || "http://127.0.0.1:1337").replace(/\/$/, "");

async function request(path) {
  try {
    const response = await fetch(`${CMS_URL}/api/${path}`, {
      headers: process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {},
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export function cmsImage(media, fallback) {
  const url = media?.url;
  if (!url) return fallback;
  return url.startsWith("http") ? url : `${CMS_URL}${url}`;
}

export async function getHomeContent() {
  const [home, services, projects, articles, trends, global] = await Promise.all([
    request("home-page?populate=*"),
    request("services?populate=*&sort=order:asc&pagination[pageSize]=50"),
    request("projects?populate=*&sort=order:asc&pagination[pageSize]=50"),
    request("articles?populate=*&sort=publishedDate:desc&pagination[pageSize]=50"),
    request("emerging-trends?populate=*&sort=order:asc&pagination[pageSize]=20"),
    request("global-setting?populate=*"),
  ]);
  return { home, services, projects, articles, trends, global };
}

export async function getPageContent(slug) {
  const [page, services, projects, articles, offices, global] = await Promise.all([
    request(`pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`),
    request("services?populate=*&sort=order:asc&pagination[pageSize]=50"),
    request("projects?populate=*&sort=order:asc&pagination[pageSize]=50"),
    request("articles?populate=*&sort=publishedDate:desc&pagination[pageSize]=50"),
    request("offices?sort=order:asc&pagination[pageSize]=50"),
    request("global-setting?populate=*"),
  ]);
  return { page: page?.[0] || null, services, projects, articles, offices, global };
}
