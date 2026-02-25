import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { PostSchema, PostType } from "../schema/postSchema";
import { uploadImage } from "./uploadImage";
import { uploadEmbeddedImages } from "./uploadEmbeddedImages";
import type { Post_inputable } from "../app/dashboard/publish/page";

/**
 * Update an existing post in Firestore.
 * - Uploads new cover image or embedded images (if provided).
 * - Validates data with Zod.
 * - Adds `updatedAt` timestamp.
 */
export async function updatePost(
  postId: string,
  postData: Partial<Post_inputable>
) {
  try {
    if (!postId) throw new Error("postId is required");

    const dataToUpdate: Partial<PostType> = { ...postData };

    // Upload cover image if it's a File
    if (dataToUpdate.coverImage instanceof File) {
      dataToUpdate.coverImage = await uploadImage(dataToUpdate.coverImage);
    }

    // Upload embedded images if content exists
    if (dataToUpdate.content) {
      dataToUpdate.content = await uploadEmbeddedImages(dataToUpdate.content);
    }
    // console.log(dataToUpdate)
    delete dataToUpdate.createdAt;


    // Validate with Zod (partial)
    const validation = PostSchema.partial().safeParse(dataToUpdate);

    // console.log(validation)
    if (!validation.success) {
      throw new Error(validation.error.issues.map((i) => i.message).join(", "));
    }

    // Update Firestore
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, {
      ...validation.data,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

