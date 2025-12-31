import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import {
  getWalletApi,
  addMoneyApi,
  deductMoneyApi
} from "../api/userApi/walletApi";

import { useAuth } from "./UserAuthContext";

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth(); // 🔥 IMPORTANT
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= GET BALANCE ================= */
 const fetchWallet = useCallback(async (userId) => {
  if (!userId) return;

  try {
    setLoading(true);
    const res = await getWalletApi(userId);

    if (res?.success) {
      setBalance(Number(res.balance ?? res.new_balance ?? 0));
    }
  } catch (err) {
    console.error("Wallet fetch failed", err);
    setBalance(0);
  } finally {
    setLoading(false);
  }
}, []);

  /* 🔥 AUTO FETCH AFTER LOGIN / REFRESH */
  useEffect(() => {
  if (isLoggedIn && user?.id) {
    fetchWallet(user.id);
  } else {
    resetWallet(); // 🔥 important
  }
}, [isLoggedIn, user?.id, fetchWallet]);


  /* ================= ADD MONEY ================= */
 const addMoney = async (user_id, amount) => {
  const res = await addMoneyApi({ user_id, amount });

  if (res?.success) {
    // ✅ optimistic update
    setBalance(Number(res.new_balance || 0));

    // 🔄 final sync (IMPORTANT)
    await fetchWallet(user_id);
  }

  return res;
};


  /* ================= DEDUCT MONEY ================= */
  const deductMoney = async (user_id, amount) => {
  const res = await deductMoneyApi({ user_id, amount });

  if (res?.success) {
    setBalance(Number(res.new_balance || 0));
    await fetchWallet(user_id);
  }

  return res;
};


  /* ================= RESET ================= */
  const resetWallet = () => {
    setBalance(0);
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        loading,
        fetchWallet,
        addMoney,
        deductMoney,
        resetWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
