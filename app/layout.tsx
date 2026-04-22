import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "checkmiete.ch \u2013 Alles was du \u00fcber deine Wohnung wissen musst",
  description:
    "Pr\u00fcfe in Sekunden ob deine Miete fair ist, analysiere die Umgebung und kenne deine Rechte. Kostenlos, ohne Login.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink-bg text-[var(--fg)] antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"dark";if(t==="system"){if(!window.matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("light")}else if(t==="light"){document.documentElement.classList.add("light")}}catch(e){}})()`,
          }}
        />
        <I18nProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
