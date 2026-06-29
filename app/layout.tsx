import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LumenProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: {
    default: "Lumen — Cinema, by the minute",
    template: "%s · Lumen",
  },
  description:
    "Lumen is a premium streaming home for microdramas — original, cinematic stories told in 60–120 second episodes. Binge a whole season in the time it takes to feel something.",
  applicationName: "Lumen",
  keywords: ["microdrama", "short drama", "vertical series", "streaming", "Lumen"],
  openGraph: {
    title: "Lumen — Cinema, by the minute",
    description: "Original, cinematic microdramas. A whole season in one sitting.",
    siteName: "Lumen",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-bg text-text antialiased">
        <LumenProvider>{children}</LumenProvider>
      </body>
    </html>
  );
}
