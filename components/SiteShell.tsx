import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface SiteShellProps {
  children: React.ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-7 md:px-8 md:pb-20 md:pt-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
