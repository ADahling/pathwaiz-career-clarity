
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
  
  const buttonClasses = isMobile ? "w-full" : "";

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
      <>
        <Button 
          variant="outline" 
          className={`border-black text-black hover:bg-gray-100 ${buttonClasses}`}
          onClick={handleProfileClick}
        >
          My Profile
        </Button>
        <Button 
          className={`bg-pathwaiz-blue text-white hover:bg-opacity-90 ${buttonClasses}`}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </>
    );
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        className={`border-black text-black hover:bg-gray-100 ${buttonClasses}`}
        onClick={handleLogin}
      >
        Log In
      </Button>
      <Button 
        className={`bg-pathwaiz-blue text-white hover:bg-opacity-90 ${buttonClasses}`}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;
