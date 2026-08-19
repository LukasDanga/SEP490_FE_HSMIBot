import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {
  Play,
  Pause,
  Zap,
  Radio,
  OctagonAlert,
  Bot,
  Radar,
  Thermometer,
  Wind,
  Flame,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Eye,
  LogOut,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Language, UserProfile, RobotTelemetry } from '../../types';
import { translations } from '../../i18n/translations';
import { mockRobotTelemetry } from '../../mock/mockData';

interface HomeDashboardViewProps {
  user: UserProfile;
  lang: Language;
  onLogout: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  user,
  lang,
  onLogout,
}) => {
  const t = translations[lang];

  // Telemetry state
  const [telemetry, setTelemetry] = useState<RobotTelemetry>(mockRobotTelemetry);
  const [activeRoute, setActiveRoute] = useState<string>('living_room');
  const [aiOverlay, setAiOverlay] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Radar Animation
  const [radarAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const showToast = (msg: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Actions
  const handleTogglePatrol = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    setTelemetry((prev) => {
      const nextMode = prev.mode === 'patrol' ? 'idle' : 'patrol';
      showToast(
        nextMode === 'patrol'
          ? lang === 'vi'
            ? 'Đang bắt đầu chu kỳ tuần tra tự hành!'
            : 'Autonomous patrol cycle started!'
          : lang === 'vi'
          ? 'Đã tạm dừng tuần tra.'
          : 'Patrol paused.'
      );
      return {
        ...prev,
        mode: nextMode,
        isDocked: false,
        isCharging: false,
      };
    });
  };

  const handleReturnDock = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setTelemetry((prev) => ({
      ...prev,
      mode: 'docking',
      currentZone: lang === 'vi' ? 'Trạm sạc Docking Station' : 'Docking Station',
    }));
    showToast(
      lang === 'vi'
        ? 'Robot đang tự hành quay về trạm sạc Dock...'
        : 'Robot returning to dock...'
    );

    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        mode: 'charging',
        isDocked: true,
        isCharging: true,
      }));
    }, 2000);
  };

  const handleEmergencyStop = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
    setTelemetry((prev) => ({
      ...prev,
      mode: 'idle',
      speed: 0,
    }));
    showToast(
      lang === 'vi'
        ? '⚠️ ĐÃ KÍCH HOẠT DỪNG KHẨN CẤP!'
        : '⚠️ EMERGENCY STOP TRIGGERED!'
    );
  };

  const handleSelectRoute = (routeId: string, labelVI: string, labelEN: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setActiveRoute(routeId);
    const chosenZone = lang === 'vi' ? labelVI : labelEN;
    setTelemetry((prev) => ({
      ...prev,
      mode: 'patrol',
      currentZone: chosenZone,
    }));
    showToast(
      lang === 'vi'
        ? `Đã chuyển tuyến tuần tra: ${chosenZone}`
        : `Dispatched to: ${chosenZone}`
    );
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

      {/* 1. Homeowner & Robot Header Card */}
      <View style={styles.userCard}>
        <View style={styles.userRow}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.greetingText}>{t.dashGreeting}</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.rolePillRow}>
              <View style={[styles.roleBadge, user.role === 'admin' ? styles.roleAdmin : styles.roleMember]}>
                <Text style={[styles.roleBadgeText, user.role === 'admin' ? styles.roleAdminText : styles.roleMemberText]}>
                  {user.role === 'admin' ? t.roleHomeowner : t.roleMember}
                </Text>
              </View>
              <View style={styles.robotPill}>
                <Bot size={11} color={Colors.primary} />
                <Text style={styles.robotSerialText}>{user.robotId}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. 4 Quick Control & Status Cards (2x2 Grid) */}
      <View style={styles.quickGrid}>
        {/* Card 1: Patrol Action */}
        <View style={styles.quickCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t.patrolStateTitle}</Text>
            <View style={[styles.modeTag, telemetry.mode === 'patrol' ? styles.modeTagBlue : styles.modeTagSlate]}>
              <Text style={[styles.modeTagText, telemetry.mode === 'patrol' ? styles.modeTagTextBlue : styles.modeTagTextSlate]}>
                {telemetry.mode.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.cardBodyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardMainText}>
                {telemetry.mode === 'patrol' ? t.patrolStateAutonomous : t.patrolStateStandby}
              </Text>
              <Text style={styles.cardSubText} numberOfLines={1}>
                📍 {telemetry.currentZone}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleTogglePatrol}
              style={[styles.actionIconButton, telemetry.mode === 'patrol' ? styles.btnAmber : styles.btnBlue]}
              activeOpacity={0.8}
            >
              {telemetry.mode === 'patrol' ? (
                <Pause size={16} color="#FFFFFF" />
              ) : (
                <Play size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Smart Dock */}
        <View style={styles.quickCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t.smartDockTitle}</Text>
            <Zap size={14} color={Colors.warning} />
          </View>
          <View style={styles.cardBodyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardMainText}>
                {telemetry.battery}% ({telemetry.isDocked ? t.dockedStatus : t.undockedStatus})
              </Text>
              <Text style={styles.cardSubText}>
                {telemetry.isCharging ? t.chargingFastLabel : t.batteryEstimatedRuntime}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleReturnDock}
              disabled={telemetry.isDocked}
              style={[styles.smallActionBtn, telemetry.isDocked && { opacity: 0.4 }]}
              activeOpacity={0.8}
            >
              <Text style={styles.smallActionBtnText}>{t.actReturnDock}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 3: ROS2 Edge Telemetry */}
        <View style={styles.quickCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t.ros2EdgeTitle}</Text>
            <Radio size={14} color={Colors.primary} />
          </View>
          <View style={styles.cardBodyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardMainText}>{t.activeNodesLabel}</Text>
              <Text style={styles.cardSubText}>{t.ros2Metrics}</Text>
            </View>
            <View style={styles.slaBadge}>
              <Text style={styles.slaBadgeText}>{t.ros2SlaBadge}</Text>
            </View>
          </View>
        </View>

        {/* Card 4: Emergency Stop */}
        <View style={[styles.quickCard, styles.emergencyCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: Colors.danger }]}>{t.hardwareSafetyTitle}</Text>
            <OctagonAlert size={14} color={Colors.danger} />
          </View>
          <View style={styles.cardBodyRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardMainText, { color: Colors.danger }]}>{t.emergencyBrakeSubtitle}</Text>
              <Text style={[styles.cardSubText, { color: Colors.danger }]}>{lang === 'vi' ? 'Ngắt lực kéo ngay' : 'Instant Torque Cutoff'}</Text>
            </View>
            <TouchableOpacity
              onPress={handleEmergencyStop}
              style={styles.eStopBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.eStopBtnText}>{t.emergencyStopBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. Live 4K Autonomous Patrol Feed Box */}
      <View style={styles.liveVisionCard}>
        <View style={styles.liveVisionHeader}>
          <View style={styles.liveVisionTitleRow}>
            <View style={styles.redPulseDot} />
            <Text style={styles.liveVisionTitle}>{t.liveFeedHeading}</Text>
          </View>
          <View style={styles.fpsBadge}>
            <Text style={styles.fpsBadgeText}>{t.liveFeedBadge}</Text>
          </View>
        </View>

        {/* Live Stream Viewport */}
        <View style={styles.videoViewport}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
            }}
            style={styles.videoImage}
          />

          {/* AI Bounding Box Overlays */}
          {aiOverlay && (
            <>
              {/* Person Detected Box */}
              <View style={styles.personBox}>
                <View style={styles.personTag}>
                  <Text style={styles.boxTagText}>PERSON #1 • 98.6% (VIP)</Text>
                </View>
              </View>

              {/* Pet Detected Box */}
              <View style={styles.petBox}>
                <View style={styles.petTag}>
                  <Text style={styles.boxTagText}>PET • 94.2%</Text>
                </View>
              </View>
            </>
          )}

          {/* OSD Top Bar */}
          <View style={styles.osdTopRow}>
            <View style={styles.osdBadge}>
              <View style={styles.osdRedDot} />
              <Text style={styles.osdText}>REC • 00:42:19</Text>
            </View>
            <View style={styles.osdBadge}>
              <Text style={[styles.osdText, { color: '#34D399', fontWeight: '800' }]}>
                SLAM: X: 4.12 Y: 8.94
              </Text>
            </View>
          </View>

          {/* OSD Bottom Bar */}
          <View style={styles.osdBottomRow}>
            <Text style={styles.osdText}>
              LiDAR: 18,400 pts/s • {telemetry.speed.toFixed(2)} m/s
            </Text>
          </View>
        </View>

        {/* AI Box Toggle & Quick Route Chips */}
        <View style={styles.routeControlsRow}>
          <TouchableOpacity
            onPress={() => setAiOverlay(!aiOverlay)}
            style={[styles.aiToggleBtn, aiOverlay ? styles.aiToggleBtnActive : styles.aiToggleBtnInactive]}
            activeOpacity={0.7}
          >
            <Eye size={12} color={aiOverlay ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.aiToggleText, aiOverlay && styles.aiToggleTextActive]}>
              AI Box: {aiOverlay ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Route Dispatch Chips */}
        <View style={styles.routeChipsRow}>
          <Text style={styles.dispatchLabel}>{t.quickRouteDispatchHeading}</Text>
          <View style={styles.chipsWrap}>
            {[
              { id: 'living_room', vi: t.routeLivingRoom, en: t.routeLivingRoom },
              { id: 'kitchen', vi: t.routeKitchen, en: t.routeKitchen },
              { id: 'perimeter', vi: t.routePerimeter, en: t.routePerimeter },
            ].map((route) => (
              <TouchableOpacity
                key={route.id}
                onPress={() => handleSelectRoute(route.id, route.vi, route.en)}
                style={[
                  styles.routeChip,
                  activeRoute === route.id && styles.routeChipActive,
                ]}
                activeOpacity={0.7}
              >
                <MapPin size={11} color={activeRoute === route.id ? '#FFFFFF' : Colors.textSecondary} />
                <Text
                  style={[
                    styles.routeChipText,
                    activeRoute === route.id && styles.routeChipTextActive,
                  ]}
                >
                  {lang === 'vi' ? route.vi : route.en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 4. LiDAR 360° Radar Mini-View & Environmental Telemetry */}
      <View style={styles.sensorsRow}>
        {/* Left: LiDAR Radar View */}
        <View style={styles.radarCard}>
          <View style={styles.radarHeader}>
            <Radar size={14} color={Colors.primary} />
            <Text style={styles.radarTitle}>{t.lidarRadarHeading}</Text>
          </View>

          {/* Radar Screen */}
          <View style={styles.radarScreen}>
            <View style={[styles.radarCircle, { width: 100, height: 100 }]} />
            <View style={[styles.radarCircle, { width: 66, height: 66 }]} />
            <View style={[styles.radarCircle, { width: 33, height: 33 }]} />
            <View style={styles.radarCrossH} />
            <View style={styles.radarCrossV} />

            {/* Rotating Beam */}
            <Animated.View
              style={[
                styles.radarBeamWrapper,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <LinearGradient
                colors={['rgba(37, 99, 235, 0.45)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.radarBeam}
              />
            </Animated.View>
          </View>
          <Text style={styles.radarRateText}>{t.radarScanRate} • Ouster 360°</Text>
        </View>

        {/* Right: Environmental Sensors */}
        <View style={styles.envSensorsCard}>
          <Text style={styles.envHeading}>{t.envSensorsHeading}</Text>

          <View style={styles.envGrid}>
            <View style={styles.envItem}>
              <Thermometer size={14} color={Colors.warning} />
              <View>
                <Text style={styles.envVal}>28.4°C</Text>
                <Text style={styles.envLabel}>{t.envTemp}</Text>
              </View>
            </View>

            <View style={styles.envItem}>
              <Wind size={14} color={Colors.success} />
              <View>
                <Text style={styles.envVal}>0 ppm</Text>
                <Text style={styles.envLabel}>{t.envSmoke}</Text>
              </View>
            </View>

            <View style={styles.envItem}>
              <Flame size={14} color={Colors.cyan} />
              <View>
                <Text style={styles.envVal}>{t.statusNoFlame}</Text>
                <Text style={styles.envLabel}>{t.envFlame}</Text>
              </View>
            </View>

            <View style={styles.envItem}>
              <Droplets size={14} color={Colors.primary} />
              <View>
                <Text style={styles.envVal}>55% RH</Text>
                <Text style={styles.envLabel}>{t.envHumidity}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 5. Recent Security Incident Log Summary */}
      <View style={styles.incidentSection}>
        <View style={styles.incidentHeader}>
          <Text style={styles.incidentSectionTitle}>{t.recentIncidentsHeading}</Text>
          <Text style={styles.viewAllText}>{t.viewAllIncidents}</Text>
        </View>

        <View style={styles.incidentItem}>
          <View style={[styles.incidentIconBadge, { backgroundColor: Colors.successBg }]}>
            <ShieldCheck size={16} color={Colors.success} />
          </View>
          <View style={styles.incidentBody}>
            <Text style={styles.incidentTitle}>{t.incident1Title}</Text>
            <Text style={styles.incidentDesc}>{t.incident1Desc}</Text>
          </View>
        </View>

        <View style={styles.incidentItem}>
          <View style={[styles.incidentIconBadge, { backgroundColor: Colors.primarySubtle }]}>
            <CheckCircle2 size={16} color={Colors.primary} />
          </View>
          <View style={styles.incidentBody}>
            <Text style={styles.incidentTitle}>{t.incident2Title}</Text>
            <Text style={styles.incidentDesc}>{t.incident2Desc}</Text>
          </View>
        </View>
      </View>

      {/* 6. Sign Out Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
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
    padding: 16,
    paddingBottom: 36,
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
    marginBottom: 14,
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
    marginBottom: 14,
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
    width: 46,
    height: 46,
    borderRadius: 23,
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
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  rolePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  roleAdmin: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  roleAdminText: {
    color: Colors.primary,
  },
  roleMember: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  roleMemberText: {
    color: Colors.success,
  },
  robotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  robotSerialText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  quickCard: {
    flexBasis: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  emergencyCard: {
    backgroundColor: Colors.dangerBg,
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modeTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  modeTagBlue: {
    backgroundColor: Colors.primarySubtle,
  },
  modeTagTextBlue: {
    color: Colors.primary,
  },
  modeTagSlate: {
    backgroundColor: Colors.backgroundElevated,
  },
  modeTagTextSlate: {
    color: Colors.textSecondary,
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardMainText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardSubText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionIconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBlue: {
    backgroundColor: Colors.primary,
  },
  btnAmber: {
    backgroundColor: Colors.warning,
  },
  smallActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallActionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  slaBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  slaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  eStopBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },
  eStopBtnText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  liveVisionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  liveVisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveVisionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  liveVisionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  fpsBadge: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fpsBadgeText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  videoViewport: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    marginBottom: 10,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  personBox: {
    position: 'absolute',
    top: 30,
    left: 40,
    width: 90,
    height: 120,
    borderWidth: 2,
    borderColor: '#34D399',
    borderRadius: 6,
  },
  personTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  petBox: {
    position: 'absolute',
    bottom: 25,
    right: 50,
    width: 70,
    height: 60,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 6,
  },
  petTag: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  boxTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
  },
  osdTopRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  osdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  osdRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  osdText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#FFFFFF',
  },
  osdBottomRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  routeControlsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  aiToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  aiToggleBtnActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  aiToggleBtnInactive: {
    backgroundColor: Colors.backgroundElevated,
    borderColor: Colors.border,
  },
  aiToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  aiToggleTextActive: {
    color: Colors.primary,
  },
  routeChipsRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  dispatchLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  routeChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  routeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sensorsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  radarCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  radarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  radarTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  radarScreen: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F172A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginVertical: 4,
  },
  radarCircle: {
    position: 'absolute',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  radarCrossH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
  },
  radarCrossV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
  },
  radarBeamWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  radarBeam: {
    width: '50%',
    height: '50%',
    borderTopLeftRadius: 50,
  },
  radarRateText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textMuted,
    marginTop: 4,
  },
  envSensorsCard: {
    flex: 1.2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  envHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  envGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  envItem: {
    flexBasis: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundElevated,
    padding: 6,
    borderRadius: 8,
  },
  envVal: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  envLabel: {
    fontSize: 8,
    color: Colors.textSecondary,
  },
  incidentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  incidentSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  incidentIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentBody: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  incidentDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
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
