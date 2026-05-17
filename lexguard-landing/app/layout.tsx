import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LexGuard — Contract Intelligence",
  description:
    "Every contract is written by their lawyer. LexGuard is yours. Spot the traps, understand the risks, push back with precision.",
  keywords: ["contract analysis", "AI", "legal", "employment contract", "non-compete", "IP clause"],
  openGraph: {
    title: "LexGuard — Contract Intelligence",
    description: "Spot every clause designed to hurt you. Know exactly how to push back.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
