import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // DEFAULT BALANCE (you can fetch from backend later)
  const [balance, setBalance] = useState(15450.75);

  // user login mock check
  const [isLogged, setIsLogged] = useState(true);

  return (
    <WalletContext.Provider value={{ balance, setBalance, isLogged, setIsLogged }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
