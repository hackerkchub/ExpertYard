import { useState, useEffect } from "react";
import { getStoredUser } from "../utils/storage";

export default function useAuth() {
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {}, []);

  return { user, setUser };
}
