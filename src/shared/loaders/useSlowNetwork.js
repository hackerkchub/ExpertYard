import { useEffect, useState } from "react";

export default function useSlowNetwork(delay = 4000) {

  const [slow, setSlow] = useState(false);

  useEffect(() => {

    const t = setTimeout(() => {
      setSlow(true);
    }, delay);

    return () => clearTimeout(t);

  }, []);

  return slow;
}