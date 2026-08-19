import React from 'react';
import { 
  ChevronRight, 
  Battery, 
  BatteryCharging, 
  Zap, 
  Anchor, 
  Radio, 
  Cloud, 
  Bell, 
  Globe2,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { Language, RobotTelemetry } from '../../types';
import { translations } from '../../i18n/translations';
import { NavTabId } from './Sidebar';

interface HeaderProps {
  currentTab: NavTabId;
  telemetry: RobotTelemetry;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  unresolvedIncidentsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  telemetry,
  lang,
  onLanguageChange,
  unresolvedIncidentsCount,
  onOpenNotifications
}) => {
  const t = translations[lang];

  // Get current breadcrumb tab title
  const getTabTitle = (tab: NavTabId) => {
    switch (tab) {
      case 'dashboard':
        return t.navDashboard;
      case 'camera':
        return t.navCamera;
      case 'navigation':
        return t.navNavigation;
      case 'scheduler':
        return t.navScheduler;
      case 'face_id':
        return t.navFaceId;
      case 'fire_matrix':
        return t.navFireHazard;
      case 'incidents':
        return t.navIncidents;
      case 'slam_studio':
        return t.navSlamStudio;
      case 'telemetry':
        return t.navTelemetry;
      case 'settings':
        return t.navSettings;
      case 'profile':
        return t.breadcrumbProfile;
      default:
        return t.navDashboard;
    }
  };

  // Battery color indicator
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (level > 20) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <header className="h-16 min-h-[64px] max-h-[64px] bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* 1. Breadcrumb trang hiện tại */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-slate-600 font-semibold flex items-center space-x-1">
          <Bot className="w-3.5 h-3.5 text-blue-600 mr-1" />
          <span>{t.breadcrumbHome}</span>
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        {currentTab === 'profile' && (
          <>
            <span className="text-slate-600 font-semibold">{t.breadcrumbSettings}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </>
        )}
        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
          {getTabTitle(currentTab)}
        </span>
      </div>

      {/* 2. Thanh trạng thái nhanh của Robot (Pin %, Trạng thái Dock, Kết nối ROS2/Cloud) */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Pin % */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition-colors ${getBatteryColor(
            telemetry.battery
          )}`}
          title={`${t.battery}: ${telemetry.battery}%`}
        >
          {telemetry.isCharging ? (
            <BatteryCharging className="w-4 h-4 animate-pulse text-emerald-600" />
          ) : (
            <Battery className="w-4 h-4" />
          )}
          <span>{telemetry.battery}%</span>
          {telemetry.isCharging && (
            <span className="text-[10px] uppercase font-mono text-emerald-700 font-extrabold">
              {t.charging}
            </span>
          )}
        </div>

        {/* Trạng thái Dock */}
        <div
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
          title={`${t.dockStatus}: ${telemetry.isDocked ? t.docked : t.undocked}`}
        >
          <Anchor className={`w-3.5 h-3.5 ${telemetry.isDocked ? 'text-blue-600' : 'text-amber-500'}`} />
          <span>{telemetry.isDocked ? t.docked : t.undocked}</span>
        </div>

        {/* Kết nối ROS2 / Cloud */}
        <div
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-semibold text-blue-700"
          title={telemetry.ros2Connected ? t.ros2Active : t.ros2Offline}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <Radio className="w-3.5 h-3.5 text-blue-600" />
          <span>{t.ros2Active}</span>
          <span className="text-[10px] font-mono text-blue-500 font-bold">42ms</span>
        </div>

        {/* Cloud Sync Icon */}
        <div
          className="p-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600"
          title={t.cloudSynced}
        >
          <Cloud className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>

      {/* 3. Nút chuyển đổi ngôn ngữ đa ngữ i18n & 4. Icon Chuông thông báo (Notification Bell) */}
      <div className="flex items-center space-x-3">
        {/* Nút chuyển đổi ngôn ngữ i18n (VI 🇻🇳 | EN 🇺🇸) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => onLanguageChange('vi')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
              lang === 'vi'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
              lang === 'en'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🇺🇸</span>
            <span>EN</span>
          </button>
        </div>

        {/* Icon Chuông thông báo (Notification Bell) có badge đếm số sự cố chưa xử lý và mở Drawer thông báo */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-2xs cursor-pointer group"
          title={t.notifications}
        >
          <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
          {unresolvedIncidentsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
              {unresolvedIncidentsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
