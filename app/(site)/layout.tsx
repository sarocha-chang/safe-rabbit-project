import SiteShell from "@/components/SiteShell";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
