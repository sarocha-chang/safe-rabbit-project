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
      className={`${plexThai.variable} ${prompt.variable} scrollbar-gutter-stable`}
    >
      {/* flex-col + flex-1 ที่ main ทำให้ footer อยู่ล่างจอเสมอ แม้หน้านั้นเนื้อหาน้อย */}
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
