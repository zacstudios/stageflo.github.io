import type { Metadata } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zacstudios.github.io/"),
  title: "StageFlo | Worship Presentation Software",
  description:
    "Run worship lyrics, Bible verses, media, overlays, and multi-screen outputs from one fast live-service workflow.",
  openGraph: {
    title: "StageFlo | Worship Presentation Software",
    description:
      "Single workflow for operator, projector, stage, and lower-third output.",
    type: "website",
    url: "https://zacstudios.github.io/",
    images: [
      {
        url: "stageflo-icon.png",
        width: 512,
        height: 512,
        alt: "StageFlo icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
