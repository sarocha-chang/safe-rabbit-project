"use client";

import {
  ArrowUpRight,
  Inbox,
  LayoutDashboard,
  LogOut,
  Rabbit,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminFooter from "@/components/admin/AdminFooter";
import { useAuth } from "@/components/admin/AuthProvider";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "คำร้อง", href: "/admin/applications", icon: Inbox },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const { user, isAdmin, role, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <>
        {children}
        <AdminFooter />
      </>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted">
        <Rabbit size={32} className="animate-pulse text-carrot" />
        กำลังโหลด...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center px-5">
        <div className="max-w-sm animate-fade-up space-y-4 rounded-3xl border border-line bg-white p-8 text-center shadow-sm motion-reduce:animate-none">
          <p className="font-heading text-xl font-semibold text-ink">
            บัญชีนี้ไม่มีสิทธิ์เข้าหน้าผู้ดูแล
          </p>
          <p className="text-sm text-muted">{user.email}</p>
          <button
            onClick={logout}
            className="rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white transition hover:bg-carrot-dark"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-cream/40">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="flex h-14 items-center justify-between gap-3 md:h-16">
            <div className="flex min-w-0 items-center gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 whitespace-nowrap font-heading text-base font-medium text-ink md:text-lg"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-carrot" />
                Rabbit House
                <span className="rounded-full bg-carrot-soft px-2 py-0.5 text-[11px] font-normal text-carrot-dark md:text-xs">
                  {role === "demo" ? "Demo" : "Admin"}
                </span>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActivePath(pathname, item.href)
                        ? "inline-flex items-center gap-1.5 rounded-full bg-carrot-soft px-3 py-1.5 text-sm font-medium text-carrot-dark"
                        : "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-cream hover:text-ink"
                    }
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-sm md:gap-2">
              <span className="hidden max-w-48 truncate text-xs text-muted lg:inline">
                {user.email}
              </span>
              <Link
                href="/"
                aria-label="ดูหน้าเว็บ"
                className="inline-flex h-9 w-9 items-center justify-center gap-1 rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark md:w-auto md:px-3"
              >
                <span className="hidden md:inline">ดูหน้าเว็บ</span>
                <ArrowUpRight size={16} />
              </Link>
              <button
                onClick={logout}
                aria-label="ออกจากระบบ"
                className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark md:w-auto md:px-3"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>

          <nav className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-cream p-1 md:hidden">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActivePath(pathname, item.href)
                    ? "inline-flex items-center justify-center gap-1.5 rounded-full bg-white py-1.5 text-sm font-medium text-carrot-dark shadow-sm"
                    : "inline-flex items-center justify-center gap-1.5 rounded-full py-1.5 text-sm text-muted transition hover:text-ink"
                }
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main
        key={pathname}
        className="mx-auto w-full max-w-6xl flex-1 animate-fade-in px-5 py-6 motion-reduce:animate-none md:px-8 md:py-10"
      >
        {children}
      </main>

      <AdminFooter />
    </div>
  );
}
