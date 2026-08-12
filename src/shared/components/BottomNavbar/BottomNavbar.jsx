import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  Grid,
  PlayCircle,
  Receipt,
  MessageSquare,
  PhoneCall,
} from 'lucide-react';
import "./BottomNavbar.css";

const BottomNavbar = ({ disabled = false }) => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const menuItems = [
    {
      name: 'Home',
      path: '/user',
      icon: <Home size={22} />,
      isActive: () => currentPath === '/user' || currentPath === '/user/',
    },
    {
      name: 'Services',
      path: '/user/all-services',
      icon: <Grid size={22} />,
      isActive: () => currentPath.startsWith('/user/all-services') || currentPath.startsWith('/user/service-details') || currentPath.startsWith('/user/service/'),
    },
    {
      name: 'Reels',
      path: '/user/reels',
      icon: <PlayCircle size={22} />,
      hasBadge: true,
      isActive: () => currentPath.startsWith('/user/reels'),
    },
    {
      name: 'Orders',
      path: '/user/my-services',
      icon: <Receipt size={22} />,
      isActive: () => currentPath.startsWith('/user/my-services') || currentPath.startsWith('/user/my-orders') || currentPath.startsWith('/user/my-bookings'),
    },
    {
      name: 'Inquiry',
      path: '/user/my-inquiries',
      icon: <MessageSquare size={22} />,
      isActive: () => currentPath.startsWith('/user/my-inquiries') || currentPath.startsWith('/user/inquiries'),
    },
    {
      name: 'Talk',
      path: '/user/call-chat',
      icon: <PhoneCall size={20} />,
      isTalkBtn: true,
      isActive: () => currentPath.startsWith('/user/call-chat') || currentPath.startsWith('/user/experts'),
    },
  ];

  return (
    <nav 
      className={`bottom-nav ${disabled ? 'bottom-nav-disabled' : ''}`} 
      aria-label="Primary mobile navigation"
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div className="bottom-nav-inner">
        {menuItems.map((item) => {
          const active = item.isActive();
          const itemClasses = [
            'nav-btn',
            'nav-item',
            active ? 'active' : '',
            item.isTalkBtn ? 'talk-btn' : '',
          ].filter(Boolean).join(' ');

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={itemClasses}
              aria-label={item.name}
              tabIndex={disabled ? -1 : undefined}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                }
                if (window.navigator && window.navigator.vibrate) {
                  try { window.navigator.vibrate(40); } catch (err) {}
                }
              }}
            >
              {/* Glowing Aura */}
              <div className="aura" />
              
              {/* Icon Container */}
              <div className="icon-wrapper">
                {item.icon}
                {item.hasBadge && <span className="reels-live-badge" />}
              </div>
              
              {/* Label */}
              <span className="nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;