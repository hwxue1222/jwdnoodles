import type { MetadataRoute } from "next";

const SITE_URL = "https://www.jwdnoodles.com";
const LAST_MODIFIED = new Date("2026-06-05T00:00:00.000Z");

const ROUTES = [
  "",
  "/about",
  "/contact",
  "/halal",
  "/menu",
  "/news",
  "/reservation",
  "/stores",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
