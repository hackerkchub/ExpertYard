import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDSPw3lTarBu6X0rTqM8KLNVh7Av6XgKXI",
  authDomain: "expert-yard-f2d19.firebaseapp.com",
  projectId: "expert-yard-f2d19",
  storageBucket: "expert-yard-f2d19.firebasestorage.app",
  messagingSenderId: "172378612980",
  appId: "1:172378612980:web:2550393e0c0e155d76aaa1",
  measurementId: "G-2XTQD0S6XD"
};

const app = initializeApp(firebaseConfig);

export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;