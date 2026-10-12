import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import Analytics from "@/components/Analytics";
import BrainBackdrop from "@/components/BrainBackdrop";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { organizationJsonLd, serviceJsonLd } from "@/lib/structured-data";
import { siteUrl } from "@/lib/site";
import { content } from "@/content/content";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono-brand",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: content.meta.title,
    template: `%s · ${content.brand.name}`,
  },
  description: content.meta.description,
  keywords: [...content.meta.keywords],
  applicationName: content.brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: content.brand.name,
    title: content.meta.title,
    description: content.meta.description,
    // og:image comes from app/opengraph-image.tsx via the file convention.
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.title,
    description: content.meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#070B1F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, serviceJsonLd]),
          }}
        />

        <a href="#main" className="skip-link card-surface rounded-md px-4 py-2 text-sm font-medium">
          Skip to main content
        </a>

        {/* Brain loading screen. Pure CSS, clears itself after ~3.5s. */}
        <LoadingScreen />

        {/* Fixed visual layer. Everything below scrolls over it. */}
        <BrainBackdrop />

        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  );
}
