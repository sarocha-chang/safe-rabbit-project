import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Application, ApplicationInput } from "@/types/application";

const applicationsCollection = collection(db, "applications");

function toApplication(snapshot: DocumentSnapshot): Application {
  const data = snapshot.data()!;

  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt?.toDate(),
    reviewedAt: data.reviewedAt ? data.reviewedAt.toDate() : null,
  } as Application;
}

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
  return snapshot.docs.map(toApplication);
}

export async function getApplicationById(
  id: string,
): Promise<Application | null> {
  const snapshot = await getDoc(doc(db, "applications", id));
  return snapshot.exists() ? toApplication(snapshot) : null;
}

export async function getOtherPendingApplications(application: Application) {
  const snapshot = await getDocs(
    query(
      applicationsCollection,
      where("rabbitId", "==", application.rabbitId),
      where("status", "==", "pending"),
    ),
  );
  return snapshot.docs.filter((item) => item.id !== application.id);
}

export async function approveApplication(application: Application) {
  const batch = writeBatch(db);
  const isAdoption = application.applicationType === "adopt";

  batch.update(doc(db, "applications", application.id), {
    status: "approved",
    reviewedAt: serverTimestamp(),
  });

  batch.update(doc(db, "rabbits", application.rabbitId), {
    status: isAdoption ? "adopted" : "sponsored",
    ...(isAdoption && { adoptedDate: serverTimestamp() }),
    updatedAt: serverTimestamp(),
  });

  if (isAdoption) {
    const otherPending = await getOtherPendingApplications(application);
    otherPending.forEach((item) => {
      batch.update(item.ref, {
        status: "rejected",
        reviewedAt: serverTimestamp(),
        autoRejected: true,
      });
    });
  }

  await batch.commit();
}

export async function rejectApplication(
  application: Application,
  reviewNote: string,
) {
  await updateDoc(doc(db, "applications", application.id), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
    reviewNote: reviewNote.trim(),
  });
}
