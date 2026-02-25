// lib/updatePostStatus.ts
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseconfig";

/**
 * Update the status of a post.
 * @param postId - ID of the post document
 * @param status - New status: "active" | "archived"
 */
export async function updatePostStatus(
  postId: string,
  status: "active" | "archived"
) {
  if (!postId) throw new Error("postId is required");
  if (!["active", "archived"].includes(status)) throw new Error("Invalid status");

  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating post status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
