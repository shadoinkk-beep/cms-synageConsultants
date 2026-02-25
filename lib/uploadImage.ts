// utils/uploadImage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseconfig";

/**
 * Upload an image file to Firebase Storage and return its download URL.
 * @param file - The image File selected by the user
 * @param folder - Optional folder name in storage (default: "images")
 */
export const uploadImage = async (
  file: File,
  folder = "images"
): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the public download URL
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
