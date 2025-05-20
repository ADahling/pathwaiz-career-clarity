
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};
