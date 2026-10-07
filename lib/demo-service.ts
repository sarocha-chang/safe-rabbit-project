import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";

import { db, storage } from "./firebase";
import type { ApplicationInput } from "@/types/application";
import type { Rabbit, RabbitStatus } from "@/types/rabbit";

const sampleApplicants: Omit<ApplicationInput, "rabbitId" | "rabbitName">[] = [
  {
    applicationType: "adopt",
    fullName: "สมใจ ใจดี (ตัวอย่าง)",
    occupation: "นักออกแบบกราฟิก",
    phone: "0800000001",
    email: "somjai@example.com",
    introduction:
      "ทำงานที่บ้านเป็นหลัก มีเวลาดูแลน้องทั้งวัน เคยเลี้ยงกระต่ายมาก่อน 3 ปี",
    housingType: "คอนโด / อพาร์ตเมนต์",
    keepIndoor: "yes",
    hasAirCon: "yes",
    acceptCosts: true,
    canVisitVet: true,
  },
  {
    applicationType: "adopt",
    fullName: "ภูมิ รักสัตว์ (ตัวอย่าง)",
    occupation: "วิศวกร",
    phone: "0800000002",
    email: "phum@example.com",
    introduction:
      "อยู่บ้านเดี่ยวกับครอบครัว มีห้องแอร์ว่างหนึ่งห้อง อยากรับน้องมาเป็นเพื่อนลูก",
    housingType: "บ้านเดี่ยว",
    keepIndoor: "yes",
    hasAirCon: "yes",
    acceptCosts: true,
    canVisitVet: true,
  },
  {
    applicationType: "sponsor",
    fullName: "มินตรา ใจบุญ (ตัวอย่าง)",
    occupation: "พนักงานบริษัท",
    phone: "0800000003",
    email: "mintra@example.com",
    introduction:
      "ที่พักเลี้ยงสัตว์ไม่ได้ แต่อยากช่วยสนับสนุนค่าอาหารและค่ารักษาของน้องทุกเดือน",
    housingType: "หอพัก",
    keepIndoor: "no",
    hasAirCon: "no",
    acceptCosts: true,
    canVisitVet: true,
  },
];

export async function saveDemoDefaults(rabbits: Rabbit[]) {
  const batch = writeBatch(db);

  rabbits
    .filter((rabbit) => !rabbit.createdByDemo)
    .forEach((rabbit) => {
      batch.set(doc(db, "demoDefaults", rabbit.id), {
        status: rabbit.status,
        adoptedDate: rabbit.adoptedDate ?? null,
      });
    });

  await batch.commit();
}

export async function resetDemoData() {
  const [applicationsSnapshot, defaultsSnapshot] = await Promise.all([
    getDocs(collection(db, "applications")),
    getDocs(collection(db, "demoDefaults")),
  ]);

  if (defaultsSnapshot.empty) {
    throw new Error("NO_DEFAULTS");
  }

  const batch = writeBatch(db);

  applicationsSnapshot.docs.forEach((item) => batch.delete(item.ref));

  defaultsSnapshot.docs.forEach((item) => {
    batch.update(doc(db, "rabbits", item.id), {
      status: item.data().status,
      adoptedDate: item.data().adoptedDate ?? null,
      updatedAt: serverTimestamp(),
    });
  });

  const rabbitsSnapshot = await getDocs(collection(db, "rabbits"));
  const demoRabbits = rabbitsSnapshot.docs.filter(
    (item) => item.data().createdByDemo === true,
  );
  demoRabbits.forEach((item) => batch.delete(item.ref));

  const lookingForHome = rabbitsSnapshot.docs.filter((item) => {
    const defaultStatus = defaultsSnapshot.docs
      .find((defaultItem) => defaultItem.id === item.id)
      ?.data().status as RabbitStatus | undefined;
    return defaultStatus === "available" || defaultStatus === "sponsored";
  });

  if (lookingForHome.length > 0) {
    sampleApplicants.forEach((applicant, index) => {
      const rabbit = lookingForHome[index % lookingForHome.length];
      batch.set(doc(collection(db, "applications")), {
        ...applicant,
        rabbitId: rabbit.id,
        rabbitName: rabbit.data().name,
        status: "pending",
        createdAt: serverTimestamp(),
      });
    });
  }

  await batch.commit();

  await Promise.all(demoRabbits.map((item) => deleteRabbitFolder(item.id)));
}

async function deleteRabbitFolder(rabbitId: string) {
  try {
    const folder = await listAll(ref(storage, `rabbits/${rabbitId}`));
    await Promise.all(folder.items.map((item) => deleteObject(item)));
  } catch {
    return;
  }
}
