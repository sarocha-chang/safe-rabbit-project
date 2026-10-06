"use client";

import { useAuth } from "@/components/admin/AuthProvider";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-carrot">Dashboard</p>
      <h1 className="font-heading text-3xl font-semibold text-ink">
        ยินดีต้อนรับ
      </h1>
      <p className="text-muted">เข้าสู่ระบบด้วย {user?.email}</p>
    </div>
  );
}
