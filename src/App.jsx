import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import GlobalStyles from "./styles/GlobalStyles";
import { ExpertProvider } from "./context/ExpertContext.jsx";
import { WalletProvider } from "./context/WalletContext";



export default function App() {
  return (
    <BrowserRouter>
     
 <GlobalStyles />
 <ExpertProvider>
  <WalletProvider>
      <AppRouter />
</WalletProvider>
      </ExpertProvider> 
    </BrowserRouter>
  );
}
