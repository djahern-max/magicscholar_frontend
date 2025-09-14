'use client';

import { useState, useCallback } from 'react'
import Header from '@/components/layout/header'
import LoginModal from '@/components/ui/login-modal'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleRegisterClick = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleSwitchToRegister = useCallback(() => {
    console.log('Switch to register clicked');
    setIsLoginModalOpen(false);
  }, []);

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