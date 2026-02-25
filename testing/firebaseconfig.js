// scripts/firebaseConfigNode.js
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCO_1svljYfbthMCJsGjtWE0cSyM1fvj7k",
  authDomain: "synage-consultants-cms.firebaseapp.com",
  projectId: "synage-consultants-cms",
  storageBucket: "synage-consultants-cms.firebasestorage.app",
  messagingSenderId: "190982788764",
  appId: "1:190982788764:web:3f337228526be07ce77f59",
  measurementId: "G-Z65HRH0DFP"
};

// Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// FORCE emulator connection
// connectFirestoreEmulator(db, "127.0.0.1", 8081);
// console.log("Connected to Firestore emulator at 127.0.0.1:8081");

module.exports = { db };
