import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
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
  title: {
    default: "Rabbit House",
    template: "%s | Rabbit House",
  },
  description:
    "A forever home for every rabbit. เว็บไซต์ช่วยหาบ้านให้น้องกระต่ายที่ถูกทิ้ง หรือกำลังรอครอบครัวใหม่",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="th"
      className={`${plexThai.variable} ${prompt.variable} scrollbar-gutter-stable`}
    >
      <body className="flex min-h-screen flex-col bg-white font-sans text-ink">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-7 md:px-8 md:pb-20 md:pt-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
