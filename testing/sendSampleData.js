// sendSampleData.js
import { db } from "./firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";
import { readFileSync } from "fs";

const samplePosts = JSON.parse(readFileSync("./samplePosts.json", "utf8"));

export async function sendSamplePosts() {
  try {
    const postsCollection = collection(db, "posts");

    for (const post of samplePosts) {
      await addDoc(postsCollection, post);
      console.log(`✅ Post added: ${post.heading}`);
    }

    console.log("🎉 All sample posts uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading posts:", error);
  }
}

// Run directly
sendSamplePosts();
