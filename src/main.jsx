import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { WalletProvider } from "./shared/context/WalletContext";
import { ExpertProvider } from "./shared/context/ExpertContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
// import { ExpertRegisterProvider } from "./apps/expert/context/ExpertRegisterContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
import { theme } from "./shared/styles/theme";
import GlobalStyles from "./shared/styles/GlobalStyles";
import AppRouter from "./routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
          <CategoryProvider>
     <ExpertProvider>
<BrowserRouter>
      {/* <ExpertRegisterProvider> */}
       
          
             <AuthProvider>
              <WalletProvider>
            <AppRouter />
             </WalletProvider>
            </AuthProvider>
         
    
      {/* </ExpertRegisterProvider> */}
    
    </BrowserRouter>
        </ExpertProvider>
    </CategoryProvider>
    
  </ThemeProvider>
);
