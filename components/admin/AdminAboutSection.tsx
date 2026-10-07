import {
  ChartColumn,
  FlaskConical,
  ImageUp,
  Layers,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { techStack } from "@/lib/tech-stack";

const adminFeatures = [
  {
    icon: UserCog,
    title: "Login และสิทธิ์ผู้ใช้",
    description:
      "Firebase Authentication แยกบทบาท owner / demo และออกจากระบบอัตโนมัติใน 24 ชั่วโมง",
  },
  {
    icon: ShieldCheck,
    title: "Security Rules",
    description:
      "Firestore และ Storage Rules ตรวจสิทธิ์และรูปแบบข้อมูลฝั่งเซิร์ฟเวอร์",
  },
  {
    icon: Layers,
    title: "อนุมัติแบบ all-or-nothing",
    description:
      "ใช้ writeBatch อัปเดตคำร้องและสถานะน้องพร้อมกัน ไม่มีข้อมูลขัดกัน",
  },
  {
    icon: ImageUp,
    title: "จัดการข้อมูลและรูปภาพ",
    description:
      "เพิ่ม แก้ไข และอัปโหลดรูปขึ้น Firebase Storage พร้อมตรวจชนิดและขนาดไฟล์",
  },
  {
    icon: FlaskConical,
    title: "Demo sandbox",
    description:
      "บัญชี demo ทดลองได้จริงโดยไม่กระทบข้อมูลบนเว็บ และรีเซ็ตได้ในคลิกเดียว",
  },
  {
    icon: ChartColumn,
    title: "Dashboard",
    description: "สรุปข้อมูลน้องและคำร้องด้วย Chart.js",
  },
];

export default function AdminAboutSection() {
  return (
    <section className="space-y-6 rounded-3xl bg-carrot-soft p-6 md:p-8">
      <div className="space-y-1">
        <p className="text-sm font-medium text-carrot-dark">
          เกี่ยวกับระบบหลังบ้าน
        </p>
        <h2 className="font-heading text-xl font-semibold text-ink md:text-2xl">
          ฟีเจอร์ของ Rabbit House Admin
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carrot-soft text-carrot-dark">
              <feature.icon size={17} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-ink">{feature.title}</p>
              <p className="text-xs leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">เทคโนโลยีที่ใช้</p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white px-3 py-1.5 text-xs text-ink shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
