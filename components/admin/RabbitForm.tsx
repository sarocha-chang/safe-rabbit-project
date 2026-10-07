"use client";

import { ImagePlus, Lock, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useAuth } from "@/components/admin/AuthProvider";
import Dropdown from "@/components/Dropdown";
import FormField, { inputClassName } from "@/components/FormField";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import {
  createRabbit,
  updateRabbit,
  type RabbitInput,
} from "@/lib/rabbit-admin-service";
import { rabbitBreeds } from "@/lib/rabbit-breeds";
import { formatAgeMonth } from "@/lib/rabbit-display";
import type { Rabbit, RabbitGender, RabbitStatus } from "@/types/rabbit";

const NO_CONDITION = "ไม่มีโรค";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const statusOptions: { label: string; value: RabbitStatus }[] = [
  { label: "หาบ้าน", value: "available" },
  { label: "อุปถัมภ์", value: "sponsored" },
  { label: "ได้บ้านแล้ว", value: "adopted" },
  { label: "น้องประจำบ้าน", value: "resident" },
  { label: "กลับดาว", value: "passed_away" },
];

interface RabbitFormValues {
  name: string;
  gender: RabbitGender;
  ageMonth: number;
  breeds: string[];
  neutered: "yes" | "no";
  hasMedicalCondition: "yes" | "no";
  medicalConditionText: string;
  status: RabbitStatus;
  intakeDate: string;
  adoptedDate: string;
  motto: string;
  story: string;
  isActive: boolean;
}

interface NewImage {
  file: File;
  preview: string;
}

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

function getDefaultValues(rabbit?: Rabbit): RabbitFormValues {
  const hasCondition =
    !!rabbit?.medicalCondition && rabbit.medicalCondition !== NO_CONDITION;

  return {
    name: rabbit?.name ?? "",
    gender: rabbit?.gender ?? "female",
    ageMonth: rabbit?.ageMonth ?? 0,
    breeds: rabbit?.breeds ?? [],
    neutered: rabbit?.neutered ? "yes" : "no",
    hasMedicalCondition: hasCondition ? "yes" : "no",
    medicalConditionText: hasCondition ? rabbit!.medicalCondition : "",
    status: rabbit?.status ?? "available",
    intakeDate: toDateInputValue(rabbit?.intakeDate ?? new Date()),
    adoptedDate: toDateInputValue(rabbit?.adoptedDate),
    motto: rabbit?.motto ?? "",
    story: rabbit?.story ?? "",
    isActive: rabbit?.isActive ?? true,
  };
}

interface RabbitFormProps {
  rabbit?: Rabbit;
}

export default function RabbitForm({ rabbit }: RabbitFormProps) {
  const { role } = useAuth();
  const router = useRouter();
  const isOwner = role === "owner";
  const isEditing = !!rabbit;
  const isDemoRabbit = rabbit ? !!rabbit.createdByDemo : role === "demo";
  const canSave = isOwner || (role === "demo" && isDemoRabbit);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RabbitFormValues>({ defaultValues: getDefaultValues(rabbit) });

  const [coverImage, setCoverImage] = useState(rabbit?.coverImage ?? "");
  const [newCover, setNewCover] = useState<NewImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    rabbit?.images ?? [],
  );
  const [newGallery, setNewGallery] = useState<NewImage[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const status = useWatch({ control, name: "status" });
  const hasMedicalCondition = useWatch({
    control,
    name: "hasMedicalCondition",
  });
  const ageMonth = useWatch({ control, name: "ageMonth" });

  function getValidImages(files: FileList | null) {
    if (!files) return [];
    const valid = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_IMAGE_SIZE,
    );
    setImageError(
      valid.length < files.length
        ? "บางไฟล์ไม่ใช่รูปภาพ หรือใหญ่เกิน 5 MB จึงไม่ได้เพิ่ม"
        : "",
    );
    return valid;
  }

  function changeCover(files: FileList | null) {
    const [file] = getValidImages(files);
    if (!file) return;
    if (coverImage) setRemovedImageUrls((urls) => [...urls, coverImage]);
    if (newCover) URL.revokeObjectURL(newCover.preview);
    setCoverImage("");
    setNewCover({ file, preview: URL.createObjectURL(file) });
  }

  function addGalleryImages(files: FileList | null) {
    const images = getValidImages(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewGallery((current) => [...current, ...images]);
  }

  function removeGalleryImage(url: string) {
    setGalleryImages((current) => current.filter((item) => item !== url));
    setRemovedImageUrls((urls) => [...urls, url]);
  }

  function removeNewGalleryImage(preview: string) {
    URL.revokeObjectURL(preview);
    setNewGallery((current) =>
      current.filter((item) => item.preview !== preview),
    );
  }

  async function onSubmit(values: RabbitFormValues) {
    if (!canSave) return;
    setSubmitError("");

    if (!coverImage && !newCover) {
      setImageError("กรุณาเลือกรูปปก");
      return;
    }

    const input: RabbitInput = {
      name: values.name.trim(),
      gender: values.gender,
      ageMonth: values.ageMonth,
      breeds: values.breeds,
      neutered: values.neutered === "yes",
      medicalCondition:
        values.hasMedicalCondition === "yes"
          ? values.medicalConditionText.trim()
          : NO_CONDITION,
      status: values.status,
      intakeDate: fromDateInputValue(values.intakeDate),
      adoptedDate:
        values.status === "adopted" && values.adoptedDate
          ? fromDateInputValue(values.adoptedDate)
          : null,
      motto: values.motto.trim(),
      story: values.story.trim(),
      isActive: isOwner ? values.isActive : false,
      createdByDemo: isDemoRabbit,
      coverImage,
      images: galleryImages,
    };

    const changes = {
      newCoverFile: newCover?.file ?? null,
      newGalleryFiles: newGallery.map((item) => item.file),
      removedImageUrls,
    };

    try {
      if (rabbit) {
        await updateRabbit(rabbit.id, input, changes);
      } else {
        await createRabbit(input, changes);
      }
      router.push("/admin/rabbits");
    } catch {
      setSubmitError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  }

  const coverPreview = newCover?.preview ?? coverImage;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-3"
    >
      <div className="space-y-6 lg:col-span-2">
        <FormCard title="ข้อมูลพื้นฐาน">
          <FormField
            label="ชื่อน้อง"
            htmlFor="name"
            error={errors.name?.message}
          >
            <input
              id="name"
              {...register("name", { required: "กรุณากรอกชื่อน้อง" })}
              className={inputClassName}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="เพศ" htmlFor="gender">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <SegmentedChoice
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "เพศเมีย", value: "female" },
                      { label: "เพศผู้", value: "male" },
                    ]}
                  />
                )}
              />
            </FormField>

            <FormField
              label="อายุ (เดือน)"
              htmlFor="ageMonth"
              error={errors.ageMonth?.message}
            >
              <input
                id="ageMonth"
                type="number"
                min={0}
                {...register("ageMonth", {
                  valueAsNumber: true,
                  required: "กรุณากรอกอายุ",
                  min: { value: 0, message: "อายุต้องไม่ติดลบ" },
                })}
                className={inputClassName}
              />
              {Number.isFinite(ageMonth) && ageMonth > 0 && (
                <p className="px-1 text-xs text-muted">
                  = {formatAgeMonth(ageMonth)}
                </p>
              )}
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="สายพันธุ์" htmlFor="breeds">
              <Controller
                name="breeds"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={rabbitBreeds}
                    selected={field.value}
                    onChange={field.onChange}
                    emptyText="เลือกสายพันธุ์"
                    showSelectedNames
                    className="w-full"
                  />
                )}
              />
            </FormField>

            <FormField
              label="วันที่รับเข้า"
              htmlFor="intakeDate"
              error={errors.intakeDate?.message}
            >
              <input
                id="intakeDate"
                type="date"
                {...register("intakeDate", {
                  required: "กรุณาเลือกวันที่รับเข้า",
                })}
                className={inputClassName}
              />
            </FormField>
          </div>
        </FormCard>

        <FormCard title="สุขภาพ">
          <FormField label="การทำหมัน" htmlFor="neutered">
            <Controller
              name="neutered"
              control={control}
              render={({ field }) => (
                <SegmentedChoice
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "ทำหมันแล้ว", value: "yes" },
                    { label: "ยังไม่ได้ทำหมัน", value: "no" },
                  ]}
                />
              )}
            />
          </FormField>

          <FormField
            label="โรคประจำตัว"
            htmlFor="medicalConditionText"
            error={errors.medicalConditionText?.message}
          >
            <Controller
              name="hasMedicalCondition"
              control={control}
              render={({ field }) => (
                <SegmentedChoice
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: NO_CONDITION, value: "no" },
                    { label: "มีโรคประจำตัว", value: "yes" },
                  ]}
                />
              )}
            />
            {hasMedicalCondition === "yes" && (
              <input
                id="medicalConditionText"
                placeholder="เช่น ฟันยาวผิดปกติ ต้องตัดฟันทุก 2 เดือน"
                {...register("medicalConditionText", {
                  validate: (value, formValues) =>
                    formValues.hasMedicalCondition === "no" ||
                    value.trim() !== "" ||
                    "กรุณาระบุโรคประจำตัว",
                })}
                className={`${inputClassName} mt-2`}
              />
            )}
          </FormField>
        </FormCard>

        <FormCard title="เรื่องราว">
          <FormField
            label="Motto"
            htmlFor="motto"
            error={errors.motto?.message}
          >
            <input
              id="motto"
              placeholder="เช่น กระต่ายตัวน้อย ร่าเริงรักผู้คน"
              {...register("motto", { required: "กรุณากรอก motto" })}
              className={inputClassName}
            />
          </FormField>

          <FormField
            label="เรื่องราวของน้อง"
            htmlFor="story"
            error={errors.story?.message}
          >
            <textarea
              id="story"
              rows={5}
              {...register("story", { required: "กรุณาเล่าเรื่องราวของน้อง" })}
              className={inputClassName}
            />
          </FormField>
        </FormCard>
      </div>

      <div className="space-y-6">
        <FormCard title="รูปภาพ">
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">รูปปก</p>
            <label className="group relative flex aspect-4/3 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-cream/50 transition hover:border-carrot">
              {coverPreview ? (
                <>
                  <Image
                    src={coverPreview}
                    alt="รูปปก"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs text-ink shadow-sm">
                    เปลี่ยนรูป
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm text-muted">
                  <ImagePlus size={24} />
                  เลือกรูปปก
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  changeCover(event.target.files);
                  event.target.value = "";
                }}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">รูปเพิ่มเติม</p>
            <div className="grid grid-cols-3 gap-2">
              {galleryImages.map((url) => (
                <ImageThumb
                  key={url}
                  src={url}
                  onRemove={() => removeGalleryImage(url)}
                />
              ))}
              {newGallery.map((item) => (
                <ImageThumb
                  key={item.preview}
                  src={item.preview}
                  onRemove={() => removeNewGalleryImage(item.preview)}
                />
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-line bg-cream/50 text-muted transition hover:border-carrot hover:text-carrot-dark">
                <ImagePlus size={20} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    addGalleryImages(event.target.files);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          <p className="text-xs text-muted">
            รองรับไฟล์รูปภาพ ขนาดไม่เกิน 5 MB
          </p>
        </FormCard>

        <FormCard title="สถานะ">
          <FormField label="สถานะของน้อง" htmlFor="status">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="status"
                  size="md"
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          {status === "adopted" && (
            <FormField
              label="วันที่ได้บ้าน"
              htmlFor="adoptedDate"
              error={errors.adoptedDate?.message}
            >
              <input
                id="adoptedDate"
                type="date"
                {...register("adoptedDate", {
                  validate: (value, formValues) =>
                    formValues.status !== "adopted" ||
                    value !== "" ||
                    "กรุณาเลือกวันที่ได้บ้าน",
                })}
                className={inputClassName}
              />
            </FormField>
          )}

          {isOwner ? (
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-cream/60 px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-ink">
                  แสดงบนเว็บไซต์
                </span>
                <span className="block text-xs text-muted">
                  ปิดเพื่อซ่อนน้องจากหน้าเว็บ ข้อมูลไม่หาย
                </span>
              </span>
              <input
                type="checkbox"
                {...register("isActive")}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:bg-carrot peer-checked:after:translate-x-5" />
            </label>
          ) : (
            <p className="rounded-2xl bg-cream/60 px-4 py-3 text-xs leading-relaxed text-muted">
              น้องที่สร้างด้วยบัญชี demo จะไม่แสดงในรายชื่อบนหน้าเว็บ
              แต่เปิดดูหน้าโปรไฟล์ผ่านลิงก์ได้ และจะถูกลบเมื่อรีเซ็ตข้อมูล demo
            </p>
          )}
        </FormCard>

        <div className="space-y-3 lg:sticky lg:top-24">
          {!canSave && (
            <p className="flex gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Lock size={16} className="mt-0.5 shrink-0" />
              บัญชี demo แก้ไขได้เฉพาะน้องที่สร้างเอง
              น้องตัวจริงดูข้อมูลได้อย่างเดียว
            </p>
          )}

          {submitError && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSave || isSubmitting}
            className="w-full rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "กำลังบันทึก..."
              : isEditing
                ? "บันทึกการแก้ไข"
                : "เพิ่มน้อง"}
          </button>
          <Link
            href="/admin/rabbits"
            className="block rounded-full border border-line bg-white px-6 py-3 text-center text-sm text-ink transition hover:border-carrot"
          >
            ยกเลิก
          </Link>
        </div>
      </div>
    </form>
  );
}

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

function FormCard({ title, children }: FormCardProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-line bg-white p-5 shadow-sm md:p-6">
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

interface SegmentedChoiceProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
}

function SegmentedChoice<T extends string>({
  value,
  onChange,
  options,
}: SegmentedChoiceProps<T>) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-full bg-cream p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            option.value === value
              ? "rounded-full bg-white px-3 py-2 text-sm font-medium text-carrot-dark shadow-sm"
              : "rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

interface ImageThumbProps {
  src: string;
  onRemove: () => void;
}

function ImageThumb({ src, onRemove }: ImageThumbProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
      <Image
        src={src}
        alt="รูปน้อง"
        fill
        unoptimized
        className="object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="ลบรูป"
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white hover:text-red-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}
