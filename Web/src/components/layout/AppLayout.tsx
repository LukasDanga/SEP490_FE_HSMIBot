import React, { useState } from 'react';
import { Language, UserProfile, RobotTelemetry, SecurityIncident } from '../../types';
import { Sidebar, NavTabId } from './Sidebar';
import { Header } from './Header';
import { NotificationsDrawer } from './NotificationsDrawer';
import { DashboardView } from '../views/DashboardView';
import { NavigationMapView } from '../views/NavigationMapView';
import { SlamStudioView } from '../views/SlamStudioView';
import { PatrolSchedulerView } from '../views/PatrolSchedulerView';
import { FaceRecognitionView } from '../views/FaceRecognitionView';
import { FireMatrixView } from '../views/FireMatrixView';
import { LiveTeleopVoiceView } from '../views/LiveTeleopVoiceView';
import { IncidentsView } from '../views/IncidentsView';
import { TelemetryView } from '../views/TelemetryView';
import { SettingsView } from '../views/SettingsView';
import { UserProfileView } from '../views/UserProfileView';

interface AppLayoutProps {
  currentUser: UserProfile;
  onLogout: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentUser,
  onLogout,
  lang,
  onLanguageChange
}) => {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTabId>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active user profile state with local update ability
  const [user, setUser] = useState<UserProfile>(currentUser);

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updated };
      localStorage.setItem('hsmibot_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  // Robot live telemetry state
  const [telemetry, setTelemetry] = useState<RobotTelemetry>({
    battery: 88,
    isCharging: false,
    isDocked: false,
    ros2Connected: true,
    cloudSync: true,
    mode: 'patrol',
    currentZone: lang === 'vi' ? 'Phòng Khách Khu A' : 'Living Room Zone A',
    speed: 0.35,
    fps: 30,
    lidarPoints: 18400,
    temperature: 34.2,
    signalStrength: 96,
    cpuUsage: 28,
    ramUsage: 45,
    activeNodeCount: 16,
    odometryDistance: 42.84
  });

  // Security Incidents state
  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: 'inc_1',
      severity: 'danger',
      titleVI: 'Phát hiện Chuyển động Lạ tại Cửa Ban Công',
      titleEN: 'Unauthorized Motion Detected at Balcony Door',
      descVI: 'AI phát hiện hình thể người lạ đứng gần cửa sổ ban công lúc 02:14 sáng vượt ngưỡng cảnh báo.',
      descEN: 'Neural vision identified unknown humanoid figure lingering near balcony door at 02:14 AM.',
      timestamp: '10 mins ago',
      zoneVI: 'Ban Công Tầng 1',
      zoneEN: 'Balcony 1st Floor',
      snapshotType: 'person',
      resolved: false
    },
    {
      id: 'inc_2',
      severity: 'warning',
      titleVI: 'Cảnh Báo Nhiệt Độ Cục Bộ Khu Vực Bếp',
      titleEN: 'Thermal Anomaly Detected in Kitchen Zone',
      descVI: 'Cảm biến hồng ngoại ghi nhận nhiệt độ tăng đột biến 48°C gần bếp nấu trong khi không có người.',
      descEN: 'Infrared sensor flagged sudden 48°C heat plume near cooktop while zone is vacant.',
      timestamp: '25 mins ago',
      zoneVI: 'Khu Vực Bếp Ăn',
      zoneEN: 'Kitchen Cooking Island',
      snapshotType: 'fire',
      resolved: false
    },
    {
      id: 'inc_3',
      severity: 'warning',
      titleVI: 'Cửa Chính Chưa Đóng Hoàn Toàn',
      titleEN: 'Front Entrance Door Ajar / Unlatched',
      descVI: 'Cảm biến từ trường và camera xác nhận chốt khóa cửa chính chưa được gài sau 5 phút.',
      descEN: 'Magnetic contact & SLAM camera confirm main foyer door is unlatched for over 5 minutes.',
      timestamp: '1 hour ago',
      zoneVI: 'Sảnh Đón Chính',
      zoneEN: 'Main Entrance Foyer',
      snapshotType: 'door',
      resolved: false
    },
    {
      id: 'inc_4',
      severity: 'safe',
      titleVI: 'Thú Cưng Di Chuyển Bình Thường',
      titleEN: 'Pet Activity Verified Safe',
      descVI: 'Nhận diện chó Golden Retriever di chuyển trong phòng khách, trạng thái bình thường.',
      descEN: 'Golden Retriever roaming in living room, classified as safe domestic activity.',
      timestamp: '3 hours ago',
      zoneVI: 'Phòng Khách',
      zoneEN: 'Living Room',
      snapshotType: 'pet',
      resolved: true
    }
  ]);

  const unresolvedCount = incidents.filter(i => !i.resolved).length;

  const handleResolveIncident = (id: string) => {
    setIncidents(prev => prev.map(item => item.id === id ? { ...item, resolved: true } : item));
  };

  const handleDispatchRobot = (incident: SecurityIncident) => {
    setTelemetry(prev => ({
      ...prev,
      mode: 'patrol',
      currentZone: lang === 'vi' ? incident.zoneVI : incident.zoneEN,
      isDocked: false,
      isCharging: false
    }));
    setCurrentTab('dashboard');
    setIsDrawerOpen(false);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            lang={lang}
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            onOpenIncident={handleDispatchRobot}
          />
        );
      case 'camera':
        return <LiveTeleopVoiceView lang={lang} />;
      case 'navigation':
        return <NavigationMapView lang={lang} />;
      case 'slam_studio':
        return <SlamStudioView lang={lang} />;
      case 'scheduler':
        return <PatrolSchedulerView lang={lang} />;
      case 'face_id':
        return <FaceRecognitionView lang={lang} />;
      case 'fire_matrix':
        return <FireMatrixView lang={lang} />;
      case 'incidents':
        return (
          <IncidentsView
            lang={lang}
            incidents={incidents}
            onResolveIncident={handleResolveIncident}
            onDispatchRobot={handleDispatchRobot}
          />
        );
      case 'telemetry':
        return <TelemetryView lang={lang} telemetry={telemetry} />;
      case 'settings':
        return <SettingsView lang={lang} onOpenProfile={() => setCurrentTab('profile')} />;
      case 'profile':
        return (
          <UserProfileView
            lang={lang}
            currentUser={user}
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return (
          <DashboardView
            lang={lang}
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            onOpenIncident={handleDispatchRobot}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* 1. Navbar cố định bên trái (Left Sidebar - W: 260px) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={user}
        onLogout={onLogout}
        lang={lang}
        unresolvedIncidentsCount={unresolvedCount}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 2. Header cố định phía trên (Top Header - H: 64px) */}
        <Header
          currentTab={currentTab}
          telemetry={telemetry}
          lang={lang}
          onLanguageChange={onLanguageChange}
          unresolvedIncidentsCount={unresolvedCount}
          onOpenNotifications={() => setIsDrawerOpen(true)}
        />

        {/* 3. View Viewport Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {renderActiveView()}
        </main>
      </div>

      {/* 4. Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        incidents={incidents}
        onResolveIncident={handleResolveIncident}
        onDispatchRobot={handleDispatchRobot}
        lang={lang}
      />
    </div>
  );
};
