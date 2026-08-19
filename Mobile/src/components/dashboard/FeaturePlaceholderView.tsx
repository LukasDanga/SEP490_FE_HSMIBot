import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  Video,
  Map,
  ClipboardList,
  Settings,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { MainTabType } from '../common/BottomNavBar';

interface FeaturePlaceholderViewProps {
  tab: MainTabType;
  user: UserProfile;
  lang: Language;
  onBackToHome: () => void;
}

export const FeaturePlaceholderView: React.FC<FeaturePlaceholderViewProps> = ({
  tab,
  user,
  lang,
  onBackToHome,
}) => {
  const t = translations[lang];

  const getTabMeta = () => {
    switch (tab) {
      case 'camera':
        return {
          title: t.camScreenTitle,
          sub: t.camScreenSub,
          icon: Video,
          color: Colors.primary,
          subtle: Colors.primarySubtle,
          checkpoints: [
            lang === 'vi' ? 'Luồng WebRTC HD độ trễ cực thấp 32ms' : 'Low-latency 32ms WebRTC HD Stream',
            lang === 'vi' ? 'Bộ điều khiển xoay Pan/Tilt & Zoom PTZ' : 'PTZ Pan/Tilt & Zoom controls',
            lang === 'vi' ? 'Đàm thoại âm thanh 2 chiều với gia đình' : 'Two-way audio intercom',
            lang === 'vi' ? 'Chụp ảnh AI & Ghi video an ninh 30s' : 'AI snapshot & 30s incident recording',
          ],
        };
      case 'map':
        return {
          title: t.mapScreenTitle,
          sub: t.mapScreenSub,
          icon: Map,
          color: Colors.cyan,
          subtle: Colors.cyanSubtle,
          checkpoints: [
            lang === 'vi' ? 'Bản đồ SLAM 2D Occupancy Grid thời gian thực' : 'Real-time 2D Occupancy Grid SLAM Map',
            lang === 'vi' ? 'Vẽ tường ảo (Virtual Walls) & Vùng cấm (Keep-Out)' : 'Virtual walls & keep-out zones editor',
            lang === 'vi' ? 'Phân vùng phòng (Phòng khách, Bếp, Ban công)' : 'Room partitions & naming',
            lang === 'vi' ? 'Hiệu chuẩn tọa độ trạm sạc Docking Station' : 'Dock home-base calibration',
          ],
        };
      case 'logs':
        return {
          title: t.logsScreenTitle,
          sub: t.logsScreenSub,
          icon: ClipboardList,
          color: Colors.warning,
          subtle: Colors.warningBg,
          checkpoints: [
            lang === 'vi' ? 'Lịch sử phát hiện người lạ & xác thực Face ID' : 'Stranger detection & AI whitelist log',
            lang === 'vi' ? 'Cảnh báo nhiệt độ & nồng độ khói MQ-2' : 'Thermal spike & smoke sensor telemetry',
            lang === 'vi' ? 'Phát lại video WebRTC 1080p sự cố' : '1080p incident video playback',
            lang === 'vi' ? 'Xuất báo cáo kiểm toán bảo mật CSV' : 'Export security CSV audit reports',
          ],
        };
      case 'settings':
        return {
          title: t.settingsScreenTitle,
          sub: t.settingsScreenSub,
          icon: Settings,
          color: Colors.purple,
          subtle: Colors.purpleSubtle,
          checkpoints: [
            lang === 'vi' ? 'Quản lý phân quyền thành viên (Chủ nhà & Member)' : 'User delegation & permissions management',
            lang === 'vi' ? 'Bảo mật xác thực 2 lớp (2FA) & Đổi mật khẩu' : '2FA Authentication & Security password',
            lang === 'vi' ? 'Cấu hình thông báo khẩn cấp & SOS' : 'Emergency SOS & Push notifications',
            lang === 'vi' ? 'Đồng bộ kết nối Robot ROS2 Galactic' : 'ROS2 Galactic connection & device status',
          ],
        };
      default:
        return {
          title: t.underDevTitle,
          sub: t.underDevDesc,
          icon: Sparkles,
          color: Colors.primary,
          subtle: Colors.primarySubtle,
          checkpoints: [],
        };
    }
  };

  const meta = getTabMeta();
  const IconComponent = meta.icon;

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onBackToHome();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Top Banner Card */}
      <View style={styles.mainCard}>
        {/* Ready Badge */}
        <View style={styles.badgeRow}>
          <View style={[styles.readyBadge, { backgroundColor: meta.subtle }]}>
            <Clock size={12} color={meta.color} />
            <Text style={[styles.readyBadgeText, { color: meta.color }]}>
              {t.underDevReadyTag}
            </Text>
          </View>

          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>
              {user.role === 'admin' ? t.roleHomeowner : t.roleMember}
            </Text>
          </View>
        </View>

        {/* Feature Icon Dome */}
        <View style={[styles.iconDome, { backgroundColor: meta.subtle }]}>
          <IconComponent size={36} color={meta.color} />
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{meta.title}</Text>
        <Text style={styles.subtitle}>{meta.sub}</Text>
        <Text style={styles.description}>{t.underDevDesc}</Text>

        {/* Roadmap Preview Checklist */}
        <View style={styles.roadmapBox}>
          <Text style={styles.roadmapTitle}>
            {lang === 'vi' ? 'CÁC TÍNH NĂNG ĐANG ĐƯỢC PHÁT TRIỂN:' : 'PLANNED CAPABILITIES:'}
          </Text>

          {meta.checkpoints.map((item, index) => (
            <View key={index} style={styles.checkpointRow}>
              <CheckCircle2 size={16} color={meta.color} style={styles.checkIcon} />
              <Text style={styles.checkpointText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Back to Home Action Button */}
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <ArrowLeft size={16} color={Colors.primary} />
          <Text style={styles.backBtnText}>{t.backToHome}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleTag: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  iconDome: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  roadmapBox: {
    width: '100%',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  roadmapTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  checkpointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  checkIcon: {
    marginTop: 1,
  },
  checkpointText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
    lineHeight: 17,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    width: '100%',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
