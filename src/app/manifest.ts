import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const icons = [
    { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    { src: "/icon", sizes: "32x32", type: "image/png" },
  ];

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
    theme_color: "#1e1e2e",
    icons,
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "3456x1779",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "729x1577",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "Create new List Item",
        description: "Create a new list item",
        url: "/create",
        icons,
      },
    ],
    share_target: {
      action: "/create",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  };
}
