import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n/context";

const SITE_URL = "https://checkmiete.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "checkmiete.ch \u2013 Alles was du \u00fcber deine Wohnung wissen musst",
    template: "%s \u00b7 checkmiete.ch",
  },
  description:
    "Pr\u00fcfe in Sekunden ob deine Miete fair ist, analysiere die Umgebung und kenne deine Rechte. Kostenlos, ohne Login.",
  applicationName: "checkmiete.ch",
  authors: [{ name: "checkmiete.ch" }],
  keywords: [
    "Miete",
    "Mietpreis",
    "Schweiz",
    "checkmiete",
    "fair Miete",
    "Mietzinssenkung",
    "Mietrecht",
    "BFS",
    "Tragbarkeit",
  ],
  openGraph: {
    type: "website",
    siteName: "checkmiete.ch",
    title: "checkmiete.ch \u2013 Alles was du \u00fcber deine Wohnung wissen musst",
    description:
      "Pr\u00fcfe in Sekunden ob deine Miete fair ist, analysiere die Umgebung und kenne deine Rechte.",
    locale: "de_CH",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "checkmiete.ch",
    description:
      "Pr\u00fcfe in Sekunden ob deine Miete fair ist. Kostenlos, ohne Login.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"dark";if(t==="system"){if(!window.matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("light")}else if(t==="light"){document.documentElement.classList.add("light")}}catch(e){}})()`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink-bg text-[var(--fg)] antialiased">
        <I18nProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
