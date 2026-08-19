import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ScanFace, 
  ArrowRight, 
  AlertCircle, 
  Cpu, 
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Radio,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginFormProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  lang,
  onLanguageChange,
  onLoginSuccess,
  onSwitchToRegister
}) => {
  const t = translations[lang];

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('khang.luan@hsmibot.io');
  const [password, setPassword] = useState('HSMIBot2026!#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [robotSerial, setRobotSerial] = useState('HSMI-BOT-9042-X');
  const [regPassword, setRegPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Quick Demo Filler
  const handleFillDemo = (type: 'owner' | 'engineer') => {
    if (type === 'owner') {
      setEmail('owner.khang@hsmibot.io');
      setPassword('OwnerVaultSecure99!');
      setErrorMessage(null);
    } else {
      setEmail('ros2.dev@hsmibot.io');
      setPassword('ROS2GalacticStack@1');
      setErrorMessage(null);
    }
  };

  // Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Email hoặc Tên người dùng.' : 'Please enter Email or Username.');
      return;
    }
    if (!password) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Mật khẩu.' : 'Please enter Password.');
      return;
    }

    setLoading(true);

    // Simulate backend auth check
    setTimeout(() => {
      setLoading(false);
      
      // Determine user name based on credentials
      const username = cleanEmail.includes('khang') || cleanEmail.includes('owner') 
        ? 'Luan H. Bao Khang' 
        : cleanEmail.includes('ros2') 
          ? 'Alex Chen (ROS2)' 
          : cleanEmail.split('@')[0] || 'Administrator';

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onLoginSuccess({
        id: 'usr_01_hsmibot',
        name: username,
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-BOT-9042-X',
        robotName: 'HSMIBot Alpha Sentry'
      });
    }, 950);
  };

  // Quick Face ID / Biometric Login Mock
  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setErrorMessage(null);

    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onLoginSuccess({
          id: 'usr_bio_hsmibot',
          name: 'Luan H. Bao Khang',
          email: 'se181855luanhbaokhang@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          robotId: 'HSMI-BOT-9042-X',
          robotName: 'HSMIBot Alpha Sentry'
        });
      }, 700);
    }, 1400);
  };

  // Handle Register & Pair Robot
  const handleRegisterAndPair = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !registerEmail.trim() || !regPassword.trim() || !robotSerial.trim()) {
      setErrorMessage(
        lang === 'vi' 
          ? 'Vui lòng điền đầy đủ thông tin và mã định danh Robot.' 
          : 'Please fill in all fields and Robot Hardware Serial.'
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 }
      });

      onLoginSuccess({
        id: 'usr_new_pair',
        name: fullName.trim(),
        email: registerEmail.trim(),
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        robotId: robotSerial.trim().toUpperCase(),
        robotName: `HSMIBot (${robotSerial.slice(-4)})`
      });
    }, 1200);
  };

  // SSO Social Login simulations
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      confetti({ particleCount: 70, spread: 60 });
      onLoginSuccess({
        id: `usr_${provider.toLowerCase()}`,
        name: `${provider} Authenticated User`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-BOT-9042-X',
        robotName: 'HSMIBot Alpha Sentry'
      });
    }, 800);
  };

  return (
    <div className="w-full lg:w-1/2 min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-10 xl:p-14 overflow-y-auto">
      {/* Top Header Bar inside Form Container */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        {/* Mobile / Compact App Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              {t.brandName}
            </span>
          </div>
        </div>

        {/* Top-Right: Language Switcher & System Status Pill */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher Pill */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => onLanguageChange('vi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
                lang === 'vi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
                lang === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          {/* System Status Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">
              {t.systemOnline}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-auto py-8 max-w-lg w-full mx-auto"
      >
        {/* Welcome Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t.welcomeBack}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">
            {t.loginSubtext}
          </p>
        </div>

        {/* Segmented Tab Switcher with Framer Motion morphing pill */}
        <div className="relative flex bg-slate-200/80 p-1 rounded-xl mb-6 border border-slate-300/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'login' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'login' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{t.tabLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSwitchToRegister) {
                onSwitchToRegister();
              } else {
                setActiveTab('register');
                setErrorMessage(null);
              }
            }}
            className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'register' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'register' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{t.tabRegister}</span>
          </button>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-red-700"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 text-xs font-medium">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-red-400 hover:text-red-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Biometric Scanning Overlay Animation */}
        <AnimatePresence>
          {biometricScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner"
            >
              <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                <ScanFace className="w-8 h-8 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-sky-300 animate-ping opacity-60" />
              </div>
              <p className="text-sm font-bold text-slate-900">{t.biometricScanning}</p>
              <p className="text-xs text-blue-600 mt-1">NPU AI Face Verification active</p>
            </motion.div>
          )}

          {biometricSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs font-bold">{t.biometricSuccess}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.emailOrUsername}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Row: Remember Me & Biometrics Chip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{t.rememberMe}</span>
              </label>

              {/* Biometrics Quick Action Chip */}
              <button
                type="button"
                onClick={handleBiometricAuth}
                disabled={biometricScanning}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition shadow-2xs"
              >
                <ScanFace className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.useBiometrics}</span>
              </button>
            </div>

            {/* Primary Sign In Button with Framer Motion Spring */}
            <motion.button
              type="submit"
              disabled={loading || biometricScanning}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.signingIn}</span>
                </>
              ) : (
                <>
                  <span>{t.signInButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Quick Demo Credentials Fillers */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {t.demoQuickLogin}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('owner')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.demoOwner}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('engineer')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition shadow-2xs"
                >
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.demoSecurity}</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-slate-50 px-3 text-xs font-semibold text-slate-600 absolute">
                {t.orContinueWith}
              </span>
            </div>

            {/* SSO Social Sign-In (2 Columns) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Sign-In */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 transition shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Apple ID Sign-In */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 transition shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26Z" />
                </svg>
                <span>Apple ID</span>
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: REGISTER & PAIR ROBOT */
          <form onSubmit={handleRegisterAndPair} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="newowner@domain.com"
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
              />
            </div>

            {/* Robot Serial / QR Pairing */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.robotSerial}
                </label>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {lang === 'vi' ? 'Dưới đế trạm sạc' : 'Under Dock Station'}
                </span>
              </div>
              <div className="relative flex items-center">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={robotSerial}
                  onChange={(e) => setRobotSerial(e.target.value.toUpperCase())}
                  placeholder={t.robotSerialPlaceholder}
                  required
                  className="w-full pl-10 pr-20 py-2.5 bg-white rounded-xl border border-slate-300 text-sm font-mono text-slate-900 uppercase focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs"
                />
                <span className="absolute right-2 px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.password}
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
              />
            </div>

            {/* Pair Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-70 mt-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.pairingInProgress}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.createAndPairBtn}</span>
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Bottom Footer Text */}
      <div className="pt-4 border-t border-slate-200/80 text-center">
        {activeTab === 'login' ? (
          <p className="text-xs text-slate-600 font-medium">
            {t.noAccountPrompt}{' '}
            <button
              type="button"
              onClick={() => {
                if (onSwitchToRegister) {
                  onSwitchToRegister();
                } else {
                  setActiveTab('register');
                  setErrorMessage(null);
                }
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block cursor-pointer"
            >
              {t.pairNewRobotPrompt}
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-600 font-medium">
            {t.alreadyHaveAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block"
            >
              {t.loginNow}
            </button>
          </p>
        )}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        lang={lang}
      />
    </div>
  );
};
