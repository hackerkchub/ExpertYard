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
    createWalletOrderApi
} from "../api/userApi/walletApi";

import { useAuth } from "./UserAuthContext";
import useNetworkReconnect from "../hooks/useNetworkReconnect";

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

useNetworkReconnect(fetchWallet, { enabled: isLoggedIn });

const createOrder = async (amount) => {
  return await createWalletOrderApi(amount);
};

  /* ================= ADD MONEY ================= */
const addMoney = async (paymentData) => {

  const res =
    await addMoneyApi(paymentData);

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
        createOrder,
        resetWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
