"use client";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";

/**
 * Deletes a post by ID with confirmation prompt.
 * Returns true if deleted, false otherwise.
 */
export async function deletePost(postId: string): Promise<boolean> {
  const confirmed = window.confirm("⚠️ Are you sure you want to delete this post?");
  if (!confirmed) return false;

  try {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}
