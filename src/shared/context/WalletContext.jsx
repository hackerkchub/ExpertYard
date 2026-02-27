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
  
} from "../api/userApi/walletApi";

import { useAuth } from "./UserAuthContext";

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth(); // 🔥 IMPORTANT
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= GET BALANCE ================= */
 const fetchWallet = useCallback(async () => {
  if (!isLoggedIn) return;

  try {
    setLoading(true);
    const res = await getWalletApi();

    if (res?.success) {
      setBalance(Number(res.balance || 0));
    }
  } catch (err) {
    console.error("Wallet fetch failed", err);
    setBalance(0);
  } finally {
    setLoading(false);
  }
}, [isLoggedIn]);

  /* 🔥 AUTO FETCH AFTER LOGIN / REFRESH */
  useEffect(() => {
  if (isLoggedIn) {
    fetchWallet();
  } else {
    resetWallet();
  }
}, [isLoggedIn, fetchWallet]);


  /* ================= ADD MONEY ================= */
const addMoney = async (amount) => {
  const res = await addMoneyApi(amount);

  if (res?.success) {
    await fetchWallet();
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
        resetWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
