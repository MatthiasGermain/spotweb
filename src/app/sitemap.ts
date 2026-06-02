import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/notre-histoire", "/services", "/contact"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
