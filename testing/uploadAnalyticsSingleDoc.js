// scripts/uploadPosts.js

const { collection, addDoc } = require("firebase/firestore");
const { db } = require("./firebaseconfig"); // adjust path if needed
const samplePosts = require("./samplePosts.json"); // your posts JSON

/**
 * Uploads all sample posts as separate documents
 */
const uploadPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");

    for (const post of samplePosts) {
      await addDoc(postsCollection, post);
      // console.log(`✅ Post added: ${post.heading}`);
    }

    // console.log("🎉 All sample posts uploaded successfully!");
    process.exit(0);
  } catch (err) {
    // console.error("❌ Error uploading posts:", err);
    process.exit(1);
  }
};

uploadPosts();
