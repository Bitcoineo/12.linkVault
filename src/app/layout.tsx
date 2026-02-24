import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "LinkVault",
    template: "%s | LinkVault",
  },
  description: "Save, tag, search, and organize your bookmarks",
  keywords: ["bookmarks", "link manager", "tags", "collections"],
  openGraph: {
    title: "LinkVault",
    description: "Save, tag, search, and organize your bookmarks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen font-[family-name:var(--font-geist-sans)]`}
      >
        <div className="flex min-h-screen">
          <Suspense>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
