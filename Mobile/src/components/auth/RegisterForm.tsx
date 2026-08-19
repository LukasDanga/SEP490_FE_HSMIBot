import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Bot,
  Check,
  Activity,
  Cpu,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { QrScannerModal } from './QrScannerModal';
import { TermsPrivacyModal } from './TermsPrivacyModal';

interface RegisterFormProps {
  lang: Language;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  lang,
  onLoginSuccess,
  onSwitchToLogin,
}) => {
  const t = translations[lang];

  // Wizard Step: 1 (Profile) | 2 (Robot Link) | 3 (Activation Handshake)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState('Alex Henderson');
  const [email, setEmail] = useState('owner.alex@hsmibot.io');
  const [robotSerial, setRobotSerial] = useState('HSMI-8924-A7X9');
  const [password, setPassword] = useState('HSMI_Security#99');
  const [confirmPassword, setConfirmPassword] = useState('HSMI_Security#99');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(1);

  // Password Strength Calculation
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const getStrengthMeta = () => {
    switch (strengthScore) {
      case 1:
        return { label: t.strengthWeak, color: Colors.danger, bg: Colors.danger };
      case 2:
        return { label: t.strengthFair, color: Colors.warning, bg: Colors.warning };
      case 3:
        return { label: t.strengthGood, color: Colors.primaryLight, bg: Colors.primaryLight };
      case 4:
        return { label: t.strengthStrong, color: Colors.success, bg: Colors.success };
      default:
        return { label: '', color: Colors.textMuted, bg: Colors.border };
    }
  };

  const isPasswordMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = () => {
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Họ và tên.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(lang === 'vi' ? 'Địa chỉ email không hợp lệ.' : 'Please enter a valid email.');
      return;
    }
    if (strengthScore < 2) {
      setErrorMessage(
        lang === 'vi'
          ? 'Mật khẩu còn quá yếu. Vui lòng thêm chữ hoa, số hoặc ký tự đặc biệt.'
          : 'Password is too weak.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(
        lang === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Passwords do not match.'
      );
      return;
    }
    if (!agreeTerms) {
      setErrorMessage(t.mustAcceptTerms);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCurrentStep(2);
  };

  // Step 2 Submission -> Trigger Step 3 Hardware Handshake
  const handlePairAndActivate = () => {
    setErrorMessage(null);
    if (!robotSerial.trim() || robotSerial.length < 6) {
      setErrorMessage(
        lang === 'vi' ? 'Mã Serial Robot không hợp lệ.' : 'Please enter a valid Robot Serial.'
      );
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setCurrentStep(3);
    setActiveStage(1);

    // Sequence stages
    setTimeout(() => {
      setActiveStage(2);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }, 1200);

    setTimeout(() => {
      setActiveStage(3);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }, 2400);

    setTimeout(() => {
      setActiveStage(4);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }, 3600);
  };

  // Complete Registration
  const handleComplete = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    onLoginSuccess({
      id: 'usr_new_owner_mob',
      name: fullName.trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      robotId: robotSerial.trim().toUpperCase(),
      robotName: `HSMIBot ${robotSerial.slice(-4)}`,
    });
  };

  return (
    <View style={styles.formContainer}>
      {/* Header Title */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.mainTitle}>{t.createAccountHeader}</Text>
          <Text style={styles.subTitle}>{t.createAccountSubtext}</Text>
        </View>
      </View>

      {/* 3-Step Progress Bar */}
      <View style={styles.stepProgressRow}>
        <View style={styles.stepItem}>
          <View style={[styles.stepBar, currentStep >= 1 && styles.stepBarActive]} />
          <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>
            {t.stepProfile}
          </Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepBar, currentStep >= 2 && styles.stepBarActive]} />
          <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>
            {t.stepRobotLink}
          </Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepBar, currentStep === 3 && styles.stepBarActive]} />
          <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>
            {t.stepActivation}
          </Text>
        </View>
      </View>

      {/* Error Alert Box */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color={Colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* STEP 1: ADMIN PROFILE */}
      {currentStep === 1 && (
        <View>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.fullName}</Text>
            <View style={styles.inputWrapper}>
              <User size={16} color={Colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder={t.fullNamePlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.emailAddress}</Text>
            <View style={styles.inputWrapper}>
              <Mail size={16} color={Colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t.registerEmailPlaceholder}
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t.password}</Text>
              {password.length > 0 && (
                <Text style={[styles.strengthText, { color: getStrengthMeta().color }]}>
                  {getStrengthMeta().label}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <Lock size={16} color={Colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
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

            {/* 4-bar Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthBarContainer}>
                {[1, 2, 3, 4].map((bar) => (
                  <View
                    key={bar}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor:
                          strengthScore >= bar ? getStrengthMeta().bg : Colors.borderLight,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t.confirmPassword}</Text>
              {confirmPassword.length > 0 && (
                <Text
                  style={[
                    styles.strengthText,
                    { color: isPasswordMatch ? Colors.success : Colors.danger },
                  ]}
                >
                  {isPasswordMatch ? t.passwordMatch : t.passwordMismatch}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <Lock size={16} color={Colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} color={Colors.textSecondary} />
                ) : (
                  <Eye size={16} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms & Privacy Checkbox */}
          <View style={styles.termsWrapper}>
            <TouchableOpacity
              onPress={() => setAgreeTerms(!agreeTerms)}
              style={styles.checkboxTouch}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
            <View style={styles.termsTextRow}>
              <Text style={styles.termsText}>
                {t.agreeTermsPrefix}{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => setShowTermsModal(true)}
                >
                  {t.termsOfService}
                </Text>{' '}
                {t.andConjunction}{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => setShowTermsModal(true)}
                >
                  {t.privacyPolicy}
                </Text>
              </Text>
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleProceedToStep2}
            activeOpacity={0.85}
            style={styles.actionBtnWrapper}
          >
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Text style={styles.actionBtnText}>{t.nextStepBtn}</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: ROBOT PAIRING */}
      {currentStep === 2 && (
        <View>
          {/* Serial Input + QR Button */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t.robotSerial}</Text>
              <TouchableOpacity
                onPress={() => setShowQrModal(true)}
                style={styles.qrBadgeBtn}
                activeOpacity={0.7}
              >
                <QrCode size={13} color={Colors.cyan} />
                <Text style={styles.qrBadgeText}>{t.scanQrBtn}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Bot size={16} color={Colors.primaryLight} style={styles.fieldIcon} />
              <TextInput
                value={robotSerial}
                onChangeText={(val) => setRobotSerial(val.toUpperCase())}
                placeholder={t.robotSerialPlaceholder}
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
                style={[styles.textInput, styles.fontMono]}
              />
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.fieldHint}>{t.scanQrHint}</Text>
          </View>

          {/* Hardware Diagnostic Auto Check Box */}
          <View style={styles.diagnosticCard}>
            <View style={styles.diagHeader}>
              <Text style={styles.diagTitle}>
                {lang === 'vi' ? 'Kiểm tra Cảm biến Phần cứng' : 'Hardware Sensor Diagnostic'}
              </Text>
              <View style={styles.readyBadge}>
                <Text style={styles.readyText}>READY</Text>
              </View>
            </View>

            <View style={styles.sensorGrid}>
              <View style={styles.sensorItem}>
                <View style={styles.dotOnline} />
                <Text style={styles.sensorText}>LiDAR 360° (Ouster)</Text>
              </View>
              <View style={styles.sensorItem}>
                <View style={styles.dotOnline} />
                <Text style={styles.sensorText}>RGB-D RealSense</Text>
              </View>
              <View style={styles.sensorItem}>
                <View style={styles.dotOnline} />
                <Text style={styles.sensorText}>Edge NPU 26 TOPS</Text>
              </View>
              <View style={styles.sensorItem}>
                <View style={styles.dotOnline} />
                <Text style={styles.sensorText}>ROS2 Galactic DDS</Text>
              </View>
            </View>
          </View>

          {/* Navigation Buttons Row */}
          <View style={styles.step2ActionsRow}>
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={16} color={Colors.textSecondary} />
              <Text style={styles.backBtnText}>{t.prevStepBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePairAndActivate}
              activeOpacity={0.85}
              style={[styles.actionBtnWrapper, { flex: 1 }]}
            >
              <LinearGradient
                colors={['#2563EB', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <ShieldCheck size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>{t.createAndPairBtn}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: ACTIVATION HANDSHAKE ANIMATION */}
      {currentStep === 3 && (
        <View style={styles.step3Wrapper}>
          {/* Glowing Animated Dome */}
          <View style={styles.animationDome}>
            <LinearGradient
              colors={['#2563EB', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.domeCore}
            >
              {activeStage >= 4 ? (
                <CheckCircle2 size={36} color="#FFFFFF" />
              ) : (
                <Activity size={36} color="#FFFFFF" />
              )}
            </LinearGradient>
          </View>

          {/* Title & Stage Text */}
          <Text style={styles.stageTitle}>
            {activeStage >= 4
              ? lang === 'vi'
                ? '🎉 Kích hoạt Phần cứng Thành công!'
                : '🎉 Hardware Activated Successfully!'
              : t.activatingRobot}
          </Text>

          <Text style={styles.stageDesc}>
            {activeStage === 1 && t.stage1Dds}
            {activeStage === 2 && t.stage2Sensors}
            {activeStage === 3 && t.stage3Cert}
            {activeStage === 4 && t.stage4Done}
          </Text>

          {/* Progress Bar */}
          <View style={styles.handshakeProgressWrapper}>
            <View style={styles.handshakeHeader}>
              <Text style={styles.handshakeLabel}>ROS2 DDS Handshake</Text>
              <Text style={styles.handshakePct}>{activeStage * 25}%</Text>
            </View>
            <View style={styles.handshakeTrack}>
              <View style={[styles.handshakeFill, { width: `${activeStage * 25}%` }]} />
            </View>
          </View>

          {/* Enter Portal CTA */}
          {activeStage >= 4 && (
            <TouchableOpacity
              onPress={handleComplete}
              activeOpacity={0.85}
              style={styles.enterPortalWrapper}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionBtnText}>{t.enterPortalBtn}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Footer link to Login */}
      {currentStep < 3 && (
        <View style={styles.footerPrompt}>
          <Text style={styles.footerPromptText}>{t.alreadyHaveAccount} </Text>
          <TouchableOpacity onPress={onSwitchToLogin} activeOpacity={0.7}>
            <Text style={styles.loginLink}>{t.loginNow}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <QrScannerModal
        visible={showQrModal}
        onClose={() => setShowQrModal(false)}
        onScanSuccess={(serial) => setRobotSerial(serial)}
        lang={lang}
      />
      <TermsPrivacyModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        lang={lang}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  headerRow: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  stepProgressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  stepItem: {
    flex: 1,
  },
  stepBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    marginBottom: 4,
  },
  stepBarActive: {
    backgroundColor: Colors.primaryLight,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepLabelActive: {
    color: Colors.textPrimary,
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
  strengthText: {
    fontSize: 11,
    fontWeight: '700',
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
  fontMono: {
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  strengthBarContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
  fieldHint: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  qrBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  qrBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.cyan,
  },
  verifiedTag: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
    gap: 8,
  },
  checkboxTouch: {
    paddingTop: 2,
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
  termsTextRow: {
    flex: 1,
  },
  termsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  termsLink: {
    color: Colors.primaryLight,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  diagnosticCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  diagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diagTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textWhite,
    textTransform: 'uppercase',
  },
  readyBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  readyText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sensorItem: {
    flexBasis: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  dotOnline: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  sensorText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  step2ActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  actionBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  actionGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  step3Wrapper: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  animationDome: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  domeCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 6,
  },
  stageDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'monospace',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  handshakeProgressWrapper: {
    width: '100%',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 18,
  },
  handshakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  handshakeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  handshakePct: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.cyan,
  },
  handshakeTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.backgroundInput,
    borderRadius: 3,
    overflow: 'hidden',
  },
  handshakeFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
  },
  enterPortalWrapper: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  footerPrompt: {
    marginTop: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerPromptText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
});
