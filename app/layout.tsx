import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-plex-thai",
  weight: ["300", "400", "500", "600"],
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Safe Rabbit Project",
  description: "Rabbit adoption project",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // [scrollbar-gutter:stable] จองที่ให้ scrollbar ไว้ทุกหน้า nav จะได้ไม่ขยับตอนเปลี่ยนหน้า
    <html
      lang="th"
      className={`${plexThai.variable} ${prompt.variable} [scrollbar-gutter:stable]`}
    >
      <body className="bg-white font-sans text-ink">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-5 py-7 md:px-8 md:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
