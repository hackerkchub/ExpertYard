import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Grid2X2,
  History,
  Home,
  MessageCircle,
  Tag
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const menuItems = [
    { name: 'Home', path: '/user', icon: <Home size={21} />, end: true },
    { name: 'Category', path: '/user/categories', icon: <Grid2X2 size={21} /> },
    { name: 'Services', path: '/user/all-services', icon: <Tag size={21} /> },
    { name: 'History', path: '/user/chat-history', icon: <History size={21} /> },
    { name: 'Chat', path: '/user/chat', icon: <MessageCircle size={21} /> },
  ];

  return (
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <NavLink 
          key={item.name} 
          to={item.path} 
          className={({ isActive }) =>
            [
              'nav-item',
              isActive ? 'active' : '',
            ].filter(Boolean).join(' ')
          }
          end={item.end}
        >
          <div className="icon-wrapper">{item.icon}</div>
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;
