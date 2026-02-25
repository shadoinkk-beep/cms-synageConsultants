// utils/fetchPosts.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseconfig";

export type Post = {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  createdAt?: any; // Firestore Timestamp if you use one
};

/**
 * Fetch all posts from Firestore
 */
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const snapshot = await getDocs(collection(db, "posts"));
    const posts: Post[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Post, "id">),
    }));
    return posts;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};
