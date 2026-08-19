import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  ShieldCheck,
  Bot,
  BatteryCharging,
  Wifi,
  Thermometer,
  Radio,
  Video,
  Play,
  Home,
  OctagonAlert,
  LogOut,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';

interface QuickDashboardProps {
  user: UserProfile;
  lang: Language;
  onLogout: () => void;
}

export const QuickDashboard: React.FC<QuickDashboardProps> = ({ user, lang, onLogout }) => {
  const t = translations[lang];
  const [patrolling, setPatrolling] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTogglePatrol = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    setPatrolling(!patrolling);
    setToastMsg(
      !patrolling
        ? lang === 'vi'
          ? 'Đã bắt đầu chu kỳ tuần tra tự hành!'
          : 'Autonomous patrol cycle started!'
        : lang === 'vi'
        ? 'Đã tạm dừng tuần tra.'
        : 'Patrol paused.'
    );
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleLogout = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    onLogout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Toast Alert */}
      {toastMsg && (
        <View style={styles.toastCard}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Homeowner Profile Header Card */}
      <View style={styles.userCard}>
        <View style={styles.userRow}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.greetingText}>{t.dashGreeting}</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.robotPill}>
              <Bot size={12} color={Colors.primary} />
              <Text style={styles.robotSerialText}>{user.robotId}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Robot Status Hero Banner */}
      <View style={styles.robotHeroBanner}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTitleRow}>
            <View style={styles.robotIconDome}>
              <Bot size={22} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.robotHeroName}>{user.robotName || t.dashRobotTitle}</Text>
              <Text style={styles.robotHeroStatus}>{t.dashStatusOnDuty}</Text>
            </View>
          </View>

          <View style={styles.onlineBadge}>
            <View style={styles.greenPulse} />
            <Text style={styles.onlineText}>{t.dashOnline}</Text>
          </View>
        </View>

        {/* Current Active Mode */}
        <View style={styles.modeSection}>
          <Text style={styles.modeLabel}>{t.dashMode}</Text>
          <View style={styles.modeValueRow}>
            <Radio size={14} color={Colors.primary} />
            <Text style={styles.modeValueText}>{t.dashModePatrol}</Text>
          </View>
        </View>

        {/* Telemetry Matrix Grid */}
        <View style={styles.telemetryGrid}>
          {/* Battery */}
          <View style={styles.telemItem}>
            <BatteryCharging size={16} color={Colors.success} />
            <Text style={styles.telemVal}>88%</Text>
            <Text style={styles.telemLabel}>{t.dashBattery}</Text>
          </View>

          {/* Temperature */}
          <View style={styles.telemItem}>
            <Thermometer size={16} color={Colors.warning} />
            <Text style={styles.telemVal}>28.4°C</Text>
            <Text style={styles.telemLabel}>{t.dashTemp}</Text>
          </View>

          {/* Signal */}
          <View style={styles.telemItem}>
            <Wifi size={16} color={Colors.primary} />
            <Text style={styles.telemVal}>-42 dBm</Text>
            <Text style={styles.telemLabel}>{t.dashSignal}</Text>
          </View>

          {/* ROS2 */}
          <View style={styles.telemItem}>
            <ShieldCheck size={16} color={Colors.primary} />
            <Text style={styles.telemVal}>Active</Text>
            <Text style={styles.telemLabel}>{t.dashRos2}</Text>
          </View>
        </View>
      </View>

      {/* Quick Controls Section */}
      <Text style={styles.sectionHeading}>{t.quickActions}</Text>

      <View style={styles.actionsGrid}>
        {/* Live Camera Stream */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            handleAction(
              lang === 'vi' ? 'Đang mở luồng video WebRTC 1080p...' : 'Opening WebRTC 1080p stream...'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: Colors.primarySubtle }]}>
            <Video size={20} color={Colors.primary} />
          </View>
          <Text style={styles.actionTitle}>{t.actLiveCam}</Text>
          <Text style={styles.actionDesc}>WebRTC 30fps</Text>
        </TouchableOpacity>

        {/* Patrol Toggle */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleTogglePatrol}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: Colors.successBg }]}>
            <Play size={20} color={Colors.success} />
          </View>
          <Text style={styles.actionTitle}>{patrolling ? t.actPatrol : t.actPatrol}</Text>
          <Text style={styles.actionDesc}>{patrolling ? 'Running' : 'Paused'}</Text>
        </TouchableOpacity>

        {/* Return to Dock */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            handleAction(
              lang === 'vi' ? 'Robot đang tự hành quay về trạm sạc...' : 'Robot returning to home dock...'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: Colors.cyanSubtle }]}>
            <Home size={20} color={Colors.cyan} />
          </View>
          <Text style={styles.actionTitle}>{t.actReturnDock}</Text>
          <Text style={styles.actionDesc}>Dock Base A</Text>
        </TouchableOpacity>

        {/* Emergency Stop */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            handleAction(
              lang === 'vi' ? '⚠️ Đã kích hoạt DỪNG KHẨN CẤP!' : '⚠️ EMERGENCY STOP TRIGGERED!'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: Colors.dangerBg }]}>
            <OctagonAlert size={20} color={Colors.danger} />
          </View>
          <Text style={[styles.actionTitle, { color: Colors.danger }]}>{t.actEmergency}</Text>
          <Text style={styles.actionDesc}>Immediate Halt</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={16} color={Colors.danger} />
        <Text style={styles.logoutBtnText}>{t.btnLogout}</Text>
      </TouchableOpacity>
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
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  robotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  robotSerialText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.primary,
    fontWeight: '700',
  },
  robotHeroBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  robotIconDome: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotHeroName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  robotHeroStatus: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  modeSection: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  modeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  telemItem: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  telemVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  telemLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flexBasis: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dangerBg,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.danger,
  },
});
