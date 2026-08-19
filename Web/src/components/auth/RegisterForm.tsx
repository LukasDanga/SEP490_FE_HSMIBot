import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Bot, 
  Radio, 
  ExternalLink,
  HelpCircle,
  Activity,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { QrScannerModal } from './QrScannerModal';
import { TermsPrivacyModal } from './TermsPrivacyModal';
import { SupportModal } from './SupportModal';

interface RegisterFormProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  lang,
  onLanguageChange,
  onLoginSuccess,
  onSwitchToLogin
}) => {
  const t = translations[lang];

  // Wizard Step: 1 (Admin Profile) | 2 (Robot Hardware Pairing) | 3 (Activation Handshake)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState('Alex Henderson');
  const [email, setEmail] = useState('owner.alex@hsmibot.io');
  const [robotSerial, setRobotSerial] = useState('HSMI-8924-A7X9');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI / Interactive States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [activeStep3Stage, setActiveStep3Stage] = useState<number>(0);

  // Live Email Validation
  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  // Real-time Password Strength Calculation
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (passwordChecks.length) score += 1;
    if (passwordChecks.upper) score += 1;
    if (passwordChecks.number) score += 1;
    if (passwordChecks.special) score += 1;
    return score;
  }, [password, passwordChecks]);

  const getStrengthLabel = () => {
    switch (strengthScore) {
      case 1:
        return { label: t.strengthWeak, color: 'text-red-600', bg: 'bg-red-500' };
      case 2:
        return { label: t.strengthFair, color: 'text-amber-600', bg: 'bg-amber-500' };
      case 3:
        return { label: t.strengthGood, color: 'text-blue-600', bg: 'bg-blue-500' };
      case 4:
        return { label: t.strengthStrong, color: 'text-emerald-600', bg: 'bg-emerald-500' };
      default:
        return { label: '', color: 'text-slate-400', bg: 'bg-slate-200' };
    }
  };

  const isPasswordMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Live Serial Format Verification
  const isSerialValid = useMemo(() => {
    return robotSerial.trim().length >= 8;
  }, [robotSerial]);

  // Step 1 Validation & Proceed
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Họ và tên.' : 'Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage(lang === 'vi' ? 'Địa chỉ email không hợp lệ.' : 'Please enter a valid email address.');
      return;
    }
    if (strengthScore < 2) {
      setErrorMessage(lang === 'vi' ? 'Mật khẩu còn quá yếu. Vui lòng thêm chữ hoa, số hoặc ký tự đặc biệt.' : 'Password is too weak. Please meet more security requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(lang === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage(t.mustAcceptTerms);
      return;
    }

    setCurrentStep(2);
  };

  // Step 2 Submission & Trigger Hardware Handshake Activation
  const handlePairAndActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSerialValid) {
      setErrorMessage(lang === 'vi' ? 'Mã định danh Robot không hợp lệ.' : 'Please enter a valid Robot Serial.');
      return;
    }

    // Move to Step 3 Activation Animation
    setCurrentStep(3);
    setActiveStep3Stage(1);

    // Sequence through hardware handshake
    setTimeout(() => {
      setActiveStep3Stage(2);
    }, 1200);

    setTimeout(() => {
      setActiveStep3Stage(3);
    }, 2400);

    setTimeout(() => {
      setActiveStep3Stage(4);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 3600);
  };

  // Enter Portal upon Activation completion
  const handleCompleteRegistration = () => {
    onLoginSuccess({
      id: 'usr_new_owner',
      name: fullName.trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      robotId: robotSerial.trim().toUpperCase(),
      robotName: `HSMIBot ${robotSerial.slice(-4)}`
    });
  };

  // Social SSO
  const handleSocialRegister = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      confetti({ particleCount: 80, spread: 70 });
      onLoginSuccess({
        id: `usr_${provider.toLowerCase()}_reg`,
        name: `${provider} Verified Owner`,
        email: `owner@${provider.toLowerCase()}.com`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-8924-A7X9',
        robotName: 'HSMIBot Alpha Sentry'
      });
    }, 850);
  };

  return (
    <div className="w-full lg:w-1/2 min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-10 xl:p-14 overflow-y-auto">
      {/* Top Header Bar inside Form Container */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        {/* Brand Logo */}
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

        {/* Right Controls: Language Switcher & Already Registered Sign In Link */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher Pill */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => onLanguageChange('vi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
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
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                lang === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          {/* Already registered? Sign In */}
          <button
            onClick={onSwitchToLogin}
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-blue-200"
          >
            <span>{t.alreadyRegistered}</span>
            <span className="underline">{t.signInLink}</span>
          </button>
        </div>
      </div>

      {/* Main Content Form Container */}
      <div className="my-auto py-6 max-w-lg w-full mx-auto">
        {/* Header Title */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {t.createAccountHeader}
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              STEP {currentStep} OF 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            {t.createAccountSubtext}
          </p>
        </div>

        {/* Animated Multi-Step Progress Indicator */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div 
            onClick={() => currentStep > 1 && setCurrentStep(1)}
            className={`cursor-pointer transition-all ${
              currentStep >= 1 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`h-1.5 rounded-full mb-1.5 transition-all ${
              currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            <span className="text-[10px] font-bold text-slate-700 block truncate">
              {t.stepProfile}
            </span>
          </div>

          <div 
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`cursor-pointer transition-all ${
              currentStep >= 2 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`h-1.5 rounded-full mb-1.5 transition-all ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            <span className="text-[10px] font-bold text-slate-700 block truncate">
              {t.stepRobotLink}
            </span>
          </div>

          <div className={`transition-all ${currentStep === 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`h-1.5 rounded-full mb-1.5 transition-all ${
              currentStep === 3 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            <span className="text-[10px] font-bold text-slate-700 block truncate">
              {t.stepActivation}
            </span>
          </div>
        </div>

        {/* Error Alert Message */}
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

        {/* STEP 1: ADMIN PROFILE & SECURITY CREDENTIALS */}
        {currentStep === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleProceedToStep2}
            className="space-y-4"
          >
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.fullName}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-medium"
                />
              </div>
            </div>

            {/* Email Address with Live Validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.emailAddress}
                </label>
                {email && (
                  <span className={`text-[10px] font-bold flex items-center space-x-1 ${
                    isEmailValid ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {isEmailValid ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{t.validEmail}</span>
                      </>
                    ) : (
                      <span>{t.invalidEmail}</span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.registerEmailPlaceholder}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-3 transition shadow-2xs font-medium ${
                    email 
                      ? isEmailValid 
                        ? 'border-emerald-400 focus:border-emerald-600 focus:ring-emerald-500/15'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-500/15'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/15'
                  }`}
                />
              </div>
            </div>

            {/* Password Input with Strength Meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.password}
                </label>
                {password && (
                  <span className={`text-[11px] font-bold ${getStrengthLabel().color}`}>
                    {getStrengthLabel().label}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
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

              {/* 4-Bar Dynamic Animated Password Strength Meter */}
              {password && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-2"
                >
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div 
                        key={bar}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          strengthScore >= bar ? getStrengthLabel().bg : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Dynamic Checklist Requirements */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div className={`flex items-center space-x-1.5 ${passwordChecks.length ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.length ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{t.reqLength}</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${passwordChecks.upper ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.upper ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{t.reqUpper}</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${passwordChecks.number ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.number ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{t.reqNumber}</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${passwordChecks.special ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.special ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{t.reqSpecial}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Input with Match Indicator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.confirmPassword}
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold flex items-center space-x-1 ${
                    isPasswordMatch ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {isPasswordMatch ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{t.passwordMatch}</span>
                      </>
                    ) : (
                      <span>{t.passwordMismatch}</span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-3 transition shadow-2xs font-medium ${
                    confirmPassword
                      ? isPasswordMatch
                        ? 'border-emerald-400 focus:border-emerald-600 focus:ring-emerald-500/15'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-500/15'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms & Privacy Custom Checkbox with Clickable Modals */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="leading-relaxed">
                  {t.agreeTermsPrefix}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {t.termsOfService}
                  </button>{' '}
                  {t.andConjunction}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {t.privacyPolicy}
                  </button>{' '}
                  <span className="text-[11px] text-slate-500 font-medium">{t.privacyNote}</span>
                </span>
              </label>
            </div>

            {/* Next Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition cursor-pointer mt-3"
            >
              <span>{t.nextStepBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-slate-50 px-3 text-xs font-semibold text-slate-600 absolute">
                {t.ssoOr}
              </span>
            </div>

            {/* Social SSO Registration */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialRegister('Google')}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 transition shadow-2xs cursor-pointer"
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
                <span>Google Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialRegister('Apple')}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 transition shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26Z" />
                </svg>
                <span>Apple ID</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 2: ROBOT HARDWARE PAIRING & IOT DISCOVERY */}
        {currentStep === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handlePairAndActivate}
            className="space-y-4"
          >
            {/* Robot Serial / Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.robotSerial}
                </label>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{t.scanQrBtn}</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <Bot className="w-4 h-4 text-blue-600 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={robotSerial}
                  onChange={(e) => setRobotSerial(e.target.value.toUpperCase())}
                  placeholder={t.robotSerialPlaceholder}
                  required
                  className="w-full pl-10 pr-24 py-2.5 bg-white rounded-xl border border-slate-300 font-mono text-sm uppercase text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition shadow-2xs font-bold tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title={t.scanQrTooltip}
                  className="absolute right-2 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center space-x-1 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scan</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
                <span>{t.scanQrTooltip}</span>
                <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.serialVerified}</span>
                </span>
              </div>
            </div>

            {/* Hardware Sensor Bus Ready Indicators */}
            <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Hardware Self-Check (Auto Diagnostic)</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">READY</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-slate-700">LiDAR 360° (Ouster)</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-slate-700">RGB-D RealSense</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-slate-700">Edge NPU 26 TOPS</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-slate-700">Differential Drive</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row: Back + Pair CTA */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.prevStepBtn}</span>
              </button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.createAndPairBtn}</span>
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* STEP 3: ACTIVATION & CALIBRATION HANDSHAKE */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-2 text-center"
          >
            {/* Visual Hardware Animation Dome */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-50" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-300 animate-spin duration-3000" />
              
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                {activeStep3Stage >= 4 ? (
                  <CheckCircle2 className="w-10 h-10 text-white animate-bounce" />
                ) : (
                  <Activity className="w-10 h-10 text-white animate-pulse" />
                )}
              </div>
            </div>

            {/* Dynamic Real-time Status Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                {activeStep3Stage >= 4 ? (
                  lang === 'vi' ? '🎉 Kích Hoạt Phần Cứng Thành Công!' : '🎉 Robot Hardware Activated!'
                ) : (
                  t.activatingRobot
                )}
              </h3>
              <p className="text-xs text-slate-600 font-mono max-w-sm mx-auto">
                {activeStep3Stage === 1 && t.handshakeDds}
                {activeStep3Stage === 2 && t.calibratingSensors}
                {activeStep3Stage === 3 && t.exchangingKeys}
                {activeStep3Stage === 4 && t.activationComplete}
              </p>
            </div>

            {/* Handshake Progress Bars */}
            <div className="max-w-xs mx-auto space-y-2 text-left">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span>ROS2 DDS Handshake</span>
                <span className="font-mono text-blue-600">{Math.min(100, activeStep3Stage * 25)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, activeStep3Stage * 25)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Enter Portal CTA Button when finished */}
            {activeStep3Stage >= 4 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompleteRegistration}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>{t.enterPortalBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Help & Support Link */}
      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div>
          <span>{t.needHelp}{' '}</span>
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {t.contactSupport}
          </button>
        </div>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-slate-700 hover:text-blue-600"
        >
          {t.alreadyRegistered} {t.signInLink} →
        </button>
      </div>

      {/* QR Scanner Camera Modal */}
      <QrScannerModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onScanSuccess={(serial) => setRobotSerial(serial)}
        lang={lang}
      />

      {/* Terms & Privacy Modal */}
      <TermsPrivacyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        lang={lang}
      />

      {/* 24/7 Technical Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        lang={lang}
      />
    </div>
  );
};
