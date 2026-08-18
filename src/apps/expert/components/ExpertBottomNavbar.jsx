import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  CirclePlus,
  Home, 
  BriefcaseBusiness, 
  Film,
  Wallet,
  Mail,
} from 'lucide-react';
import "../../../shared/components/BottomNavbar/BottomNavbar.css";

const ExpertBottomNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const isChatPage = currentPath.startsWith('/expert/chat') || currentPath.startsWith('/expert/inquiries');

  const menuItems = [
    { 
      name: 'Home', 
      path: '/expert/home', 
      icon: <Home size={21} />,
      isActive: () => currentPath === '/expert/home' || currentPath === '/expert' || currentPath === '/expert/'
    },
    { 
      name: 'Earnings',
      path: '/expert/earnings',
      icon: <Wallet size={21} />,
      isActive: () => currentPath.startsWith('/expert/earnings')
    },
    { 
      name: 'Create',
      path: '/expert/create-services',
      icon: <CirclePlus size={22} />,
      isActive: () => currentPath.startsWith('/expert/create-services')
    },
    { 
      name: 'Reels',
      path: '/expert/reels',
      icon: <Film size={21} />,
      isActive: () => currentPath.startsWith('/expert/reels')
    },
    { 
      name: 'Inquiries',
      path: '/expert/inquiries',
      icon: <Mail size={21} />,
      isActive: () => currentPath.startsWith('/expert/inquiries')
    },
  ];

  return (
    <nav
      className={['bottom-nav', isChatPage ? 'expert-chat-mobile-hidden' : ''].filter(Boolean).join(' ')}
      aria-label="Expert mobile navigation"
    >
      <div className="bottom-nav-inner">
        {menuItems.map((item) => {
          const isItemActive = item.isActive();
          return (
            <NavLink 
              key={item.name} 
              to={item.path} 
              end={item.path === '/expert/home' || item.path === '/expert'}
              className={({ isActive: isRouterActive }) => {
                const active = (item.path === '/expert/home' || item.path === '/expert') ? (isItemActive && isRouterActive) : isItemActive;
                return [
                  'nav-btn',
                  'nav-item',
                  active ? 'active' : '',
                ].filter(Boolean).join(' ');
              }}
              aria-label={item.name}
            >
              <div className="aura" />
              <div className="icon-wrapper">{item.icon}</div>
              <span className="nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default ExpertBottomNavbar;
