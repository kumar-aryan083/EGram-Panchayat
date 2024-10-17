// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBF7_5f1ajIz-retCh2Jp1immFfwF3yRa8",
  authDomain: "egram-panchayat-ea1fa.firebaseapp.com",
  projectId: "egram-panchayat-ea1fa",
  storageBucket: "egram-panchayat-ea1fa.appspot.com",
  messagingSenderId: "106546508789",
  appId: "1:106546508789:web:851e4c9bacb6d0399526bc",
  measurementId: "G-RF1PCDF30Q"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
