import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// One web font (headings). Body text uses the native system UI font: zero download, fastest layout.
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Flower Delivery | Send Flowers Online Same Day | FlowerVsFlorist",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7a1f5c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
