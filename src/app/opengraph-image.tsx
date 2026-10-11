import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#101014",
          color: "#f2f2f0",
        }}
      >
        <div style={{ fontSize: 32 }}>MD. MAHMUDUN NOBI / AI ENGINEER</div>
        <div style={{ fontSize: 64, marginTop: 24 }}>
          Building intelligent systems that work beyond the prototype.
        </div>
      </div>
    ),
    { ...size },
  );
}
