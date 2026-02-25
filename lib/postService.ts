import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { PostSchema, PostType } from "../schema/postSchema";
import { uploadImage } from "./uploadImage";
import { uploadEmbeddedImages } from "./uploadEmbeddedImages";
import { Post_inputable } from "../app/dashboard/publish/page";

export async function savePost(postData: Post_inputable) {
  try {
    // ✅ Upload cover image
    const cover_url = await uploadImage(postData.coverImage as File);
    // ✅ Upload embedded images and replace links
    const uploaded_content = await uploadEmbeddedImages(postData.content);

    // ✅ Validate input with schema
    const post: PostType = { ...postData, content: uploaded_content, coverImage: cover_url };
    const parsed = PostSchema.parse(post);

    // ✅ Save post to Firestore
    const docRef = await addDoc(collection(db, "posts"), {
      ...parsed,
      createdAt: serverTimestamp(),
    });

    // ✅ Increment analytics counter
    const today = new Date();
    const dateKey = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    // Reference to your analytics document
    const analyticsRef = doc(db, "analytics", "analytics");

    // Increment posts for today's date
    await updateDoc(analyticsRef, {
      [`interactions.${dateKey}.posts`]: increment(1),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
}
