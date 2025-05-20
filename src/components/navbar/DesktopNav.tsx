
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { navLinks } from './navLinks';
import AuthButtons from './AuthButtons';

interface DesktopNavProps {
  onProfileClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ onProfileClick }) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {navLinks.map((link) => (
        <Link 
          key={link.path} 
          to={link.path} 
          className="text-black hover:text-pathwaiz-blue transition-colors"
        >
          {link.text}
        </Link>
      ))}
      
      <AuthButtons onProfileClick={onProfileClick} />
    </div>
  );
};

export default DesktopNav;
