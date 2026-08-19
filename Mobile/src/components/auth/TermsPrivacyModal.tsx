import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldCheck, X, Check } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface TermsPrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  lang: Language;
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  visible,
  onClose,
  lang,
}) => {
  const t = translations[lang];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <ShieldCheck size={20} color={Colors.primary} />
              <Text style={styles.title}>{t.termsModalTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Terms Content */}
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeader}>
              {lang === 'vi' ? '1. Bảo Mật Sinh Trắc Học & PII Zero-Knowledge' : '1. Zero-Knowledge Biometrics & Privacy'}
            </Text>
            <Text style={styles.paragraph}>
              {lang === 'vi'
                ? 'Hệ thống HSMIBot OS cam kết xử lý nhận diện khuôn mặt cục bộ 100% trên chip NPU của phần cứng Robot. Không có hình ảnh thô nào được truyền hoặc lưu trữ trên máy chủ đám mây khi chưa có sự đồng ý của Chủ nhà.'
                : 'HSMIBot OS processes all biometric facial encodings 100% on the local Edge NPU hardware. No raw surveillance video streams or photos are stored in the cloud without explicit homeowner authorization.'}
            </Text>

            <Text style={styles.sectionHeader}>
              {lang === 'vi' ? '2. An Toàn Điều Khiển & Giao Thức DDS ROS2' : '2. Operational Safety & ROS2 Protocol'}
            </Text>
            <Text style={styles.paragraph}>
              {lang === 'vi'
                ? 'Mọi lệnh điều khiển di chuyển, phát tín hiệu khẩn cấp và thiết lập vùng cấm đều được mã hóa kênh truyền TLS/AES-256 theo tiêu chuẩn an toàn robot công nghiệp.'
                : 'All motion commands, emergency stop interrupts, and patrol boundary settings are encrypted end-to-end via AES-256 standards compliant with industrial robot safety.'}
            </Text>

            <Text style={styles.sectionHeader}>
              {lang === 'vi' ? '3. Quyền Sở Hữu Thiết Bị & Trách Nhiệm' : '3. Device Ownership & Responsibilities'}
            </Text>
            <Text style={styles.paragraph}>
              {lang === 'vi'
                ? 'Chủ tài khoản quản trị là người nắm giữ khóa bảo mật Ed25519 duy nhất để phân quyền cho các thành viên trong gia đình hoặc người giúp việc.'
                : 'The registered admin account holds the single Ed25519 master authentication certificate and maintains authority to delegate guest access.'}
            </Text>
          </ScrollView>

          {/* Bottom Accept Button */}
          <TouchableOpacity style={styles.acceptBtn} onPress={onClose} activeOpacity={0.8}>
            <Check size={16} color="#FFFFFF" />
            <Text style={styles.acceptBtnText}>{t.termsAccept}</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    paddingVertical: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
