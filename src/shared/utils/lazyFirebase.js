const firebaseConfig = {
  apiKey: "AIzaSyAeA1BsApn__fDctrvmmzloJqYrNvyBf3Y",
  authDomain: "g9expert-852f3.firebaseapp.com",
  projectId: "g9expert-852f3",
  storageBucket: "g9expert-852f3.firebasestorage.app",
  messagingSenderId: "769544907226",
  appId: "1:769544907226:web:8913137a1827d58d34b8e3",
  measurementId: "G-F3G6QVH8JB"
};

let messagingClientPromise;

const canUseMessaging = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

export async function getMessagingClient() {
  if (!canUseMessaging()) {
    return null;
  }

  if (!messagingClientPromise) {
    messagingClientPromise = (async () => {
      const [{ initializeApp }, messagingModule] = await Promise.all([
        import("firebase/app"),
        import("firebase/messaging"),
      ]);

      const app = initializeApp(firebaseConfig);
      const messaging = messagingModule.getMessaging(app);

      return {
        messaging,
        getToken: messagingModule.getToken,
        onMessage: messagingModule.onMessage,
      };
    })().catch((error) => {
      messagingClientPromise = null;
      throw error;
    });
  }

  return messagingClientPromise;
}
