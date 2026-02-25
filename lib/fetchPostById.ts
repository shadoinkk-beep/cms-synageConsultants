// utils/fetchPostById.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { Post } from "../app/dashboard/all-posts/page";


/**
 * Fetch a single post by its document ID
 * @param id - The Firestore document ID
 * @returns Post object or null if not found
 */
export const fetchPostById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, "posts", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return { id: snap.id, ...(snap.data() as Omit<Post, "id">) };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
