import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BriefcaseBusiness,
  Home,
  Film,
  MessageCircle,
  Mail,
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = ({ disabled = false }) => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const menuItems = [
    {
      name: 'Home',
      path: '/user',
      icon: <Home size={21} />,
      isActive: () => currentPath === '/user' || currentPath === '/user/',
    },
    {
      name: 'Reel',
      path: '/user/reels',
      icon: <Film size={21} />,
      isActive: () => currentPath.startsWith('/user/reels'),
    },
    {
      name: 'Services',
      path: '/user/all-services',
      icon: <BriefcaseBusiness size={21} />,
      isActive: () => currentPath.startsWith('/user/all-services') || currentPath.startsWith('/user/service-details'),
    },
    {
      name: 'Inquiries',
      path: '/user/my-inquiries',
      icon: <Mail size={21} />,
      isActive: () => currentPath.startsWith('/user/my-inquiries'),
    },
    {
      name: 'Talk',
      path: '/user/call-chat',
      icon: <MessageCircle size={21} />,
      isActive: () => currentPath.startsWith('/user/call-chat'),
    },
  ];

  return (
    <nav 
      className={`bottom-nav ${disabled ? 'bottom-nav-disabled' : ''}`} 
      aria-label="Primary mobile navigation"
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      {menuItems.map((item) => {
        const active = item.isActive();
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={['nav-item', active ? 'active' : ''].filter(Boolean).join(' ')}
            aria-label={item.name}
            tabIndex={disabled ? -1 : undefined}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();
              }
            }}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;