import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopKaro — Everything you love, found before you search",
  description: "Art-directed e-commerce curated for Pakistan. Featuring personalized Two-Tower intelligence, Roman Urdu search, and artisanal local craft.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-bone text-ink selection:bg-roseclay/40 selection:text-ink">
        <div className="paper-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
