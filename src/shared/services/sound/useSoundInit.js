import { useEffect } from "react";
import { soundManager } from "./soundManager";

export const useSoundInit = () => {
  useEffect(() => {
    const unlock = () => {
      soundManager.unlock();
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock, { once: true });

    return () => window.removeEventListener("click", unlock);
  }, []);
};