import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Application, ApplicationInput } from "@/types/application";

const applicationsCollection = collection(db, "applications");

export async function createApplication(input: ApplicationInput) {
  await addDoc(applicationsCollection, {
    ...input,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getApplications(): Promise<Application[]> {
  const snapshot = await getDocs(
    query(applicationsCollection, orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
    } as Application;
  });
}
