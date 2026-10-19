import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const petals = [0, 72, 144, 216, 288];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#7a1f5c" }}>
        <svg width="140" height="140" viewBox="-32 -32 64 64">
          {petals.map((r) => (
            <ellipse key={r} rx="7.5" ry="12" fill="#f43f5e" transform={`rotate(${r}) translate(0 -11)`} />
          ))}
          <circle r="6.5" fill="#f5a524" />
        </svg>
      </div>
    ),
    size,
  );
}
