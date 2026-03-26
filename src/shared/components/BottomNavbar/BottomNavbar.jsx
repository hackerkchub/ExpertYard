import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  History,
  Grid2X2,
  Tag,
  PlusSquare
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const hideOnPages = [
    '/expert/register',
    '/user/auth'
  ];

  if (path.includes('/chat/') || hideOnPages.includes(path)) {
    return null;
  }

  const isExpert = path.startsWith('/expert');

  const userMenu = [
    { name: 'Home', path: '/user', icon: <LayoutDashboard size={22} /> },
    { name: 'History', path: '/user/chat-history', icon: <History size={22} /> },
    { name: 'Categories', path: '/user/categories', icon: <Grid2X2 size={22} /> },
    { name: 'Offers', path: '/user/my-offers', icon: <Tag size={22} /> },
  ];

  const expertMenu = [
    { name: 'Home', path: '/expert/home', icon: <LayoutDashboard size={22} /> },
    { name: 'Earning', path: '/expert/earnings', icon: <CircleDollarSign size={22} /> },
    { name: 'Create', path: '/expert/my-content?mode=create', icon: <PlusSquare size={22} /> },
  ];

  const menuItems = isExpert ? expertMenu : userMenu;

  return (
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <NavLink 
          key={item.name} 
          to={item.path} 
          // react-router-dom v6 style active check
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          end={item.path === '/user' || item.path === '/expert/home'} // Taaki home route dusre nested paths par active na dikhe
        >
          <div className="icon-wrapper">{item.icon}</div>
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;