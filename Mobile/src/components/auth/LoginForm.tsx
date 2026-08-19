import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ScanFace,
  ArrowRight,
  AlertCircle,
  X,
  UserCheck,
  Radio,
  Check,
  ShieldAlert,
  HeartHandshake,
  Wrench,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../../theme/colors';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { mockUsers, authenticateMockUser } from '../../mock/mockData';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginFormProps {
  lang: Language;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  lang,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const t = translations[lang];

  // Fields
  const [email, setEmail] = useState('admin.khang@hsmibot.io');
  const [password, setPassword] = useState('HSMIBot2026!#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Quick Demo Filler for 4 Users (1 Admin & 3 Members)
  const handleFillDemoUser = (userIndex: number) => {
    const target = mockUsers[userIndex];
    if (target) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      setEmail(target.email);
      setPassword(target.password || 'HSMIBot2026!#');
      setErrorMessage(null);
    }
  };

  // Submit Login with mock authentication
  const handleLogin = () => {
    setErrorMessage(null);
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage(
        lang === 'vi' ? 'Vui lòng nhập Email hoặc Tài khoản.' : 'Please enter Email or Username.'
      );
      return;
    }
    if (!password) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Mật khẩu.' : 'Please enter Password.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      // Authenticate against 4 mock users
      const authUser = authenticateMockUser(cleanEmail, password);

      onLoginSuccess({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        role: authUser.role,
        category: authUser.category,
        robotId: authUser.robotId,
        robotName: authUser.robotName,
      });
    }, 800);
  };

  // Biometric Auth (FaceID / Fingerprint) -> Logs in as Admin
  const handleBiometricAuth = async () => {
    setErrorMessage(null);
    setBiometricLoading(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t.biometricPrompt,
          fallbackLabel: t.password,
          disableDeviceFallback: false,
        });

        if (result.success) {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          setBiometricLoading(false);
          const adminUser = mockUsers[0];
          onLoginSuccess({
            id: adminUser.id,
            name: `${adminUser.name} (Face ID)`,
            email: adminUser.email,
            avatar: adminUser.avatar,
            role: adminUser.role,
            category: adminUser.category,
            robotId: adminUser.robotId,
            robotName: adminUser.robotName,
          });
          return;
        }
      }
    } catch {}

    // Simulated Biometric fallback for testing
    setTimeout(() => {
      setBiometricLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      const adminUser = mockUsers[0];
      onLoginSuccess({
        id: adminUser.id,
        name: `${adminUser.name} (Biometric)`,
        email: adminUser.email,
        avatar: adminUser.avatar,
        role: adminUser.role,
        category: adminUser.category,
        robotId: adminUser.robotId,
        robotName: adminUser.robotName,
      });
    }, 900);
  };

  // Social Login Mock
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      const memberUser = mockUsers[1];
      onLoginSuccess({
        id: `usr_${provider.toLowerCase()}_mobile`,
        name: `${provider} (${memberUser.name})`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: memberUser.avatar,
        role: 'member',
        category: 'resident',
        robotId: memberUser.robotId,
        robotName: memberUser.robotName,
      });
    }, 600);
  };

  return (
    <View style={styles.formContainer}>
      {/* Welcome Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingTitle}>{t.welcomeBack}</Text>
        <Text style={styles.greetingSub}>{t.loginSubtext}</Text>
      </View>

      {/* Error Alert Box */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color={Colors.danger} style={{ marginTop: 2 }} />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)} activeOpacity={0.7}>
            <X size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Email / Username Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t.emailOrUsername}</Text>
        <View style={styles.inputWrapper}>
          <Mail size={16} color={Colors.textMuted} style={styles.fieldIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t.emailPlaceholder}
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInput}
          />
          {email.length > 0 && (
            <TouchableOpacity onPress={() => setEmail('')} activeOpacity={0.7}>
              <X size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t.password}</Text>
          <TouchableOpacity onPress={() => setShowForgotModal(true)} activeOpacity={0.7}>
            <Text style={styles.forgotLink}>{t.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <Lock size={16} color={Colors.textMuted} style={styles.fieldIcon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t.passwordPlaceholder}
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
            {showPassword ? (
              <EyeOff size={16} color={Colors.textSecondary} />
            ) : (
              <Eye size={16} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Remember Me & Biometrics Row */}
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
            {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.checkboxLabel}>{t.rememberMe}</Text>
        </TouchableOpacity>

        {/* Biometrics Face ID Button */}
        <TouchableOpacity
          onPress={handleBiometricAuth}
          disabled={biometricLoading}
          style={styles.biometricChip}
          activeOpacity={0.7}
        >
          {biometricLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              <ScanFace size={15} color={Colors.primary} />
              <Text style={styles.biometricText}>{t.useBiometrics}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Primary Sign In Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading || biometricLoading}
        activeOpacity={0.85}
        style={styles.loginBtnWrapper}
      >
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loginGradient}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loginBtnText}>{t.signingIn}</Text>
            </View>
          ) : (
            <View style={styles.btnContentRow}>
              <Text style={styles.loginBtnText}>{t.signInButton}</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* 4 Quick Demo Fillers (1 Admin & 3 Members) */}
      <View style={styles.demoSection}>
        <View style={styles.demoHeaderRow}>
          <Text style={styles.demoTitle}>{t.demoQuickLogin}</Text>
          <Sparkles size={12} color={Colors.primary} />
        </View>

        <View style={styles.demoGrid}>
          {/* User 1: Admin */}
          <TouchableOpacity
            style={[styles.demoBtn, email === mockUsers[0].email && styles.demoBtnSelected]}
            onPress={() => handleFillDemoUser(0)}
            activeOpacity={0.7}
          >
            <ShieldAlert size={13} color={Colors.primary} />
            <Text style={[styles.demoBtnText, email === mockUsers[0].email && styles.demoBtnTextSelected]}>
              {t.demoAdmin}
            </Text>
          </TouchableOpacity>

          {/* User 2: Member 1 - Resident */}
          <TouchableOpacity
            style={[styles.demoBtn, email === mockUsers[1].email && styles.demoBtnSelected]}
            onPress={() => handleFillDemoUser(1)}
            activeOpacity={0.7}
          >
            <HeartHandshake size={13} color={Colors.success} />
            <Text style={[styles.demoBtnText, email === mockUsers[1].email && styles.demoBtnTextSelected]}>
              {t.demoResident}
            </Text>
          </TouchableOpacity>

          {/* User 3: Member 2 - Engineer */}
          <TouchableOpacity
            style={[styles.demoBtn, email === mockUsers[2].email && styles.demoBtnSelected]}
            onPress={() => handleFillDemoUser(2)}
            activeOpacity={0.7}
          >
            <Wrench size={13} color={Colors.warning} />
            <Text style={[styles.demoBtnText, email === mockUsers[2].email && styles.demoBtnTextSelected]}>
              {t.demoEngineer}
            </Text>
          </TouchableOpacity>

          {/* User 4: Member 3 - Housekeeper */}
          <TouchableOpacity
            style={[styles.demoBtn, email === mockUsers[3].email && styles.demoBtnSelected]}
            onPress={() => handleFillDemoUser(3)}
            activeOpacity={0.7}
          >
            <UserCheck size={13} color={Colors.purple} />
            <Text style={[styles.demoBtnText, email === mockUsers[3].email && styles.demoBtnTextSelected]}>
              {t.demoGuest}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{t.orContinueWith}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social SSO Sign-in */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialBtnGoogle}
          onPress={() => handleSocialLogin('Google')}
          activeOpacity={0.8}
        >
          <Text style={styles.socialTextGoogle}>G</Text>
          <Text style={styles.socialBtnLabelGoogle}>{t.googleSignIn}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtnApple}
          onPress={() => handleSocialLogin('Apple')}
          activeOpacity={0.8}
        >
          <Text style={styles.socialTextApple}></Text>
          <Text style={styles.socialBtnLabelApple}>{t.appleSignIn}</Text>
        </TouchableOpacity>
      </View>

      {/* Switch to Register footer */}
      <View style={styles.footerPrompt}>
        <Text style={styles.footerPromptText}>{t.noAccountPrompt} </Text>
        <TouchableOpacity onPress={onSwitchToRegister} activeOpacity={0.7}>
          <Text style={styles.registerLink}>{t.pairNewRobotPrompt}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ForgotPasswordModal
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        lang={lang}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  greetingBox: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  greetingSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerBg,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    paddingVertical: 12,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  biometricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  biometricText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  loginBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loginGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  demoBtn: {
    flexBasis: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoBtnSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  demoBtnTextSelected: {
    color: Colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtnGoogle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  socialTextGoogle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA4335',
  },
  socialBtnLabelGoogle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  socialBtnApple: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  socialTextApple: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  socialBtnLabelApple: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerPrompt: {
    marginTop: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerPromptText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
