import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jwdnoodles.com"),
  title: "JWD Mee Tarik",
  description: "Official website: stores, menu, halal info, news, reservation, contact",
  alternates: {
    canonical: "https://www.jwdnoodles.com",
  },
  openGraph: {
    title: "JWD Mee Tarik",
    description: "Official website: stores, menu, halal info, news, reservation, contact",
    url: "https://www.jwdnoodles.com",
    siteName: "JWD Mee Tarik",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWD Mee Tarik",
    description: "Official website: stores, menu, halal info, news, reservation, contact",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
