import type { ApplicationStatus, ApplicationType } from "@/types/application";

const applicationTypeLabelMap: Record<ApplicationType, string> = {
  adopt: "รับเลี้ยง",
  sponsor: "อุปถัมภ์",
};

const applicationStatusLabelMap: Record<ApplicationStatus, string> = {
  pending: "รอพิจารณา",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
};

export function getApplicationTypeLabel(type: ApplicationType): string {
  return applicationTypeLabelMap[type];
}

export function getApplicationStatusLabel(status: ApplicationStatus): string {
  return applicationStatusLabelMap[status];
}

export function getYesNoLabel(value: "yes" | "no"): string {
  return value === "yes" ? "ใช่" : "ไม่ใช่";
}
