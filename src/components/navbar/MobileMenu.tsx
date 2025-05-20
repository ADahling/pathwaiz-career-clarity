
import React from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from './navLinks';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onProfileClick }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md py-4 animate-fade-in">
      <div className="container-custom flex flex-col space-y-4">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className="text-black hover:text-pathwaiz-blue transition-colors py-2"
            onClick={onClose}
          >
            {link.text}
          </Link>
        ))}
        
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
