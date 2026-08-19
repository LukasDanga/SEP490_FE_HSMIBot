/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, UserProfile } from './types';
import { LoginHero } from './components/auth/LoginHero';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterHero } from './components/auth/RegisterHero';
import { RegisterForm } from './components/auth/RegisterForm';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  // Global Language state (Default to Vietnamese 'vi' as requested, toggleable to 'en')
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('hsmibot_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  // Auth Screen Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hsmibot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Handle language switch
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('hsmibot_lang', newLang);
  };

  // Handle Login success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('hsmibot_user', JSON.stringify(user));
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hsmibot_user');
  };

  // If user is authenticated, show Full HSMIBot OS Portal Layout
  if (currentUser) {
    return (
      <AppLayout
        currentUser={currentUser}
        onLogout={handleLogout}
        lang={lang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // Split-Screen Experience: Login or Multi-Step Registration
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {authMode === 'login' ? (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-screen w-full"
          >
            {/* 1. Left Hero Panel (Interactive SVG Butler Robot Visual & 360 LiDAR Telemetry) */}
            <LoginHero lang={lang} />

            {/* 2. Right Form Container (Login, Biometrics, Quick Fill) */}
            <LoginForm
              lang={lang}
              onLanguageChange={handleLanguageChange}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="register-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-screen w-full"
          >
            {/* 1. Left Hero Panel for Registration (Showcase & 3 Feature Bullet Badges) */}
            <RegisterHero lang={lang} />

            {/* 2. Right Form Container (Multi-step Registration & Robot Activation) */}
            <RegisterForm
              lang={lang}
              onLanguageChange={handleLanguageChange}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
