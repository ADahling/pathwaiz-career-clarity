
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AuthButtonsProps {
  onProfileClick: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  onProfileClick, 
  onClose = () => {}, 
  isMobile = false 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const mobileClasses = isMobile ? "w-full mb-1 justify-center" : "";

  const handleLogin = () => {
    navigate('/auth');
    onClose();
  };

  const handleSignUp = () => {
    navigate('/auth');
    onClose();
    // Set the active tab to signup
    setTimeout(() => {
      document.querySelector('[value="signup"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  if (user) {
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-3`}>
        <Button 
          variant="outline" 
          className={`border-black text-pathwaiz-black hover:bg-gray-100 hover:text-pathwaiz-blue hover-translate ${mobileClasses}`}
          onClick={handleProfileClick}
          size={isMobile ? "lg" : "default"}
        >
          My Profile
        </Button>
        <Button 
          className={`bg-pathwaiz-blue text-white hover:bg-pathwaiz-darkBlue hover-translate ${mobileClasses}`}
          onClick={handleSignOut}
          size={isMobile ? "lg" : "default"}
        >
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-3`}>
      <Button 
        variant="outline" 
        className={`border-black text-pathwaiz-black hover:bg-gray-100 hover:text-pathwaiz-blue hover-translate ${mobileClasses}`}
        onClick={handleLogin}
        size={isMobile ? "lg" : "default"}
      >
        Log In
      </Button>
      <Button 
        className={`bg-pathwaiz-blue text-white hover:bg-pathwaiz-darkBlue hover-translate ${mobileClasses}`}
        onClick={handleSignUp}
        size={isMobile ? "lg" : "default"}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
