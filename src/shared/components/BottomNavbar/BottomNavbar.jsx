import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wallet, MessageSquare, Gift } from 'lucide-react';
import { FiUser,  FiGrid, FiBarChart2 } from "react-icons/fi";
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const location = useLocation();
  const isExpert = location.pathname.includes('/expert');

  // ✅ Chat page detect karke navbar ko render hi nahi karenge
  if (location.pathname.includes('/chat/')) {
    return null;
  }

  const userMenu = [
    { name: 'Home', path: '/user', icon: <Home size={22} /> },
     { name: 'Wallet', path: '/user/wallet', icon: <Wallet size={22} /> },
     { name: 'Messages', path: '/user/chat-history', icon: <MessageSquare size={22} /> },
    { name: 'Categories', path: '/user/categories', icon: < FiGrid  size={22} /> },
  ];

  const expertMenu = [
    { name: 'Home', path: '/expert/home', icon: <Home size={22} /> },
    { name: 'Earning', path: '/expert/earnings', icon: <FiBarChart2 size={22} /> },
    { name: 'Messages', path: '/expert/chat-history', icon: <MessageSquare size={22} /> },
     { name: 'Profile', path: '/expert/profile', icon: <FiUser size={22} /> },
  ];

  const menuItems = isExpert ? expertMenu : userMenu;

  return (
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <NavLink 
          key={item.name} 
          to={item.path} 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <div className="icon-wrapper">{item.icon}</div>
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;