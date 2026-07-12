const firebaseConfig = {
  apiKey: "AIzaSyBnPeTT5da1EnNrXy2wALYD1b5El7JnIOI",
  authDomain: "g9expert-6d619.firebaseapp.com",
  projectId: "g9expert-6d619",
  storageBucket: "g9expert-6d619.firebasestorage.app",
  messagingSenderId: "369913155001",
  appId: "1:369913155001:web:95ff907949435fe276ba68",
  measurementId: "G-NP82QBDJEJ"
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
