
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
    <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md py-4 animate-fade-in">
      <div className="container-custom flex flex-col space-y-4">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path || 
            (link.path.startsWith('/#') && currentPath === '/');
            
          return (
            <Link 
              key={link.path}
              to={link.path} 
              className={`transition-colors py-2 ${
                isActive 
                  ? "text-pathwaiz-blue font-medium border-l-4 border-pathwaiz-blue pl-2" 
                  : "text-black hover:text-pathwaiz-blue"
              }`}
              onClick={onClose}
            >
              {link.text}
            </Link>
          );
        })}
        
        <AuthButtons 
          onProfileClick={onProfileClick}
          onClose={onClose}
          isMobile={true}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
