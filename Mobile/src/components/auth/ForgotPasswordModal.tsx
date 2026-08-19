import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Mail, X, CheckCircle2, KeyRound } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  lang: Language;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSentSuccess(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }, 1000);
  };

  const handleClose = () => {
    setSentSuccess(false);
    setError(null);
    setEmail('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconBadge}>
            <KeyRound size={22} color={Colors.primary} />
          </View>

          <Text style={styles.title}>{t.forgotModalTitle}</Text>
          <Text style={styles.desc}>{t.forgotModalDesc}</Text>

          {sentSuccess ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={28} color={Colors.success} />
              <Text style={styles.successText}>{t.otpSentSuccess}</Text>
              <TouchableOpacity style={styles.doneBtn} onPress={handleClose} activeOpacity={0.8}>
                <Text style={styles.doneBtnText}>{t.closeModal}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formSection}>
              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.inputWrapper}>
                <Mail size={16} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="owner@hsmibot.io"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.8}
                style={styles.submitBtnWrapper}
              >
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>{t.sendOtpBtn}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  formSection: {
    width: '100%',
  },
  errorText: {
    fontSize: 11,
    color: Colors.danger,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    paddingVertical: 12,
    fontWeight: '500',
  },
  submitBtnWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  successText: {
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 18,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: Colors.primarySubtle,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  doneBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
