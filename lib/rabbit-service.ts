import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Query,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Rabbit } from "@/types/rabbit";

const rabbitsCollection = collection(db, "rabbits");

// ดึงข้อมูลจาก Firestore แล้วแปลง Timestamp ให้เป็น Date
async function getRabbits(q: Query): Promise<Rabbit[]> {
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      intakeDate: data.intakeDate?.toDate(),
      adoptedDate: data.adoptedDate ? data.adoptedDate.toDate() : null,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Rabbit;
  });
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
