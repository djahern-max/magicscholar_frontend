// src/components/layout/header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login' as 'login' | 'register'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then((data: UserData | null) => {
          if (data) setUser(data);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  if (!mounted) return null;

  return (
    <>
      <header style={{
        fontFamily: 'monospace',
        backgroundColor: '#fff',
        borderBottom: '2px solid #000',
        padding: '12px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          {/* Logo + Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="/" style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000',
              textDecoration: 'none'
            }}>
              magicScholar
            </a>

            <nav style={{ display: 'flex', gap: '10px' }}>
              <a href="/" style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '5px 12px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                [Schools]
              </a>
              <a href="/scholarships" style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '5px 12px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff3cd'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                [Scholarships]
              </a>
              {user && (
                <a href="/profile" style={{
                  color: '#000',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '5px 12px',
                  border: '1px solid #000',
                  backgroundColor: '#fff',
                  transition: 'background-color 0.2s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1ecf1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                  [Profile]
                </a>
              )}
            </nav>
          </div>

          {/* Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <>
                <span style={{ fontSize: '14px', color: '#555' }}>
                  USER: <span style={{ color: '#0066cc' }}>{user.username}</span>
                </span>
                <button onClick={handleLogout} style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  padding: '5px 12px',
                  border: '1px solid #000',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  color: '#000',
                  transition: 'background-color 0.2s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8d7da'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                  LOGOUT
                </button>
              </>
            ) : (
              <button onClick={openLoginModal} style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                padding: '5px 12px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                cursor: 'pointer',
                color: '#000',
                transition: 'background-color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4edda'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                LOGIN
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        defaultMode={authModal.mode}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}