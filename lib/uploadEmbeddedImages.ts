import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseconfig";

/**
 * Upload base64 images inside an HTML string to Firebase and replace src with download URLs.
 * @param content - the original HTML string (may contain <img src="data:...">)
 * @param folder - storage folder name
 * @returns HTML string with updated <img src="https://...">
 */
export async function uploadEmbeddedImages(
  content: string,
  folder = "content-images"
): Promise<string> {
  // regex to find <img src="data:image/...">
  const regex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g;

  const matches = Array.from(content.matchAll(regex));
  let updated = content;

  for (const [fullMatch, dataUrl] of matches) {
    try {
      // Create a unique file name
      const extMatch = dataUrl.match(/^data:image\/(\w+);/);
      const ext = extMatch ? extMatch[1] : "png";
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      // Upload the base64 string
      const storageRef = ref(storage, fileName);
      await uploadString(storageRef, dataUrl, "data_url");

      // Get the new URL
      const downloadURL = await getDownloadURL(storageRef);

      // Replace src in content
      updated = updated.replace(dataUrl, downloadURL);
    } catch (err) {
      console.error("Error uploading embedded image:", err);
    }
  }

  return updated;
}
