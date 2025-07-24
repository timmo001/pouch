import { ImageResponse } from "next/og";
import { Logo } from "~/components/assets/logo";

// Create the OpenGraph image for the app, found at /api/og and linked in the layout manifest
// This is used by social applications to display a preview of the app when shared
// on platforms like Twitter, Discord and WhatsApp
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#cdd6f4",
          backgroundColor: "#1e1e2e",
          fontSize: 128,
          fontWeight: 600,
        }}
      >
        <Logo height={400} width={400} />

        <div style={{ marginTop: 8 }}>Pouch</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
