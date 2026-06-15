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
  metadataBase: new URL("https://stageflo.app/"),
  title: {
    default: "StageFlo | Worship Presentation Software",
    template: "%s | StageFlo",
  },
  description:
    "Free multilingual worship presentation software for churches. Run songs, Bible verses, media, overlays, and multi-screen outputs.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    siteName: "StageFlo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo — Free Worship Presentation Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zac Studios",
    url: "https://stageflo.app/",
    logo: "https://stageflo.app/brand/zac-studios-logo.png",
    email: "zac@stageflo.app",
    sameAs: ["https://github.com/zacstudios/Stageflo.app"],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StageFlo",
    url: "https://stageflo.app/",
    description:
      "StageFlo is free multilingual worship presentation software for churches, worship teams, and live services.",
    publisher: {
      "@type": "Organization",
      name: "Zac Studios",
      url: "https://stageflo.app/",
    },
  };

  return (
    <html lang="en" className={`${sora.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
}
