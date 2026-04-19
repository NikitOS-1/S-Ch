import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/shared/store";
import { InfoBanner } from "@/shared/ui";
import { Header } from "@/widgets/layout/header";
import { Footer } from "@/widgets/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StripeDemo — Sandbox payment flows",
  description: "Educational Next.js demos for Stripe Payment Link, Checkout, and Elements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <StoreProvider>
          <InfoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
