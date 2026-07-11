import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PushNotificationModal } from "@/components/layout/PushNotificationModal";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SENKAI | Modern Anime Tracker",
  description: "Track your favorite anime, get real-time airing push notifications, discover new shows, and view the release calendar in a beautiful modern UI.",
  metadataBase: new URL('https://www.senkaihub.com'),
  openGraph: {
    title: "SENKAI | Modern Anime Tracker",
    description: "Track your favorite anime, get real-time airing push notifications, discover new shows, and view the release calendar.",
    url: 'https://www.senkaihub.com',
    siteName: 'SENKAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SENKAI | Modern Anime Tracker',
    description: 'Track your favorite anime, get real-time airing push notifications, discover new shows, and view the release calendar.',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SENKAI"
  }
};

import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden pb-20 lg:pb-0">
        <NextTopLoader 
          color="#e71014"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #e71014,0 0 5px #e71014"
        />
        <SplashScreen />
        {children}
        <Toaster position="top-center" />
        <Suspense fallback={null}>
          <PushNotificationModal />
        </Suspense>
        <MobileBottomNav />
        <Analytics />
      </body>
    </html>
  );
}
