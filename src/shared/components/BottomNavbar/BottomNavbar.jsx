import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Film,
  MessageCircle,
  UserRound,
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const menuItems = [
    { name: 'Home', path: '/user', icon: <Home size={21} />, end: true },
    { name: 'Reels', path: '/user/reels', icon: <Film size={21} /> },
    { name: 'Messages', path: '/user/chat-history', icon: <MessageCircle size={21} /> },
    { name: 'Profile', path: '/user/user-profile', icon: <UserRound size={21} /> },
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary mobile navigation">
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
          aria-label={item.name}
        >
          <div className="icon-wrapper">{item.icon}</div>
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;
