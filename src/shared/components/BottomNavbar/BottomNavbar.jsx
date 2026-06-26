import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BriefcaseBusiness,
  Home,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Wallet,
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const menuItems = [
    { name: 'Home', path: '/user', icon: <Home size={21} />, end: true },
    { name: 'Services', path: '/user/all-services', icon: <BriefcaseBusiness size={21} /> },
    { name: 'Category', path: '/user/categories', icon: <Sparkles size={24} />, featured: true },
    { name: 'Wallet', path: '/user/wallet', icon: <Wallet size={21} /> },
    {
      name: 'Talk',
      path: '/user/call-chat?page=1&mode=chat',
      icon: (
        <span className="chat-call-icon" aria-hidden="true">
          <MessageCircle size={21} />
          <PhoneCall size={12} />
        </span>
      )
    },
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
              item.featured ? 'nav-item--featured' : '',
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
