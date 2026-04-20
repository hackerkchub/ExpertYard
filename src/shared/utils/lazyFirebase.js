const firebaseConfig = {
  apiKey: "AIzaSyDSPw3lTarBu6X0rTqM8KLNVh7Av6XgKXI",
  authDomain: "expert-yard-f2d19.firebaseapp.com",
  projectId: "expert-yard-f2d19",
  storageBucket: "expert-yard-f2d19.firebasestorage.app",
  messagingSenderId: "172378612980",
  appId: "1:172378612980:web:2550393e0c0e155d76aaa1",
  measurementId: "G-2XTQD0S6XD",
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
