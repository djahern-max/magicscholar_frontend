'use client';

import { useState } from 'react'
import Header from '@/components/layout/header'
import LoginModal from '@/components/ui/login-modal'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    // For now, just open the login modal - you can implement a separate register modal later
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    // This is called when user clicks "Sign up" in the login modal
    // You can implement register functionality here
    console.log('Switch to register clicked');
    // For now, just close the modal
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <main>{children}</main>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseModal}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
    </>
  )
}