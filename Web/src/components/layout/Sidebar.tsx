import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Map, 
  Layers,
  CalendarClock, 
  UserCheck,
  Flame,
  Gamepad2,
  ShieldAlert, 
  Activity, 
  Settings, 
  LogOut, 
  Cpu,
  Radio
} from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { translations } from '../../i18n/translations';

export type NavTabId = 'dashboard' | 'camera' | 'navigation' | 'slam_studio' | 'scheduler' | 'face_id' | 'fire_matrix' | 'incidents' | 'telemetry' | 'settings' | 'profile';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  lang: Language;
  unresolvedIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  lang,
  unresolvedIncidentsCount
}) => {
  const t = translations[lang];

  const navItems = [
    {
      id: 'dashboard' as NavTabId,
      label: t.navDashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'camera' as NavTabId,
      label: t.navCamera,
      icon: Video,
      badge: '4K AI',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'navigation' as NavTabId,
      label: t.navNavigation,
      icon: Map,
      badge: null
    },
    {
      id: 'scheduler' as NavTabId,
      label: t.navScheduler,
      icon: CalendarClock,
      badge: null
    },
    {
      id: 'face_id' as NavTabId,
      label: t.navFaceId,
      icon: UserCheck,
      badge: '1 NEW',
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'fire_matrix' as NavTabId,
      label: t.navFireHazard,
      icon: Flame,
      badge: '4 SENSORS',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'incidents' as NavTabId,
      label: t.navIncidents,
      icon: ShieldAlert,
      badge: unresolvedIncidentsCount > 0 ? `${unresolvedIncidentsCount}` : null,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'slam_studio' as NavTabId,
      label: t.navSlamStudio,
      icon: Layers,
      badge: 'v1.4',
      badgeColor: 'bg-sky-100 text-sky-700'
    },
    {
      id: 'telemetry' as NavTabId,
      label: t.navTelemetry,
      icon: Activity,
      badge: 'ROS2'
    },
    {
      id: 'settings' as NavTabId,
      label: t.navSettings,
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-[260px] min-w-[260px] max-w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 z-30 select-none">
      {/* 1. Phía trên: Logo Robot + Tên ứng dụng (HSMIBot OS) */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                {t.brandName}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-semibold text-slate-600">
              Autonomous Sentinel
            </p>
          </div>
        </div>
      </div>

      {/* 2. Ở giữa: Menu điều hướng các màn hình chức năng */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {lang === 'vi' ? 'Hệ thống Quản lý' : 'System Navigation'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />
                <span className="truncate whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md shrink-0 ${
                    item.badgeColor ||
                    (isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Live Patrol Mini Status Card inside Sidebar */}
        <div className="pt-4 px-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>{currentUser.robotName}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                DDS
              </span>
            </div>
            <div className="text-[11px] text-slate-600 flex justify-between items-center">
              <span>{lang === 'vi' ? 'ID Thiết bị:' : 'Device ID:'}</span>
              <span className="font-mono text-[10px] font-semibold text-slate-800">
                {currentUser.robotId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dưới đáy Sidebar: Khung tài khoản CHỈ hiển thị Tên người dùng (Avatar + Username) và Nút Đăng xuất (Logout icon/button) nằm ở bên phải tên người dùng (KHÔNG hiện Role) */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className={`flex items-center justify-between p-2 rounded-xl border transition shadow-2xs ${
          currentTab === 'profile'
            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          {/* Avatar + Username only (no Role) - Clickable to open Profile View */}
          <div 
            onClick={() => onSelectTab('profile')}
            className="flex items-center space-x-2.5 min-w-0 pr-2 flex-1 cursor-pointer"
            title={lang === 'vi' ? 'Xem hồ sơ người dùng' : 'View user profile'}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <span
              className={`text-xs font-bold truncate ${currentTab === 'profile' ? 'text-blue-700' : 'text-slate-900'}`}
              title={currentUser.name}
            >
              {currentUser.name}
            </span>
          </div>

          {/* Logout button located on the right side of username */}
          <button
            onClick={onLogout}
            title={t.logout}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
