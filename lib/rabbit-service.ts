import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "./firebase";
import type { Rabbit } from "@/types/rabbit";

const rabbitsCollection = collection(db, "rabbits");

export async function getAllRabbits(): Promise<Rabbit[]> {
  const snapshot = await getDocs(rabbitsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rabbit[];
}

export async function getAvailableRabbits(): Promise<Rabbit[]> {
  const q = query(
    rabbitsCollection,
    where("status", "in", ["available", "sponsored"]),
    where("isActive", "==", true),
    orderBy("intakeDate", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rabbit[];
}

export async function getAdoptedRabbits(): Promise<Rabbit[]> {
  const q = query(
    rabbitsCollection,
    where("status", "==", "adopted"),
    where("isActive", "==", true),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rabbit[];
}

export async function getCafeStaffRabbits(): Promise<Rabbit[]> {
  const q = query(
    rabbitsCollection,
    where("status", "==", "cafe_staff"),
    where("isActive", "==", true),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rabbit[];
}
