"use client";

import { ArrowUpRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/admin/AuthProvider";

const adminNavItems = [{ label: "Dashboard", href: "/admin" }];

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const { user, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        กำลังโหลด...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center px-5">
        <div className="max-w-sm space-y-4 rounded-3xl border border-line bg-white p-8 text-center shadow-sm">
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
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading text-lg font-medium text-ink"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-carrot" />
              Rabbit House
              <span className="rounded-full bg-carrot-soft px-2 py-0.5 text-xs text-carrot-dark">
                Admin
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "rounded-full bg-cream px-3 py-1.5 text-sm text-ink"
                      : "rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-cream hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-muted transition hover:text-carrot-dark"
            >
              ดูหน้าเว็บ
              <ArrowUpRight size={14} />
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-muted transition hover:border-carrot hover:text-carrot-dark"
            >
              <LogOut size={14} />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
