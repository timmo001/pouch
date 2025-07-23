import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pouch",
    short_name: "Pouch",
    description: "Store your favorite things",
    categories: ["productivity", "organizer", "notes", "lists", "tasks"],
    lang: "en-GB",
    orientation: "any",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e2e",
    theme_color: "#cdd6f4",
    shortcuts: [
      {
        name: "Home",
        url: "/",
        icons: [
          { src: "/icon", sizes: "32x32", type: "image/png" },
          { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
        ],
      },
    ],
    protocol_handlers: [
      {
        protocol: "pouch",
        url: "/",
      },
    ],
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon", sizes: "32x32", type: "image/png" },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "mobile.png",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
