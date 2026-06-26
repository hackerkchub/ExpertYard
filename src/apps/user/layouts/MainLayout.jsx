import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

export default function MainLayout() {
  const location = useLocation();
  const isUserHome = location.pathname === "/user";

  return (
    <>
      {!isUserHome && <Navbar />}
      <Outlet />
      {!isUserHome && <Footer />}
    </>
  );
}
