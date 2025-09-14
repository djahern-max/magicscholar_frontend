
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
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    console.log('Switch to register clicked');
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