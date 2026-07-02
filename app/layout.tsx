import { Providers } from "./provider";
import { WebVitals } from "@/components/WebVitals";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Recalled — AI meeting intelligence",
  description:
    "Transcribe, summarize, and chat with every meeting. Recalled extracts decisions, assigns action items, and turns recordings into searchable memory.",
};


export default function RootLayout({ children }: { children: React.ReactNode })  {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
};