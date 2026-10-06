import type { Metadata } from "next";
import {
  ArrowUpRight,
  Briefcase,
  ClipboardList,
  Database,
  Images,
  Mail,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import { contact } from "@/lib/contact";

const features = [
  {
    icon: Database,
    title: "ข้อมูลจริงจาก Firebase",
    description:
      "ข้อมูลและรูปน้องเก็บใน Firestore กับ Storage แก้ข้อมูลใน Firebase แล้วหน้าเว็บอัปเดตตามอัตโนมัติ",
  },
  {
    icon: SlidersHorizontal,
    title: "กรองและเรียงลำดับ",
    description:
      "กรองน้องตามเพศ การทำหมัน สายพันธุ์ และสถานะ เรียงตามวันที่ ใช้ component ตัวเดียวกันได้ทุกหน้า",
  },
  {
    icon: Images,
    title: "แกลเลอรีรูป",
    description: "สลับรูปได้ทันทีด้วยการโหลดรอไว้ก่อน และกดดูรูปแบบเต็มจอได้",
  },
  {
    icon: ClipboardList,
    title: "แบบฟอร์มขอรับเลี้ยง",
    description:
      "ตรวจข้อมูลทุกช่องด้วย React Hook Form และเลือกน้องให้อัตโนมัติเมื่อกดมาจากหน้าโปรไฟล์",
  },
  {
    icon: Smartphone,
    title: "Responsive",
    description: "ใช้งานได้ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์",
  },
];

const techStack = [
  "Next.js (App Router)",
  "TypeScript",
  "Tailwind CSS",
  "React Hook Form",
  "Firebase Firestore",
  "Firebase Storage",
  "Firebase App Hosting",
];

export const metadata: Metadata = {
  title: "เกี่ยวกับโปรเจกต์",
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <PageHeader
        label="เกี่ยวกับโปรเจกต์"
        title="Rabbit House"
        description="A forever home for every rabbit. เว็บไซต์ตัวอย่างสำหรับช่วยหาบ้านให้น้องกระต่าย สร้างขึ้นเป็นผลงาน portfolio"
      />

      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm md:p-10">
        <div className="space-y-4 md:text-lg">
          <h2 className="font-heading text-2xl font-semibold text-ink">
            ที่มาของโปรเจกต์
          </h2>
          <p className="leading-relaxed text-muted">
            จุดเริ่มต้นของโปรเจกต์นี้ย้อนกลับไปตั้งแต่สมัยมัธยมปลาย
            ตอนที่เราต้องทำโครงงานและอยากสร้างเว็บไซต์เพื่อช่วยประชาสัมพันธ์สัตว์จรจัดในศูนย์ดูแลสัตว์แห่งหนึ่งในจังหวัดเชียงใหม่
            แต่ในตอนนั้นไอเดียนี้ยังไม่ได้รับเลือก
            เราจึงเก็บความตั้งใจนี้ไว้ก่อน
          </p>
          <p className="leading-relaxed text-muted">
            วันนี้เราเรียนจบและทำงานเป็นโปรแกรมเมอร์
            และมีกระต่ายอยู่ที่บ้านสี่ตัว
            ยิ่งได้ใช้ชีวิตและใกล้ชิดกับกระต่ายมากขึ้น
            ก็ยิ่งเห็นว่ายังมีน้องอีกมากที่ถูกทอดทิ้งหรือกำลังรอบ้านใหม่
          </p>
          <p className="leading-relaxed text-muted">
            ต่อมาเราได้รู้จักคาเฟ่กระต่ายแห่งหนึ่งที่นอกจากเปิดพื้นที่ให้คนได้ใช้เวลาอยู่กับกระต่ายแล้ว
            ยังช่วยรับเคส พาน้องไปรักษา
            และหาบ้านใหม่ให้กระต่ายที่ต้องการความช่วยเหลือ
            เรามองว่านี่เป็นโมเดลที่น่าสนใจ
            จึงอยากนำแนวคิดนี้มาต่อยอดเป็นเว็บไซต์ที่รวบรวมข้อมูลของน้องๆ
            ไว้ในที่เดียว แยกตามสถานะเพื่อให้ค้นหาและติดตามได้ง่าย
          </p>
          <p className="leading-relaxed text-muted">
            Rabbit House
            จึงเกิดขึ้นในฐานะต้นแบบของเว็บไซต์สำหรับช่วยประชาสัมพันธ์กระต่ายที่กำลังมองหาบ้าน
            รวมถึงบันทึกเรื่องราวของน้องๆ ที่ได้บ้านแล้ว และน้องๆ
            ที่อยู่กับเราเป็นสมาชิกประจำบ้าน
            ตอนนี้มีแบบฟอร์มขอรับเลี้ยงและอุปถัมภ์ตัวอย่างแล้ว
            และในอนาคตเราอยากต่อยอดให้ผู้ดูแลพิจารณาบ้านที่เหมาะสมกับกระต่ายแต่ละตัวได้จากระบบหลังบ้าน
          </p>
          <p className="leading-relaxed text-muted">
            เราหวังว่าโปรเจกต์เล็กๆ
            นี้จะเป็นจุดเริ่มต้นที่คาเฟ่หรือศูนย์ดูแลสัตว์นำไปต่อยอดเพื่อประชาสัมพันธ์
            และเพิ่มโอกาสให้น้องๆ ได้พบกับคนที่พร้อมดูแลพวกเขา
          </p>

          <p className="border-l-4 border-carrot pl-4 font-heading text-lg leading-relaxed text-ink md:text-xl">
            เพราะสิ่งที่เราอยากเห็นที่สุด คือกระต่ายทุกตัวได้พบกับ{" "}
            <span className="text-carrot-dark">
              &ldquo;บ้านหลังสุดท้าย&rdquo;
            </span>{" "}
            ที่พวกเขาจะได้อยู่ด้วยความรักและปลอดภัย
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold text-ink">
          ฟีเจอร์
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-carrot-soft text-carrot-dark">
                <feature.icon size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-medium text-ink">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold text-ink">
          เทคโนโลยีที่ใช้
        </h2>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line bg-cream/50 px-4 py-2 text-sm text-ink"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 space-y-6 rounded-3xl bg-cream/50 p-6 text-center md:p-10"
      >
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold text-ink">
            ติดต่อ
          </h2>
          <p className="text-muted">
            สนใจพูดคุยเรื่องงาน หรือมีคำแนะนำ ติดต่อได้ทางนี้เลย
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
          >
            <Mail size={18} />
            {contact.email}
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm text-ink shadow-sm transition hover:border-carrot hover:text-carrot-dark"
          >
            <Briefcase size={18} />
            LinkedIn
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
