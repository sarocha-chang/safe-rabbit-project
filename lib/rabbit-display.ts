import type { RabbitGender, RabbitStatus } from "@/types/rabbit";

const statusLabelMap: Record<RabbitStatus, string> = {
  available: "หาบ้าน",
  adopted: "ได้บ้านแล้ว",
  sponsored: "อุปถัมภ์",
  cafe_staff: "สตาฟคาเฟ่",
  passed_away: "กลับดาว",
};

const genderLabelMap: Record<RabbitGender, string> = {
  male: "เพศผู้",
  female: "เพศเมีย",
};

export function getRabbitStatusLabel(status: RabbitStatus): string {
  return statusLabelMap[status];
}

export function getRabbitGenderLabel(gender: RabbitGender): string {
  return genderLabelMap[gender];
}

export function formatThaiDate(date: Date | null): string {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatAgeMonth(ageMonth: number): string {
  if (ageMonth < 12) {
    return `${ageMonth} เดือน`;
  }

  const years = Math.floor(ageMonth / 12);
  const months = ageMonth % 12;

  if (months === 0) {
    return `${years} ปี`;
  }

  return `${years} ปี ${months} เดือน`;
}

// นับว่าผ่านมากี่เดือนแล้วนับจากวันที่ส่งเข้ามา
export function getMonthsSince(date: Date): number {
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}
