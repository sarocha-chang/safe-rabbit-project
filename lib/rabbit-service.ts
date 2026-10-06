import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type DocumentSnapshot,
  type Query,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Rabbit } from "@/types/rabbit";

const rabbitsCollection = collection(db, "rabbits");

// แปลงข้อมูลจาก Firestore ให้เป็น Rabbit (เปลี่ยน Timestamp เป็น Date)
function toRabbit(snapshot: DocumentSnapshot): Rabbit {
  const data = snapshot.data()!;

  return {
    ...data,
    id: snapshot.id,
    intakeDate: data.intakeDate?.toDate(),
    adoptedDate: data.adoptedDate ? data.adoptedDate.toDate() : null,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Rabbit;
}

async function getRabbits(q: Query): Promise<Rabbit[]> {
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toRabbit);
}

// ดึงน้องตัวเดียวจาก id ถ้าไม่เจอจะได้ null
export async function getRabbitById(id: string): Promise<Rabbit | null> {
  const snapshot = await getDoc(doc(db, "rabbits", id));
  return snapshot.exists() ? toRabbit(snapshot) : null;
}

export function getAllRabbits() {
  return getRabbits(rabbitsCollection);
}

export function getAvailableRabbits() {
  return getRabbits(
    query(
      rabbitsCollection,
      where("status", "in", ["available", "sponsored"]),
      where("isActive", "==", true),
      orderBy("intakeDate", "desc"),
    ),
  );
}

export function getAdoptedRabbits() {
  return getRabbits(
    query(
      rabbitsCollection,
      where("status", "==", "adopted"),
      where("isActive", "==", true),
    ),
  );
}

export function getCafeStaffRabbits() {
  return getRabbits(
    query(
      rabbitsCollection,
      where("status", "==", "cafe_staff"),
      where("isActive", "==", true),
    ),
  );
}

export function getLatestAdoptedRabbits(max = 3) {
  return getRabbits(
    query(
      rabbitsCollection,
      where("status", "==", "adopted"),
      where("isActive", "==", true),
      orderBy("adoptedDate", "desc"),
      limit(max),
    ),
  );
}

export function getLatestAvailableRabbits(max = 6) {
  return getRabbits(
    query(
      rabbitsCollection,
      where("status", "in", ["available", "sponsored"]),
      where("isActive", "==", true),
      orderBy("intakeDate", "desc"),
      limit(max),
    ),
  );
}
