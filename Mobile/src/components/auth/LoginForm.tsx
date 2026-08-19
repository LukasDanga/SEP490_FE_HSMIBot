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
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../../theme/colors';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
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
  const [email, setEmail] = useState('khang.luan@hsmibot.io');
  const [password, setPassword] = useState('HSMIBot2026!#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Quick Demo Filler
  const handleFillDemo = (type: 'owner' | 'engineer') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setErrorMessage(null);
    if (type === 'owner') {
      setEmail('owner.khang@hsmibot.io');
      setPassword('OwnerVaultSecure99!');
    } else {
      setEmail('ros2.dev@hsmibot.io');
      setPassword('ROS2GalacticStack@1');
    }
  };

  // Submit Login
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

      const username =
        cleanEmail.includes('khang') || cleanEmail.includes('owner')
          ? 'Luan H. Bao Khang'
          : cleanEmail.includes('ros2')
          ? 'Alex Chen (ROS2)'
          : cleanEmail.split('@')[0] || 'Administrator';

      onLoginSuccess({
        id: 'usr_01_mobile',
        name: username,
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-BOT-9042-X',
        robotName: 'HSMIBot Alpha Sentry',
      });
    }, 850);
  };

  // Biometric Auth (FaceID / Fingerprint)
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
          onLoginSuccess({
            id: 'usr_bio_mobile',
            name: 'Luan H. Bao Khang (Face ID)',
            email: 'owner.khang@hsmibot.io',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            robotId: 'HSMI-BOT-9042-X',
            robotName: 'HSMIBot Alpha Sentry',
          });
          return;
        }
      }
    } catch {
      // Fallback simulated biometric for emulator
    }

    // Simulated Biometric scan fallback
    setTimeout(() => {
      setBiometricLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      onLoginSuccess({
        id: 'usr_bio_mobile',
        name: 'Luan H. Bao Khang (Biometric)',
        email: 'owner.khang@hsmibot.io',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-BOT-9042-X',
        robotName: 'HSMIBot Alpha Sentry',
      });
    }, 1000);
  };

  // Social Login Mock
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      onLoginSuccess({
        id: `usr_${provider.toLowerCase()}_mobile`,
        name: `${provider} Authenticated User`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        robotId: 'HSMI-BOT-9042-X',
        robotName: 'HSMIBot Alpha Sentry',
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
            <ActivityIndicator size="small" color={Colors.cyan} />
          ) : (
            <>
              <ScanFace size={15} color={Colors.cyan} />
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

      {/* Quick Demo Fillers */}
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>{t.demoQuickLogin}</Text>
        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleFillDemo('owner')}
            activeOpacity={0.7}
          >
            <UserCheck size={13} color={Colors.success} />
            <Text style={styles.demoBtnText}>{t.demoOwner}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleFillDemo('engineer')}
            activeOpacity={0.7}
          >
            <Radio size={13} color={Colors.cyan} />
            <Text style={styles.demoBtnText}>{t.demoSecurity}</Text>
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
          style={styles.socialBtn}
          onPress={() => handleSocialLogin('Google')}
          activeOpacity={0.8}
        >
          <Text style={styles.socialTextGoogle}>G</Text>
          <Text style={styles.socialBtnLabel}>{t.googleSignIn}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => handleSocialLogin('Apple')}
          activeOpacity={0.8}
        >
          <Text style={styles.socialTextApple}></Text>
          <Text style={styles.socialBtnLabel}>{t.appleSignIn}</Text>
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
    color: Colors.textWhite,
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
    borderColor: 'rgba(239, 68, 68, 0.3)',
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
    marginBottom: 16,
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
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 13,
    paddingVertical: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
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
    backgroundColor: Colors.backgroundInput,
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
    fontWeight: '500',
  },
  biometricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  biometricText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cyan,
  },
  loginBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
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
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 18,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
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
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  socialTextGoogle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA4335',
  },
  socialTextApple: {
    fontSize: 16,
    color: Colors.textWhite,
  },
  socialBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  footerPrompt: {
    marginTop: 20,
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
    color: Colors.primaryLight,
  },
});
