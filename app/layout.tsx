import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const abhayaLibre = localFont({
  src: "./fonts/AbhayaLibre-ExtraBold.ttf",
  variable: "--font-abhaya-libre",
  weight: "800",
});

export const metadata: Metadata = {
  title: "2025年年度报告",
  description: "这是2025年年度报告的页面",
  icons: {
    icon: "/triple-uni.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${abhayaLibre.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
