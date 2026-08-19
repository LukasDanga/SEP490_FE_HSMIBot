import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Camera, 
  Edit3, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle, 
  Save, 
  RotateCcw, 
  QrCode, 
  LogOut, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Fingerprint,
  RefreshCw
} from 'lucide-react';
import { Language, UserProfile, UserProfileDetails, UserSession } from '../../types';
import { translations } from '../../i18n/translations';

interface UserProfileViewProps {
  lang: Language;
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE_DETAILS: UserProfileDetails = {
  id: 'usr_01_hsmibot',
  fullName: 'Luan H. Bao Khang',
  displayName: 'Khang Luan',
  email: 'khang.luan@hsmibot.io',
  phone: '0908123456',
  dialCode: '+84',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
  timezone: 'Asia/Ho_Chi_Minh (GMT+7)',
  preferredLanguage: 'vi',
  villaAddress: 'Villa A-12, Saigon Riverside Estate, District 2, Ho Chi Minh City',
  robotId: 'HSMI-8924-PRO',
  robotName: 'HSMIBot Alpha Sentry',
  twoFactorEnabled: true,
  memberSince: 'Aug 2026',
  verified: true,
  sessions: [
    {
      id: 'sess_1',
      device: 'Desktop Web Chrome (v128.0)',
      os: 'macOS Sonoma 14.6',
      browser: 'Google Chrome',
      ip: '118.69.14.88',
      location: 'Ho Chi Minh City, Vietnam',
      lastActive: 'Active now',
      isCurrent: true,
      type: 'desktop'
    },
    {
      id: 'sess_2',
      device: 'HSMIBot Mobile App (v2.4.0)',
      os: 'iOS 18.2 (iPhone 16 Pro)',
      browser: 'Native App',
      ip: '14.248.82.110',
      location: 'Ho Chi Minh City, Vietnam',
      lastActive: '10 mins ago',
      isCurrent: false,
      type: 'mobile'
    },
    {
      id: 'sess_3',
      device: 'Control Tablet Dashboard',
      os: 'iPadOS 18.1 (iPad Pro M4 13")',
      browser: 'Safari WebKit',
      ip: '118.69.14.88',
      location: 'Villa A-12 Home Wi-Fi',
      lastActive: '2 days ago',
      isCurrent: false,
      type: 'tablet'
    }
  ]
};

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  lang,
  currentUser,
  onUpdateUser
}) => {
  const t = translations[lang];

  // Primary Mode: 'view' | 'edit'
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Profile Form State
  const [profileData, setProfileData] = useState<UserProfileDetails>(() => {
    return {
      ...DEFAULT_PROFILE_DETAILS,
      fullName: currentUser.name || DEFAULT_PROFILE_DETAILS.fullName,
      email: currentUser.email || DEFAULT_PROFILE_DETAILS.email,
      avatar: currentUser.avatar || DEFAULT_PROFILE_DETAILS.avatar
    };
  });

  // Edit Buffer Form State (for cancellation rollback)
  const [editForm, setEditForm] = useState<UserProfileDetails>(profileData);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modals State
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLogoutOthersConfirm, setShowLogoutOthersConfirm] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch to edit mode with current profile data
  const handleStartEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  // Save changes to profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setProfileData({ ...editForm });
      onUpdateUser({
        name: editForm.fullName,
        email: editForm.email,
        avatar: editForm.avatar
      });
      setIsSaving(false);
      setIsEditing(false);
      showToast(t.toastProfileSaved);
    }, 600);
  };

  // Avatar Selection / Upload Mock
  const handleAvatarSelect = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar: url }));
    setEditForm(prev => ({ ...prev, avatar: url }));
    onUpdateUser({ avatar: url });
    setShowAvatarPickerModal(false);
    showToast(lang === 'vi' ? 'Đã cập nhật ảnh đại diện mới!' : 'Avatar updated successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const resultUrl = uploadEvent.target.result as string;
          handleAvatarSelect(resultUrl);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: t.pwdStrengthWeak, color: 'bg-red-500', text: 'text-red-600' };
      case 2:
        return { score: 2, label: t.pwdStrengthFair, color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 3, label: t.pwdStrengthGood, color: 'bg-blue-500', text: 'text-blue-600' };
      case 4:
        return { score: 4, label: t.pwdStrengthStrong, color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 0, label: t.pwdStrengthWeak, color: 'bg-red-500', text: 'text-red-600' };
    }
  };

  const pwdStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) && passwordsMatch;

  // Update Password Handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast(lang === 'vi' ? 'Vui lòng nhập mật khẩu hiện tại!' : 'Please enter your current password!');
      return;
    }
    if (!isPasswordValid) {
      showToast(lang === 'vi' ? 'Mật khẩu mới không đáp ứng đủ yêu cầu bảo mật!' : 'New password does not meet security requirements!');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast(t.toastPasswordUpdated);
    }, 750);
  };

  // Toggle 2FA state
  const handleToggle2FA = () => {
    if (profileData.twoFactorEnabled) {
      setProfileData(prev => ({ ...prev, twoFactorEnabled: false }));
      showToast(lang === 'vi' ? 'Đã tắt xác thực 2 bước (2FA)!' : '2FA authentication disabled!');
    } else {
      setShow2FAModal(true);
    }
  };

  const confirmEnable2FA = () => {
    setProfileData(prev => ({ ...prev, twoFactorEnabled: true }));
    setShow2FAModal(false);
    showToast(lang === 'vi' ? 'Đã kích hoạt xác thực 2 bước (2FA) thành công!' : '2FA authentication enabled successfully!');
  };

  // Log out other sessions
  const handleLogoutOtherSessions = () => {
    setProfileData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.isCurrent)
    }));
    setShowLogoutOthersConfirm(false);
    showToast(t.toastLoggedOutOther);
  };

  // Change Email Workflow Mock
  const handleSubmitEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput || !newEmailInput.includes('@')) {
      showToast(lang === 'vi' ? 'Vui lòng nhập email hợp lệ!' : 'Please enter a valid email address!');
      return;
    }
    setEditForm(prev => ({ ...prev, email: newEmailInput }));
    setShowEmailChangeModal(false);
    setNewEmailInput('');
    showToast(t.toastEmailSent);
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Hidden file input for custom avatar uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TOAST ALERT NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HEADER SUMMARY CARD (Always Visible)
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Top Decorative Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 relative px-6 flex items-end justify-between pb-3">
          <div className="flex items-center space-x-2 text-white/80 font-mono text-[11px] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>HSMIBOT OS SECURITY PORTAL • CERTIFIED ADMIN HUB</span>
          </div>
          <div className="text-white/60 font-mono text-[10px]">
            NODE_REV: ROS2-GALACTIC-v2.8
          </div>
        </div>

        {/* Profile Header Main Content */}
        <div className="px-6 pb-6 pt-0 relative">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12">
            
            {/* Left: Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5">
              
              {/* Large Avatar with Floating Camera Button */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 ring-1 ring-slate-200">
                  <img
                    src={profileData.avatar}
                    alt={profileData.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAvatarPickerModal(true)}
                  title={t.changeAvatar}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white transition transform hover:scale-110 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name & Registered Email */}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {profileData.fullName}
                  </h1>
                  <span title={t.verifiedAccount} className="inline-flex">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-600">{profileData.email}</span>
                </div>
              </div>

            </div>

            {/* Right: View / Edit Mode Toggle Button */}
            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 cursor-pointer ${
                    !isEditing
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.btnViewMode}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartEdit}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 cursor-pointer ${
                    isEditing
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.btnEditMode}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Horizontal Info Badges Row */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider truncate">
                  {t.pairedRobotId}
                </div>
                <div className="text-xs font-mono font-black text-slate-900 truncate">
                  #{profileData.robotId}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider truncate">
                  Security Status
                </div>
                <div className="text-xs font-mono font-black text-emerald-600 truncate">
                  {profileData.twoFactorEnabled ? t.twoFactorBadge : '2FA: Disabled'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider truncate">
                  {t.lblLanguage}
                </div>
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {profileData.preferredLanguage === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider truncate">
                  Membership
                </div>
                <div className="text-xs font-mono font-black text-slate-900 truncate">
                  {t.memberSinceBadge}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          SECTION 2 & 3: VIEW PROFILE MODE vs EDIT PROFILE MODE
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{isEditing ? t.sectionEditProfile : t.sectionPersonalDetails}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isEditing 
                ? (lang === 'vi' ? 'Điền thông tin định danh mới và nhấn Lưu thay đổi.' : 'Fill in new identity details and click Save Changes.')
                : t.sectionPersonalDetailsSub}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl text-xs font-extrabold transition flex items-center space-x-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.btnEditInfo}</span>
            </button>
          )}
        </div>

        {/* VIEW MODE: CLEAN READ-ONLY DATA GRID */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.lblFullName}</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">{profileData.fullName}</div>
            </div>

            {/* Display Name / Nickname */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.lblDisplayName}</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">{profileData.displayName}</div>
            </div>

            {/* Email Address with Verified Badge */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.lblEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-extrabold text-slate-900">{profileData.email}</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.lblPhone}</span>
              </div>
              <div className="text-sm font-mono font-extrabold text-slate-900">
                {profileData.dialCode} {profileData.phone}
              </div>
            </div>

            {/* Timezone */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.lblTimezone}</span>
              </div>
              <div className="text-sm font-mono font-semibold text-slate-800">{profileData.timezone}</div>
            </div>

            {/* Language */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.lblLanguage}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {profileData.preferredLanguage === 'vi' ? 'Tiếng Việt (VI 🇻🇳)' : 'English (US 🇺🇸)'}
              </div>
            </div>

            {/* Villa Address (Full Span) */}
            <div className="md:col-span-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{t.lblVillaAddress}</span>
              </div>
              <div className="text-sm font-medium text-slate-800 leading-relaxed">
                {profileData.villaAddress}
              </div>
            </div>

          </div>
        ) : (
          /* EDIT MODE: INTERACTIVE FORM WITH LIVE VALIDATION */
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblFullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. Luan H. Bao Khang"
                  />
                </div>
              </div>

              {/* Display Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblDisplayName}
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. Khang Luan"
                  />
                </div>
              </div>

              {/* Email Input with Workflow Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    {t.lblEmail} <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEmailChangeModal(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    {t.btnChangeEmail}
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    readOnly
                    value={editForm.email}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Input with Dial Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblPhone}
                </label>
                <div className="flex space-x-2">
                  <select
                    value={editForm.dialCode}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dialCode: e.target.value }))}
                    className="w-24 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+81">🇯🇵 +81</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="0908 123 456"
                    />
                  </div>
                </div>
              </div>

              {/* Timezone Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblTimezone}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={editForm.timezone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Asia/Ho_Chi_Minh (GMT+7)">Asia/Ho_Chi_Minh (GMT+7)</option>
                    <option value="Asia/Singapore (GMT+8)">Asia/Singapore (GMT+8)</option>
                    <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                    <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                  </select>
                </div>
              </div>

              {/* Preferred Language Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblLanguage}
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={editForm.preferredLanguage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="vi">Tiếng Việt (VI 🇻🇳)</option>
                    <option value="en">English (US 🇺🇸)</option>
                  </select>
                </div>
              </div>

              {/* Villa / Residence Address Textarea */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.lblVillaAddress}
                </label>
                <textarea
                  rows={2}
                  value={editForm.villaAddress}
                  onChange={(e) => setEditForm(prev => ({ ...prev, villaAddress: e.target.value }))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition resize-none"
                  placeholder="Enter full residential address..."
                />
              </div>

            </div>

            {/* Actions CTA Row */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                {t.btnCancel}
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/25 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t.btnSaveChanges}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* =========================================================================
          SECTION 4: SECURITY & PASSWORD CHANGE + 2FA
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sub-Card 1: Change Password Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-5">
          
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>{t.sectionSecurity}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{t.sectionSecuritySub}</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {/* Current Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t.lblCurrentPassword}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t.lblNewPassword}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Dynamic 4-Bar Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="pt-2 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Strength:</span>
                    <span className={`font-mono ${pwdStrength.text}`}>{pwdStrength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          pwdStrength.score >= step ? pwdStrength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t.lblConfirmPassword}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 transition ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Match validation indicator */}
              {confirmPassword.length > 0 && (
                <div className="text-[11px] font-bold flex items-center space-x-1.5 pt-0.5">
                  {passwordsMatch ? (
                    <span className="text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Mật khẩu trùng khớp' : 'Passwords match'}</span>
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center space-x-1">
                      <X className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match'}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1.5">
              <div className="font-extrabold text-slate-600 uppercase tracking-wider text-[10px]">
                {lang === 'vi' ? 'Yêu cầu độ phức tạp:' : 'Security requirements:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-500">
                <div className={`flex items-center space-x-1.5 ${newPassword.length >= 8 ? 'text-emerald-600 font-bold' : ''}`}>
                  {newPassword.length >= 8 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />}
                  <span>{t.pwdReqLength}</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-bold' : ''}`}>
                  {/[A-Z]/.test(newPassword) ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />}
                  <span>{t.pwdReqUpper}</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${/[0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : ''}`}>
                  {/[0-9]/.test(newPassword) ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />}
                  <span>{t.pwdReqNumber}</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : ''}`}>
                  {/[^A-Za-z0-9]/.test(newPassword) ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />}
                  <span>{t.pwdReqSpecial}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword || !isPasswordValid}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>{t.btnUpdatePassword}</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Sub-Card 2: 2FA & Multi-Factor Security Module (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.twoFactorTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{t.twoFactorDesc}</p>
            </div>

            {/* Status Switch Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {lang === 'vi' ? 'Trạng Thái 2FA' : '2FA Status'}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-600 font-bold mt-0.5">
                    {profileData.twoFactorEnabled ? t.twoFactorStatusActive : t.twoFactorStatusInactive}
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    profileData.twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      profileData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {profileData.twoFactorEnabled && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Authenticator App</span>
                  <button
                    type="button"
                    onClick={() => setShow2FAModal(true)}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Xem mã QR 2FA' : 'View 2FA QR Code'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Security Recommendations */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2 text-xs">
              <div className="font-extrabold text-blue-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'vi' ? 'Khuyến nghị bảo mật Robot' : 'Robot Security Advisory'}</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                {lang === 'vi'
                  ? 'Kích hoạt 2FA giúp ngăn chặn truy cập trái phép vào luồng Video 1080p và quyền điều khiển xe tự hành từ xa.'
                  : 'Enabling 2FA guarantees zero unauthorized override of 1080p camera streams and ROS2 autonomous dispatch.'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center pt-2">
            HSMIBot Cryptographic Engine • AES-256 GCM
          </div>

        </div>

      </div>

      {/* =========================================================================
          SECTION 5: ACTIVE SESSIONS & CONNECTED DEVICES
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>{t.sectionSessions}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{t.sectionSessionsSub}</p>
          </div>

          {profileData.sessions.length > 1 && (
            <button
              type="button"
              onClick={() => setShowLogoutOthersConfirm(true)}
              className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>{t.btnRevokeAllOther}</span>
            </button>
          )}
        </div>

        {/* Sessions List */}
        <div className="divide-y divide-slate-100">
          {profileData.sessions.map((sess) => {
            const isCurrent = sess.isCurrent;
            return (
              <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
                
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    sess.type === 'desktop'
                      ? 'bg-blue-50 text-blue-600'
                      : sess.type === 'mobile'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-purple-50 text-purple-600'
                  }`}>
                    {sess.type === 'desktop' && <Laptop className="w-5 h-5" />}
                    {sess.type === 'mobile' && <Smartphone className="w-5 h-5" />}
                    {sess.type === 'tablet' && <Tablet className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-900">{sess.device}</span>
                      {isCurrent && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{t.sessionCurrentDevice}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-2">
                      <span>{sess.os}</span>
                      <span>•</span>
                      <span>{sess.location}</span>
                      <span>•</span>
                      <span>IP: {sess.ip}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {sess.lastActive}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          MODALS & DIALOGS
         ========================================================================= */}

      {/* 1. Avatar Picker Modal */}
      {showAvatarPickerModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAvatarPickerModal(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>{t.changeAvatar}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarPickerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Choose from presets:</div>
              <div className="grid grid-cols-5 gap-2.5">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAvatarSelect(url)}
                    className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-600 hover:scale-105 transition cursor-pointer"
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAvatarPickerModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Tải ảnh từ máy tính (+)' : 'Upload Custom Image (+)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Email Modal */}
      {showEmailChangeModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEmailChangeModal(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{t.btnChangeEmail}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEmailChangeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEmailChange} className="space-y-4">
              <p className="text-xs text-slate-500">
                {lang === 'vi'
                  ? 'Hệ thống sẽ gửi mã xác thực gồm 6 chữ số đến địa chỉ email mới của bạn.'
                  : 'A 6-digit confirmation code will be dispatched to your new email.'}
              </p>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  {lang === 'vi' ? 'Email Mới' : 'New Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder="new.email@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailChangeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  {lang === 'vi' ? 'Gửi Mã Xác Thực' : 'Send Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. 2FA QR Setup Modal */}
      {show2FAModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShow2FAModal(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">{t.twoFactorTitle}</h3>
              <p className="text-xs text-slate-500">
                {lang === 'vi'
                  ? 'Quét mã QR bằng ứng dụng Google Authenticator hoặc Authy'
                  : 'Scan this QR code with Google Authenticator or Authy app'}
              </p>
            </div>

            {/* QR Mock Image */}
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 inline-block mx-auto">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/HSMIBot:khang.luan@hsmibot.io?secret=JBSWY3DPEHPK3PXP&issuer=HSMIBot"
                alt="2FA QR Code"
                className="w-40 h-40 object-contain rounded-lg"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 select-all">
              SECRET: <strong>JBSW Y3DP EHPK 3PXP</strong>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={confirmEnable2FA}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                {lang === 'vi' ? 'Xác Nhận & Bật 2FA' : 'Verify & Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logout Other Sessions Confirmation Modal */}
      {showLogoutOthersConfirm && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLogoutOthersConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">{t.btnRevokeAllOther}</h3>
              <p className="text-xs text-slate-500">
                {lang === 'vi'
                  ? 'Tất cả các thiết bị khác (iPhone 16 Pro, iPad Pro) sẽ bị đăng xuất ngay lập tức.'
                  : 'All other devices (iPhone 16 Pro, iPad Pro) will be immediately de-authenticated.'}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutOthersConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={handleLogoutOtherSessions}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                {lang === 'vi' ? 'Đăng Xuất Ngay' : 'Log Out All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
