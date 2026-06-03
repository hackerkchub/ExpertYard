import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History,
  Grid2X2,
  Tag,
  MessageCircle
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const menuItems = [
    { name: 'Home', path: '/user', icon: <LayoutDashboard size={22} /> },
    { name: 'Services', path: '/user/all-services', icon: <Tag size={22} /> },
    { name: 'Category', path: '/user/categories', icon: <Grid2X2 size={22} /> },
    { name: 'History', path: '/user/chat-history', icon: <History size={22} /> },
    { name: 'Talk', path: '/user/call-chat?page=1', icon: <MessageCircle size={22} /> },
  ];

  return (
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <NavLink 
          key={item.name} 
          to={item.path} 
          // react-router-dom v6 style active check
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          end={item.path === '/user'} // Taaki home route dusre nested paths par active na dikhe
        >
          <div className="icon-wrapper">{item.icon}</div>
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;
