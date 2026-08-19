import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, Mail, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sent' | 'reset'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('sent');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('reset');
    }, 900);
  };

  const handleCompleteReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setStep('input');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'input' && (
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'vi' ? 'Khôi phục mật khẩu robot' : 'Reset Robot Master Password'}
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 mb-5">
                {lang === 'vi' 
                  ? 'Nhập email liên kết với tài khoản quản trị HSMIBot. Chúng tôi sẽ gửi mã bảo mật OTP 6 chữ số.'
                  : 'Enter the email registered with your HSMIBot admin account. We will send a 6-digit verification code.'}
              </p>

              <form onSubmit={handleSendReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.emailOrUsername}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@hsmibot.io"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{lang === 'vi' ? 'Gửi mã xác minh' : 'Send Verification Code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'sent' && (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'vi' ? 'Mã xác thực đã được gửi!' : 'Verification Code Sent!'}
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 mb-6">
                {lang === 'vi' 
                  ? `Mã 6 chữ số đã được gửi đến ${email || 'email của bạn'}. Vui lòng nhập mã bên dưới:`
                  : `A 6-digit code has been sent to ${email || 'your email'}. Enter it below to proceed:`}
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center space-x-2 mb-6">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => {
                      const next = [...otp];
                      next[idx] = e.target.value;
                      setOtp(next);
                      if (e.target.value && idx < 5) {
                        document.getElementById(`otp-${idx + 1}`)?.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                ))}
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setStep('input')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'vi' ? 'Quay lại' : 'Back'}
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length < 6}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-md shadow-blue-500/20"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    lang === 'vi' ? 'Xác nhận mã' : 'Verify Code'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'vi' ? 'Đặt mật khẩu mới' : 'Set New Master Password'}
              </h3>
              <p className="text-sm text-slate-600 mt-1 mb-4">
                {lang === 'vi' 
                  ? 'Mật khẩu mới phải có tối thiểu 8 ký tự bao gồm chữ và số.'
                  : 'Your new password must be at least 8 characters including letters and numbers.'}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'vi' ? 'Mật khẩu quản trị mới' : 'New Master Password'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  onClick={handleCompleteReset}
                  disabled={loading || newPassword.length < 6}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-md shadow-blue-500/20"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    lang === 'vi' ? 'Lưu mật khẩu & Đăng nhập' : 'Save Password & Log In'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
