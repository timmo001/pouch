import { ImageResponse } from "next/og";
import { Logo } from "~/components/assets/logo";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(<Logo width={size.width} height={size.height} />, {
    ...size,
  });
}
