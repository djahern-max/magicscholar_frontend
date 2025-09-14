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
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLoginClick = () => {
    setIsRegisterMode(false);
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterMode(true);
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
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
          isRegisterMode={isRegisterMode}
        />
      )}
    </>
  )
}
