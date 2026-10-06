"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Dropdown from "@/components/Dropdown";
import FormField, { inputClassName } from "@/components/FormField";
import { getRabbitStatusLabel } from "@/lib/rabbit-display";
import type { RabbitStatus } from "@/types/rabbit";

interface RabbitOption {
  id: string;
  name: string;
  status: RabbitStatus;
}

interface AdoptionFormProps {
  rabbits: RabbitOption[];
  defaultRabbitId?: string;
}

interface AdoptionFormValues {
  rabbitId: string;
  applicationType: "adopt" | "sponsor";
  fullName: string;
  occupation: string;
  phone: string;
  email: string;
  introduction: string;
  housingType: string;
  keepIndoor: "yes" | "no";
  hasAirCon: "yes" | "no";
  acceptCosts: boolean;
  canVisitVet: boolean;
}

const applicationTypes = [
  {
    value: "adopt",
    label: "รับเลี้ยง",
    description: "รับน้องไปอยู่ด้วยเป็นสมาชิกในครอบครัว",
  },
  {
    value: "sponsor",
    label: "อุปถัมภ์",
    description: "ช่วยสนับสนุนค่าอาหารและค่ารักษา น้องยังอยู่ที่ Rabbit House",
  },
];

const housingTypes = [
  "บ้านเดี่ยว",
  "ทาวน์เฮาส์",
  "คอนโด / อพาร์ตเมนต์",
  "หอพัก",
];

const yesNoOptions = [
  { value: "yes", label: "ใช่" },
  { value: "no", label: "ไม่ใช่" },
];

export default function AdoptionForm({
  rabbits,
  defaultRabbitId,
}: AdoptionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdoptionFormValues>({
    defaultValues: { rabbitId: defaultRabbitId ?? "" },
  });

  const [submittedData, setSubmittedData] = useState<AdoptionFormValues | null>(
    null,
  );

  const onSubmit = (data: AdoptionFormValues) => {
    setSubmittedData(data);
  };

  if (submittedData) {
    return (
      <div className="space-y-4 rounded-3xl border border-line bg-white p-10 text-center shadow-sm">
        <p className="font-heading text-2xl font-semibold text-ink">
          ขอบคุณที่สนใจน้องนะ 🐰
        </p>
        <p className="text-muted">
          ได้รับข้อมูลของคุณ {submittedData.fullName} แล้ว
          <br />
          (ตอนนี้เป็นฟอร์มตัวอย่าง ยังไม่ได้ส่งข้อมูลจริง)
        </p>
        <button
          onClick={() => setSubmittedData(null)}
          className="rounded-full border border-line px-6 py-3 text-sm text-ink transition hover:border-carrot hover:text-carrot-dark"
        >
          กรอกฟอร์มใหม่
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-10"
    >
      <section className="space-y-6">
        <h2 className="font-heading text-xl font-semibold text-ink">
          1. น้องที่สนใจ
        </h2>

        <FormField
          label="เลือกน้อง"
          htmlFor="rabbitId"
          error={errors.rabbitId?.message}
        >
          <Controller
            name="rabbitId"
            control={control}
            rules={{ required: "กรุณาเลือกน้องที่สนใจ" }}
            render={({ field }) => (
              <Dropdown
                id="rabbitId"
                size="md"
                placeholder="— เลือกน้อง —"
                value={field.value}
                onChange={field.onChange}
                options={rabbits.map((rabbit) => ({
                  value: rabbit.id,
                  label: `${rabbit.name} (${getRabbitStatusLabel(rabbit.status)})`,
                }))}
              />
            )}
          />
        </FormField>

        <FormField
          label="ต้องการ"
          htmlFor="applicationType-adopt"
          error={errors.applicationType?.message}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {applicationTypes.map((type) => (
              <label
                key={type.value}
                htmlFor={`applicationType-${type.value}`}
                className="flex cursor-pointer gap-3 rounded-2xl border border-line p-4 transition hover:border-carrot has-checked:border-carrot has-checked:bg-carrot-soft"
              >
                <input
                  id={`applicationType-${type.value}`}
                  type="radio"
                  value={type.value}
                  {...register("applicationType", {
                    required: "กรุณาเลือกว่าต้องการรับเลี้ยงหรืออุปถัมภ์",
                  })}
                  className="mt-1 accent-carrot"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {type.label}
                  </span>
                  <span className="block text-sm text-muted">
                    {type.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </FormField>
      </section>

      <section className="space-y-6 border-t border-line pt-10">
        <h2 className="font-heading text-xl font-semibold text-ink">
          2. ข้อมูลผู้สมัคร
        </h2>

        <FormField
          label="ชื่อ-นามสกุล"
          htmlFor="fullName"
          error={errors.fullName?.message}
        >
          <input
            id="fullName"
            {...register("fullName", { required: "กรุณากรอกชื่อ-นามสกุล" })}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="อาชีพ"
          htmlFor="occupation"
          error={errors.occupation?.message}
        >
          <input
            id="occupation"
            {...register("occupation", { required: "กรุณากรอกอาชีพ" })}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="เบอร์โทรศัพท์"
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <input
            id="phone"
            type="tel"
            placeholder="0812345678"
            {...register("phone", {
              required: "กรุณากรอกเบอร์โทรศัพท์",
              pattern: {
                value: /^0\d{8,9}$/,
                message: "เบอร์โทรไม่ถูกต้อง (ตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0)",
              },
            })}
            className={inputClassName}
          />
        </FormField>

        <FormField label="อีเมล" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register("email", {
              required: "กรุณากรอกอีเมล",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "อีเมลไม่ถูกต้อง เช่น name@example.com",
              },
            })}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="แนะนำตัว"
          htmlFor="introduction"
          error={errors.introduction?.message}
        >
          <textarea
            id="introduction"
            placeholder="เช่น ไลฟ์สไตล์ ประสบการณ์เลี้ยงสัตว์ ทำไมถึงอยากรับน้อง"
            rows={4}
            {...register("introduction", {
              required: "กรุณาแนะนำตัวเองสั้นๆ",
              minLength: {
                value: 20,
                message: "ช่วยเล่าเพิ่มอีกนิด (อย่างน้อย 20 ตัวอักษร)",
              },
            })}
            className={inputClassName}
          />
        </FormField>
      </section>

      <section className="space-y-6 border-t border-line pt-10">
        <h2 className="font-heading text-xl font-semibold text-ink">
          3. เรื่องบ้าน
        </h2>

        <FormField
          label="ที่พักของคุณเป็นแบบไหน"
          htmlFor="housingType-0"
          error={errors.housingType?.message}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {housingTypes.map((type, index) => (
              <label
                key={type}
                htmlFor={`housingType-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm text-ink transition hover:border-carrot has-checked:border-carrot has-checked:bg-carrot-soft"
              >
                <input
                  id={`housingType-${index}`}
                  type="radio"
                  value={type}
                  {...register("housingType", {
                    required: "กรุณาเลือกประเภทที่พัก",
                  })}
                  className="accent-carrot"
                />
                {type}
              </label>
            ))}
          </div>
        </FormField>
        <FormField
          label="เลี้ยงน้องภายในบ้านได้ไหม"
          htmlFor="keepIndoor"
          error={errors.keepIndoor?.message}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {yesNoOptions.map((option, index) => (
              <label
                key={index}
                htmlFor={`keepIndoor-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm text-ink transition hover:border-carrot has-checked:border-carrot has-checked:bg-carrot-soft"
              >
                <input
                  id={`keepIndoor-${index}`}
                  type="radio"
                  value={option.value}
                  {...register("keepIndoor", {
                    required: "กรุณาเลือกคำตอบ",
                  })}
                  className="accent-carrot"
                />
                {option.label}
              </label>
            ))}
          </div>
        </FormField>
        <FormField
          label="มีห้องแอร์ให้น้องไหม"
          htmlFor="hasAirCon"
          error={errors.hasAirCon?.message}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {yesNoOptions.map((option, index) => (
              <label
                key={index}
                htmlFor={`hasAirCon-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm text-ink transition hover:border-carrot has-checked:border-carrot has-checked:bg-carrot-soft"
              >
                <input
                  id={`hasAirCon-${index}`}
                  type="radio"
                  value={option.value}
                  {...register("hasAirCon", {
                    required: "กรุณาเลือกคำตอบ",
                  })}
                  className="accent-carrot"
                />
                {option.label}
              </label>
            ))}
          </div>
        </FormField>
        <div className="space-y-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-sm text-ink transition has-checked:border-carrot has-checked:bg-carrot-soft">
            <input
              type="checkbox"
              {...register("acceptCosts", { required: "กรุณายืนยันข้อนี้" })}
              className="mt-0.5 accent-carrot"
            />
            ฉันพร้อมรับผิดชอบค่าใช้จ่ายในการเลี้ยงดูและค่ารักษาพยาบาลของน้อง
          </label>
          {errors.acceptCosts && (
            <p className="text-sm text-red-600">{errors.acceptCosts.message}</p>
          )}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-sm text-ink transition has-checked:border-carrot has-checked:bg-carrot-soft">
            <input
              type="checkbox"
              {...register("canVisitVet", { required: "กรุณายืนยันข้อนี้" })}
              className="mt-0.5 accent-carrot"
            />
            ฉันสามารถพาน้องไปพบสัตวแพทย์ได้เมื่อน้องเจ็บป่วย
          </label>
          {errors.canVisitVet && (
            <p className="text-sm text-red-600">{errors.canVisitVet.message}</p>
          )}
        </div>
      </section>
      <button
        type="submit"
        className="rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
      >
        ส่งแบบฟอร์ม
      </button>

      {submittedData && (
        <pre className="rounded-2xl bg-cream p-4 text-xs text-ink">
          {JSON.stringify(submittedData, null, 2)}
        </pre>
      )}
    </form>
  );
}
