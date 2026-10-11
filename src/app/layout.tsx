import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PersonJsonLd } from "@/components/seo/person-jsonld";
import { AskWidget } from "@/components/assistant/ask-widget";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: "%s — Md. Mahmudun Nobi" },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Md. Mahmudun Nobi",
    title: siteName,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PersonJsonLd />
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Analytics />
        </ThemeProvider>
        <AskWidget />
        <noscript>
          <p>
            JavaScript is disabled — browse the <Link href="/projects">projects</Link> or{" "}
            <Link href="/contact">get in touch</Link> directly.
          </p>
        </noscript>
      </body>
    </html>
  );
}
