import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bell, Wallet, Settings, History, MessageSquare, User } from 'lucide-react';
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
    { name: 'Notifications', path: '/user/notifications', icon: <Bell size={22} /> },
    { name: 'Wallet', path: '/user/wallet', icon: <Wallet size={22} /> },
    { name: 'Setting', path: '/user/setting', icon: <Settings size={22} /> },
  ];

  const expertMenu = [
    { name: 'Home', path: '/expert/home', icon: <Home size={22} /> },
    // { name: 'History', path: '/expert/history', icon: <History size={22} /> },
    { name: 'Chat', path: '/expert/chat-history', icon: <MessageSquare size={22} /> },
    { name: 'Profile', path: '/expert/profile', icon: <User size={22} /> },
    { name: 'Setting', path: '/expert/settings', icon: <Settings size={22} /> },
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