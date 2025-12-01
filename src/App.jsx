import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import GlobalStyles from "./styles/GlobalStyles";



export default function App() {
  return (
    <BrowserRouter>
     
 <GlobalStyles />
      <AppRouter />
      
    </BrowserRouter>
  );
}
