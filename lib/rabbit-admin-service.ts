import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "./firebase";
import type { Rabbit } from "@/types/rabbit";

export type RabbitInput = Omit<Rabbit, "id" | "createdAt" | "updatedAt">;

export interface RabbitImageChanges {
  newCoverFile: File | null;
  newGalleryFiles: File[];
  removedImageUrls: string[];
}

async function uploadRabbitImage(rabbitId: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "-").toLowerCase();
  const imageRef = ref(
    storage,
    `rabbits/${rabbitId}/${Date.now()}-${safeName}`,
  );
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}

async function deleteImageByUrl(url: string) {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    return;
  }
}

async function applyImageChanges(
  rabbitId: string,
  input: RabbitInput,
  changes: RabbitImageChanges,
) {
  const coverImage = changes.newCoverFile
    ? await uploadRabbitImage(rabbitId, changes.newCoverFile)
    : input.coverImage;

  const uploadedGallery = await Promise.all(
    changes.newGalleryFiles.map((file) => uploadRabbitImage(rabbitId, file)),
  );

  return {
    coverImage,
    images: [...input.images, ...uploadedGallery],
  };
}

export async function createRabbit(
  input: RabbitInput,
  changes: RabbitImageChanges,
) {
  const rabbitRef = doc(collection(db, "rabbits"));

  await setDoc(rabbitRef, {
    ...input,
    coverImage: "",
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const images = await applyImageChanges(rabbitRef.id, input, changes);
  await updateDoc(rabbitRef, images);

  return rabbitRef.id;
}

export async function updateRabbit(
  rabbitId: string,
  input: RabbitInput,
  changes: RabbitImageChanges,
) {
  const images = await applyImageChanges(rabbitId, input, changes);

  await updateDoc(doc(db, "rabbits", rabbitId), {
    ...input,
    ...images,
    updatedAt: serverTimestamp(),
  });

  await Promise.all(changes.removedImageUrls.map(deleteImageByUrl));
}

export async function setRabbitVisibility(rabbitId: string, isActive: boolean) {
  await updateDoc(doc(db, "rabbits", rabbitId), {
    isActive,
    updatedAt: serverTimestamp(),
  });
}
