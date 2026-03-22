import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  MessageSquare, 
  PlusSquare, 
  Library,
  History,
  Wallet,
  Grid2X2,
  Tag
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/chat/')) {
    return null;
  }

  const isExpert = path.startsWith('/expert');

  const userMenu = [
    { name: 'Home', path: '/user/', icon: <LayoutDashboard size={22} /> },
    { name: 'history', path: 'user/chat-history', icon: <History size={22} /> },
    { name: 'Categories', path: '/user/categories', icon: <Grid2X2 size={22} /> }, // Category Icon
   { name: 'Offers', path: '/user/my-offers', icon: <Tag size={22} /> },
  ];

  const expertMenu = [
    { name: 'Home', path: '/expert/home', icon: <LayoutDashboard size={22} /> },
    { name: 'Earning', path: 'expert/earnings', icon: <CircleDollarSign size={22} /> },
    { name: 'Create', path: 'expert/my-content?mode=create', icon: <PlusSquare size={22} /> },
    { name: 'Post', path: 'expert/my-content', icon: <Library size={22} /> },
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