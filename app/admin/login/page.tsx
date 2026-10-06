"use client";

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/admin/AuthProvider";
import FormField, { inputClassName } from "@/components/FormField";
import { demoAccount } from "@/lib/demo-account";
import { auth } from "@/lib/firebase-auth";

interface LoginFormValues {
  email: string;
  password: string;
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/invalid-credential") {
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    }
    if (error.code === "auth/too-many-requests") {
      return "ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่";
    }
  }
  return "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
}

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [useDemo, setUseDemo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const hasDemoAccount =
    demoAccount.email !== "" && demoAccount.password !== "";

  function toggleDemo(checked: boolean) {
    setUseDemo(checked);
    setLoginError("");
    setValue("email", checked ? demoAccount.email : "", {
      shouldValidate: checked,
    });
    setValue("password", checked ? demoAccount.password : "", {
      shouldValidate: checked,
    });
  }

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, router]);

  async function onSubmit(data: LoginFormValues) {
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.replace("/admin");
    } catch (error) {
      setLoginError(getLoginErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-cream/40 px-5 py-16">
      <div className="w-full max-w-sm animate-fade-up space-y-6 motion-reduce:animate-none">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-lg font-medium text-ink"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-carrot" />
            Rabbit House
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-ink">
            เข้าสู่ระบบผู้ดูแล
          </h1>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8"
        >
          <FormField
            label="อีเมล"
            htmlFor="email"
            error={errors.email?.message}
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              readOnly={useDemo}
              {...register("email", { required: "กรุณากรอกอีเมล" })}
              className={`${inputClassName} read-only:text-muted`}
            />
          </FormField>

          <FormField
            label="รหัสผ่าน"
            htmlFor="password"
            error={errors.password?.message}
          >
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              readOnly={useDemo}
              {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
              className={`${inputClassName} read-only:text-muted`}
            />
          </FormField>
          {hasDemoAccount && (
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-carrot-soft px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-ink">
                  ใช้บัญชี demo
                </span>
                <span className="block text-xs text-muted">
                  เพื่อทดลองอนุมัติคำร้อง ข้อมูลภายในระบบ
                  <br />
                  จะถูกรีเซ็ตใหม่ทุกเที่ยงคืน
                </span>
              </span>
              <input
                type="checkbox"
                checked={useDemo}
                onChange={(event) => toggleDemo(event.target.checked)}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-carrot after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
            </label>
          )}

          {loginError && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <Link
          href="/"
          className="block text-center text-sm text-muted transition hover:text-carrot-dark"
        >
          ← กลับหน้าเว็บ
        </Link>
      </div>
    </div>
  );
}
