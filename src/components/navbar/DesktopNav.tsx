
import React from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from './navLinks';
import AuthButtons from './AuthButtons';

interface DesktopNavProps {
  onProfileClick: () => void;
  currentPath: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ onProfileClick, currentPath }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <div className="flex space-x-6">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path || 
            (link.path.startsWith('/#') && currentPath === '/');
            
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link text-pathwaiz-black font-medium transition-colors hover:text-pathwaiz-blue ${
                isActive ? "nav-link-active text-pathwaiz-blue" : ""
              }`}
            >
              {link.text}
            </Link>
          );
        })}
      </div>
      
      <AuthButtons onProfileClick={onProfileClick} />
    </div>
  );
};

export default DesktopNav;
