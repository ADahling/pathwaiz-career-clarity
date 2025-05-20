
import React from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from './navLinks';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  currentPath: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onProfileClick, currentPath }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md py-4 overflow-hidden animate-slide-down"
      aria-label="Mobile navigation menu"
    >
      <div className="container-custom flex flex-col space-y-3">
        {navLinks.map((link, index) => {
          const isActive = currentPath === link.path || 
            (link.path.startsWith('/#') && currentPath === '/');
            
          return (
            <Link 
              key={link.path}
              to={link.path} 
              className={`py-2 px-2 rounded-md transition-all duration-200 ${
                isActive 
                  ? "text-pathwaiz-blue font-medium bg-blue-50" 
                  : "text-pathwaiz-black hover:text-pathwaiz-blue hover:bg-gray-50"
              }`}
              onClick={onClose}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.text}
            </Link>
          );
        })}
        
        <div className="pt-4 mt-2 border-t border-gray-100">
          <AuthButtons 
            onProfileClick={onProfileClick}
            onClose={onClose}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
