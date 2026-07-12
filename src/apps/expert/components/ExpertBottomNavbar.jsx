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
  const isChatPage = currentPath === '/expert/chat' || currentPath.startsWith('/expert/chat/');

  const menuItems = [
    { 
      name: 'Home', 
      path: '/expert/home', 
      icon: <Home size={21} />,
      isActive: () => currentPath === '/expert/home' || currentPath === '/expert' || currentPath === '/expert/'
    },
    { 
      name: 'Earning',
      path: '/expert/earnings',
      icon: <Wallet size={21} />,
      isActive: () => currentPath.startsWith('/expert/earnings')
    },
    { 
      name: 'Create Reel',
      path: '/expert/reels',
      icon: (
        <span className="chat-call-icon" aria-hidden="true">
          <Film />
          <CirclePlus />
        </span>
      ),
      isActive: () => currentPath.startsWith('/expert/reels')
    },
    { 
      name: 'Inquiries',
      path: '/expert/inquiries',
      icon: <Mail size={21} />,
      isActive: () => currentPath.startsWith('/expert/inquiries')
    },
    { 
      name: 'Create Service',
      path: '/expert/create-services',
      icon: <BriefcaseBusiness size={21} />,
      isActive: () => currentPath.startsWith('/expert/create-services')
    },
  ];

  return (
    <nav
      className={['bottom-nav', isChatPage ? 'expert-chat-mobile-hidden' : ''].filter(Boolean).join(' ')}
      aria-label="Expert mobile navigation"
    >
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
