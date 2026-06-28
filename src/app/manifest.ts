import type { MetadataRoute } from "next";

const SITE_URL = "https://www.jwdnoodles.com";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JWD Mee Tarik",
    short_name: "JWD Mee Tarik",
    description: "Official website: stores, menu, halal info, news, reservation, contact",
    start_url: `${SITE_URL}/`,
    scope: `${SITE_URL}/`,
    display: "standalone",
    background_color: "#f5f6ec",
    theme_color: "#f5f6ec",
    icons: [
      {
        src: "/images/brand/icon.png",
        sizes: "253x256",
        type: "image/png",
      },
      {
        src: "/images/brand/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
