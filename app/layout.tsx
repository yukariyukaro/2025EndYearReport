import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Italiana, Leckerli_One, Gochi_Hand, Agdasima } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
});

const leckerliOne = Leckerli_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-leckerli-one",
});

const gochiHand = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gochi-hand",
});

const agdasima = Agdasima({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-agdasima",
});

const abhayaLibre = localFont({
  src: "./fonts/AbhayaLibre-ExtraBold.ttf",
  variable: "--font-abhaya-libre",
  weight: "800",
});

export const metadata: Metadata = {
  title: "2025年年度报告",
  description: "这是2025年年度报告的页面",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${abhayaLibre.variable} ${italiana.variable} ${leckerliOne.variable} ${gochiHand.variable} ${agdasima.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
