import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BriefcaseBusiness, 
  MessageSquare, 
  TrendingUp, 
  User 
} from 'lucide-react';
import "../../../shared/components/BottomNavbar/BottomNavbar.css";

const ExpertBottomNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const menuItems = [
    { 
      name: 'Home', 
      path: '/expert/home', 
      icon: <Home size={21} />,
      isActive: () => currentPath === '/expert/home' || currentPath === '/expert' || currentPath === '/expert/'
    },
    { 
      name: 'Services', 
      path: '/expert/myservices', 
      icon: <BriefcaseBusiness size={21} />,
      isActive: () => currentPath.startsWith('/expert/myservices') || currentPath.startsWith('/expert/create-services') || currentPath.startsWith('/expert/mybookings')
    },
    { 
      name: 'Messages', 
      path: '/expert/chat-history', 
      icon: <MessageSquare size={21} />,
      isActive: () => currentPath.startsWith('/expert/chat-history') || currentPath.startsWith('/expert/chat')
    },
    { 
      name: 'Earnings', 
      path: '/expert/earnings', 
      icon: <TrendingUp size={21} />,
      isActive: () => currentPath.startsWith('/expert/earnings')
    },
    { 
      name: 'Profile', 
      path: '/expert/profile', 
      icon: <User size={21} />,
      isActive: () => currentPath.startsWith('/expert/profile') || currentPath.startsWith('/expert/settings') || currentPath.startsWith('/expert/calendar')
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Expert mobile navigation">
      {menuItems.map((item) => {
        const active = item.isActive();
        return (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={[
              'nav-item',
              active ? 'active' : '',
            ].filter(Boolean).join(' ')}
            aria-label={item.name}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default ExpertBottomNavbar;
