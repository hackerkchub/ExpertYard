import { createContext, useContext, useState } from "react";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(200);
  const [transactions, setTransactions] = useState([]);

  return (
    <WalletContext.Provider value={{ balance, setBalance, transactions, setTransactions }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
