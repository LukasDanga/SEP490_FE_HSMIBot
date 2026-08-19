import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Play, 
  Pause, 
  Check, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  MoveUp,
  MoveDown,
  Trash2,
  Edit3,
  GripVertical,
  Camera,
  Flame,
  Activity,
  Maximize2,
  Navigation,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Info,
  Sliders,
  Shield,
  Eye,
  Volume2,
  Radio,
  ArrowRight,
  X,
  Copy
} from 'lucide-react';
import { Language, PatrolSchedule, PatrolWaypointItem } from '../../types';
import { translations } from '../../i18n/translations';

interface PatrolSchedulerViewProps {
  lang: Language;
}

export const PatrolSchedulerView: React.FC<PatrolSchedulerViewProps> = ({ lang }) => {
  const t = translations[lang];

  // Active Patrol State
  const [isPatrolRunning, setIsPatrolRunning] = useState<boolean>(true);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(2); // 3rd point (0-indexed)
  const [activeDwellTimer, setActiveDwellTimer] = useState<number>(14); // seconds left of dwell

  // Route Builder State
  const [selectedRouteName, setSelectedRouteName] = useState<string>(
    lang === 'vi' ? 'Tuần Tra Ban Đêm Sentry (Toàn Bộ Mặt Bằng v2.1)' : 'Night Security Sweep (Full Floorplan v2.1)'
  );

  const [availableRooms, setAvailableRooms] = useState([
    { id: 'living', nameVI: 'Phòng Khách', nameEN: 'Living Room', selected: true },
    { id: 'kitchen', nameVI: 'Khu Bếp & Bàn Ăn', nameEN: 'Kitchen & Dining', selected: true },
    { id: 'entrance', nameVI: 'Cửa Chính Ra Vào', nameEN: 'Main Entrance Door', selected: true },
    { id: 'nursery', nameVI: 'Phòng Trẻ Em (Nursery)', nameEN: 'Nursery Room', selected: true },
    { id: 'balcony', nameVI: 'Ban Công Ngoài', nameEN: 'Outdoor Balcony', selected: false },
    { id: 'master', nameVI: 'Phòng Ngủ Master', nameEN: 'Master Bedroom', selected: false },
  ]);

  const [waypoints, setWaypoints] = useState<PatrolWaypointItem[]>([
    {
      id: 'wp_1',
      nameVI: 'Tâm Phòng Khách',
      nameEN: 'Living Room Center',
      roomVI: 'Phòng Khách',
      roomEN: 'Living Room',
      actionVI: 'Quét 360° Panoramic + Nhận Diện Khuôn Mặt',
      actionEN: '360° Panoramic Scan + Face Check',
      dwellSeconds: 30,
      x: 30,
      y: 28,
      sensors: ['camera', 'lidar', 'ptz'],
      speedLimit: 0.4
    },
    {
      id: 'wp_2',
      nameVI: 'Khu Bếp & Bếp Gas',
      nameEN: 'Kitchen Stove Area',
      roomVI: 'Khu Bếp',
      roomEN: 'Kitchen & Dining',
      actionVI: 'Chẩn Đoán Cảm Biến Nhiệt & Khói MQ-2',
      actionEN: 'Thermal & Smoke Sensor Diagnostic',
      dwellSeconds: 45,
      x: 24,
      y: 75,
      sensors: ['thermal', 'smoke', 'camera'],
      speedLimit: 0.2
    },
    {
      id: 'wp_3',
      nameVI: 'Cửa Chính Ra Vào',
      nameEN: 'Main Entrance Door',
      roomVI: 'Cửa Ra Vào',
      roomEN: 'Main Foyer',
      actionVI: 'Kiểm Tra Cảm Biến Chuyển Động & Chụp Ảnh',
      actionEN: 'Motion Sensor Check & Camera Snapshot',
      dwellSeconds: 15,
      x: 54,
      y: 84,
      sensors: ['motion', 'camera', 'lidar'],
      speedLimit: 0.35
    },
    {
      id: 'wp_4',
      nameVI: 'Phòng Trẻ Em & Cũi',
      nameEN: 'Nursery Room Crib Side',
      roomVI: 'Phòng Trẻ Em',
      roomEN: 'Nursery Room',
      actionVI: 'Chế Độ Yên Lặng & Phát Hiện Âm Thanh Tiếng Khóc',
      actionEN: 'Stealth Noise & Cry Detection Diagnostic',
      dwellSeconds: 25,
      x: 74,
      y: 28,
      sensors: ['camera', 'lidar'],
      speedLimit: 0.25
    }
  ]);

  // Selected Waypoint for inspection
  const [selectedWpId, setSelectedWpId] = useState<string>('wp_3');

  // Schedule Matrix State
  const [schedules, setSchedules] = useState<PatrolSchedule[]>([
    {
      id: 'sch_1',
      nameVI: 'Tuần Tra Ban Đêm Sentry',
      nameEN: 'Night Security Sweep',
      triggerType: 'time',
      triggerDisplayVI: '01:00 AM Hàng Ngày',
      triggerDisplayEN: '01:00 AM Daily',
      time: '01:00 AM',
      frequencyVI: 'Hằng ngày (24/7)',
      frequencyEN: 'Daily (24/7)',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      zonesVI: ['Phòng Khách', 'Bếp', 'Cửa Chính', 'Phòng Trẻ Em'],
      zonesEN: ['Living Room', 'Kitchen', 'Main Door', 'Nursery'],
      routeNameVI: 'Tuyến Vành Đai Toàn Bộ Nhà',
      routeNameEN: 'Full Perimeter Security Loop',
      waypointsCount: 4,
      active: true,
      mode: 'stealth',
      lastRun: '2026-08-16 01:00',
      nextRun: '2026-08-17 01:00'
    },
    {
      id: 'sch_2',
      nameVI: 'Tuần Tra Chế Độ Vắng Nhà (Away Mode)',
      nameEN: 'Away Mode Automated Loop',
      triggerType: 'away_mode',
      triggerDisplayVI: 'Khi Bật Vắng Nhà (Mỗi 2 giờ)',
      triggerDisplayEN: 'On Away Trigger (Every 2h)',
      time: 'Mỗi 2 giờ',
      frequencyVI: 'Tự động khi vắng nhà',
      frequencyEN: 'Away Mode Auto',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      zonesVI: ['Cửa Chính', 'Ban Công', 'Phòng Khách'],
      zonesEN: ['Main Door', 'Balcony', 'Living Room'],
      routeNameVI: 'Tuyến Chống Đột Nhập Nhanh',
      routeNameEN: 'Fast Intrusion Deterrent Path',
      waypointsCount: 3,
      active: true,
      mode: 'deterrent',
      lastRun: '2026-08-16 02:00',
      nextRun: 'Trong 45 phút'
    },
    {
      id: 'sch_3',
      nameVI: 'Kiểm Tra An Toàn Bếp & Cháy Nổ Chiều',
      nameEN: 'Afternoon Kitchen & Hazard Check',
      triggerType: 'time',
      triggerDisplayVI: '03:30 PM (Thứ 7, CN)',
      triggerDisplayEN: '03:30 PM (Sat, Sun)',
      time: '03:30 PM',
      frequencyVI: 'Cuối tuần (T7, CN)',
      frequencyEN: 'Weekends (Sat-Sun)',
      days: ['Sat', 'Sun'],
      zonesVI: ['Khu Bếp', 'Bàn Ăn'],
      zonesEN: ['Kitchen', 'Dining'],
      routeNameVI: 'Tuyến Kiểm Tra Cảm Biến Khói & Gas',
      routeNameEN: 'Thermal & MQ-2 Gas Inspection',
      waypointsCount: 2,
      active: false,
      mode: 'quick',
      lastRun: '2026-08-15 15:30',
      nextRun: '2026-08-22 15:30'
    }
  ]);

  // Modal State for New Schedule
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newScheduleName, setNewScheduleName] = useState<string>('');
  const [newTriggerType, setNewTriggerType] = useState<'time' | 'away_mode' | 'recurring'>('time');
  const [newTime, setNewTime] = useState<string>('23:00');
  const [newFrequency, setNewFrequency] = useState<string>('daily');
  const [newMode, setNewMode] = useState<'stealth' | 'deterrent' | 'quick'>('stealth');

  // Modal State for Add Waypoint
  const [isAddWpModalOpen, setIsAddWpModalOpen] = useState<boolean>(false);
  const [newWpRoom, setNewWpRoom] = useState<string>('living');
  const [newWpAction, setNewWpAction] = useState<string>('scan_face');
  const [newWpDwell, setNewWpDwell] = useState<number>(30);

  // Toggle Schedule Status
  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Reorder Waypoints
  const moveWaypoint = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...waypoints];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      setWaypoints(updated);
    } else if (direction === 'down' && index < waypoints.length - 1) {
      const updated = [...waypoints];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      setWaypoints(updated);
    }
  };

  // Delete Waypoint
  const deleteWaypoint = (id: string) => {
    if (waypoints.length <= 1) {
      alert(lang === 'vi' ? 'Tuyến đường cần ít nhất 1 điểm kiểm soát!' : 'A patrol route needs at least 1 waypoint!');
      return;
    }
    setWaypoints(prev => prev.filter(wp => wp.id !== id));
  };

  // Toggle Target Room
  const toggleRoom = (id: string) => {
    setAvailableRooms(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  // Save New Schedule
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleName.trim()) return;

    const newSch: PatrolSchedule = {
      id: `sch_${Date.now()}`,
      nameVI: newScheduleName,
      nameEN: newScheduleName,
      triggerType: newTriggerType,
      triggerDisplayVI: newTriggerType === 'away_mode' ? 'Khi Bật Vắng Nhà' : `${newTime} Hằng ngày`,
      triggerDisplayEN: newTriggerType === 'away_mode' ? 'On Away Mode Trigger' : `${newTime} Daily`,
      time: newTriggerType === 'away_mode' ? 'Away Mode' : newTime,
      frequencyVI: newFrequency === 'daily' ? 'Hằng ngày (24/7)' : 'Thứ 2 - Thứ 6',
      frequencyEN: newFrequency === 'daily' ? 'Daily (24/7)' : 'Mon - Fri',
      days: newFrequency === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      zonesVI: ['Phòng Khách', 'Khu Bếp', 'Cửa Chính'],
      zonesEN: ['Living Room', 'Kitchen', 'Main Door'],
      routeNameVI: selectedRouteName,
      routeNameEN: selectedRouteName,
      waypointsCount: waypoints.length,
      active: true,
      mode: newMode,
      nextRun: '2026-08-16 23:00'
    };

    setSchedules(prev => [newSch, ...prev]);
    setIsModalOpen(false);
    setNewScheduleName('');
  };

  // Handle Add Waypoint
  const handleAddWaypoint = () => {
    const roomObj = availableRooms.find(r => r.id === newWpRoom) || availableRooms[0];
    const newWp: PatrolWaypointItem = {
      id: `wp_${Date.now()}`,
      nameVI: `${roomObj.nameVI} - Điểm Kiểm Tra Mới`,
      nameEN: `${roomObj.nameEN} - Inspection Point`,
      roomVI: roomObj.nameVI,
      roomEN: roomObj.nameEN,
      actionVI: newWpAction === 'scan_face' ? t.actionScanFace : newWpAction === 'thermal' ? t.actionThermalSmoke : t.actionMotionCamera,
      actionEN: newWpAction === 'scan_face' ? '360° Panoramic Scan + Face Check' : newWpAction === 'thermal' ? 'Thermal & Smoke Sensor Diagnostic' : 'Motion Sensor Check & Camera Snapshot',
      dwellSeconds: newWpDwell,
      x: 45 + Math.floor(Math.random() * 25),
      y: 45 + Math.floor(Math.random() * 25),
      sensors: newWpAction === 'scan_face' ? ['camera', 'lidar', 'ptz'] : newWpAction === 'thermal' ? ['thermal', 'smoke'] : ['motion', 'camera'],
      speedLimit: 0.3
    };

    setWaypoints(prev => [...prev, newWp]);
    setIsAddWpModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* 1. ACTIVE PATROL STATUS CARD (TOP BANNER) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Subtle background radar pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-sky-600 to-transparent pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          
          {/* Top Row: Status Badges and Quick Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-400 shadow-inner">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-black text-sky-300 uppercase tracking-widest bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/80">
                    {lang === 'vi' ? 'NHIỆM VỤ TUẦN TRA ĐANG CHẠY' : 'LIVE PATROL IN PROGRESS'}
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <h2 className="text-lg font-black text-white tracking-tight mt-0.5">
                  {t.currentPlanName}
                </h2>
              </div>
            </div>

            {/* Next Scheduled Patrol Countdown Tag */}
            <div className="flex items-center space-x-3">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    {t.nextPatrolCountdownLabel}
                  </div>
                  <div className="text-xs font-black text-amber-300">
                    {t.nextPatrolCountdown}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPatrolRunning(!isPatrolRunning)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                    isPatrolRunning
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isPatrolRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPatrolRunning ? (lang === 'vi' ? 'Tạm dừng' : 'Pause Patrol') : (lang === 'vi' ? 'Tiếp tục' : 'Resume')}</span>
                </button>

                <button
                  onClick={() => alert(lang === 'vi' ? 'Lệnh Robot quay về Trạm sạc (Dock)!' : 'Returning robot to docking station!')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'vi' ? 'Về Dock' : 'Return to Dock'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Progress Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-400">{t.patrolProgress}:</span>
                <span className="font-bold text-emerald-400">
                  {lang === 'vi' ? '3/5 Điểm kiểm soát đã hoàn thành (60%)' : '3/5 Waypoints reached (60%)'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 text-xs font-mono">
                <span>{t.dwellTimeLabel}:</span>
                <span className="text-sky-300 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {activeDwellTimer}s / 30s remaining
                </span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full bg-slate-950/80 rounded-full h-3 p-0.5 border border-slate-700/80 flex gap-1">
              <div className="h-full rounded-full bg-emerald-500 flex-1 shadow-[0_0_8px_#10b981]"></div>
              <div className="h-full rounded-full bg-emerald-500 flex-1 shadow-[0_0_8px_#10b981]"></div>
              <div className="h-full rounded-full bg-sky-500 animate-pulse flex-1 shadow-[0_0_8px_#0ea5e9]"></div>
              <div className="h-full rounded-full bg-slate-800 flex-1"></div>
              <div className="h-full rounded-full bg-slate-800 flex-1"></div>
            </div>
          </div>

          {/* Sequential Waypoints Stepper Pill Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-1">
            
            {/* Step 1 */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-emerald-300 truncate">
                  1. {lang === 'vi' ? 'Phòng Khách' : 'Living Room'}
                </div>
                <div className="text-[9px] text-emerald-400/80 font-mono">Quét Xong (360° Scan)</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-emerald-300 truncate">
                  2. {lang === 'vi' ? 'Khu Bếp & Gas' : 'Kitchen Stove'}
                </div>
                <div className="text-[9px] text-emerald-400/80 font-mono">Nhiệt độ Bình Thường</div>
              </div>
            </div>

            {/* Step 3 (Active) */}
            <div className="bg-sky-950/70 border-2 border-sky-400 rounded-xl p-2.5 flex items-center space-x-2.5 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
              <div className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 animate-pulse">
                3
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-sky-200 truncate">
                  3. {lang === 'vi' ? 'Cửa Chính Foyer' : 'Main Entrance'}
                </div>
                <div className="text-[9px] text-sky-300 font-mono flex items-center space-x-1">
                  <Activity className="w-2.5 h-2.5 animate-spin" />
                  <span>Đang Kiểm Tra PIR...</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5 flex items-center space-x-2.5 opacity-60">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-300 truncate">
                  4. {lang === 'vi' ? 'Phòng Trẻ Em' : 'Nursery Room'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Chờ (Pending)</div>
              </div>
            </div>

            {/* Step 5 - Dock */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5 flex items-center space-x-2.5 opacity-60">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                🏁
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-300 truncate">
                  5. {lang === 'vi' ? 'Trạm Sạc Home' : 'Docking Station'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Cập Bến & Sạc</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. PATROL ROUTE BUILDER (SPLIT VIEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDE: ROUTE & WAYPOINT SEQUENCE EDITOR (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {t.routeBuilderTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.routeSequenceSub}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold rounded-lg">
                {waypoints.length} {lang === 'vi' ? 'Điểm Kiểm Soát' : 'Waypoints'}
              </span>
            </div>

            {/* Route Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.routeNameLabel}
              </label>
              <input
                type="text"
                value={selectedRouteName}
                onChange={(e) => setSelectedRouteName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Target Rooms Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.targetRoomsChecklist}</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {availableRooms.filter(r => r.selected).length}/{availableRooms.length} {lang === 'vi' ? 'đã chọn' : 'selected'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableRooms.map((room) => {
                  const roomName = lang === 'vi' ? room.nameVI : room.nameEN;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => toggleRoom(room.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                        room.selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${room.selected ? 'bg-white' : 'bg-slate-300'}`}></span>
                      <span>{roomName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ordered Waypoint List (Reorderable) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t.waypointSequenceList}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsAddWpModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnAddWaypoint}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {waypoints.map((wp, index) => {
                  const wpName = lang === 'vi' ? wp.nameVI : wp.nameEN;
                  const actionName = lang === 'vi' ? wp.actionVI : wp.actionEN;
                  const isSelected = selectedWpId === wp.id;

                  return (
                    <div
                      key={wp.id}
                      onClick={() => setSelectedWpId(wp.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {/* Left Badge & Info */}
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="flex flex-col items-center space-y-1 shrink-0 pt-0.5">
                          <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
                            {index + 1}
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold">
                            P{index + 1}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {wpName}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono font-bold">
                              {wp.dwellSeconds}s {t.dwellTimeLabel}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center space-x-1.5">
                            <span className="text-blue-600 font-semibold">⚡ {actionName}</span>
                          </div>

                          {/* Sensor Badges */}
                          <div className="flex items-center space-x-1.5 mt-2 flex-wrap">
                            {wp.sensors.map((sensor, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white text-slate-700 border border-slate-200 flex items-center space-x-1"
                              >
                                {sensor === 'camera' && <Camera className="w-2.5 h-2.5 text-blue-500" />}
                                {sensor === 'thermal' && <Flame className="w-2.5 h-2.5 text-rose-500" />}
                                {sensor === 'smoke' && <AlertCircle className="w-2.5 h-2.5 text-amber-500" />}
                                {sensor === 'motion' && <Activity className="w-2.5 h-2.5 text-emerald-500" />}
                                {sensor === 'ptz' && <Eye className="w-2.5 h-2.5 text-purple-500" />}
                                <span className="uppercase">{sensor}</span>
                              </span>
                            ))}
                            {wp.speedLimit && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {wp.speedLimit} m/s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Handles: Reorder & Delete */}
                      <div className="flex items-center space-x-1 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWaypoint(index, 'up');
                          }}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWaypoint(index, 'down');
                          }}
                          disabled={index === waypoints.length - 1}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWaypoint(wp.id);
                          }}
                          title="Delete Waypoint"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Save Route Preset Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-mono">
              Total Route Est.: <strong className="text-slate-900 font-bold">38.4m (~4 min 20s)</strong>
            </div>

            <button
              type="button"
              onClick={() => alert(lang === 'vi' ? 'Đã lưu cấu hình tuyến đường tuần tra!' : 'Patrol route sequence saved successfully!')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'vi' ? 'Lưu Tuyến Đường' : 'Save Route Preset'}</span>
            </button>
          </div>

        </div>

        {/* RIGHT SIDE: MINI 2D MAP PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0B1120] rounded-2xl border border-slate-800 p-5 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 z-10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {t.miniMapTitle}
                </h4>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {t.miniMapSub}
              </p>
            </div>

            <span className="px-2 py-0.5 bg-slate-800 text-sky-400 border border-slate-700 rounded text-[10px] font-mono font-bold">
              Scale 1:50
            </span>
          </div>

          {/* Mini 2D Canvas Area */}
          <div className="my-4 relative w-full aspect-4/3 bg-[#070B14] rounded-xl border border-slate-800/90 overflow-hidden select-none flex items-center justify-center">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* SVG Floorplan Walls & Path */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Outer Perimeter */}
              <rect x="8%" y="10%" width="84%" height="80%" fill="none" stroke="#334155" strokeWidth="3" rx="8" />
              
              {/* Internal Partitions */}
              <line x1="50%" y1="10%" x2="50%" y2="52%" stroke="#334155" strokeWidth="2.5" />
              <line x1="8%" y1="52%" x2="38%" y2="52%" stroke="#334155" strokeWidth="2.5" />
              <line x1="70%" y1="52%" x2="92%" y2="52%" stroke="#334155" strokeWidth="2.5" />
              <line x1="70%" y1="52%" x2="70%" y2="90%" stroke="#334155" strokeWidth="2.5" />

              {/* Room Text Indicators */}
              <text x="28%" y="22%" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">LIVING ROOM</text>
              <text x="74%" y="22%" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">NURSERY</text>
              <text x="24%" y="65%" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">KITCHEN</text>
              <text x="81%" y="70%" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">BATHROOM</text>

              {/* Dashed Ordered Patrol Trajectory: Dock -> P1 -> P2 -> P3 -> P4 -> Dock */}
              <defs>
                <linearGradient id="patrolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>

              {/* Path Lines */}
              <polyline
                points="22%,82% 30%,28% 24%,75% 54%,84% 74%,28% 22%,82%"
                fill="none"
                stroke="url(#patrolGrad)"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                strokeLinecap="round"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>

            {/* Sequential Waypoint Number Badges on Canvas */}
            {waypoints.map((wp, index) => {
              const isCurrent = currentWaypointIndex === index;
              const isSelected = selectedWpId === wp.id;

              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedWpId(wp.id)}
                  style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Pulse for current active waypoint */}
                  {isCurrent && (
                    <div className="w-9 h-9 -top-1.5 -left-1.5 rounded-full border border-sky-400 bg-sky-400/20 absolute animate-ping"></div>
                  )}

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-mono shadow-lg border-2 ${
                    isCurrent
                      ? 'bg-sky-400 border-white text-slate-950 shadow-[0_0_12px_#38bdf8]'
                      : isSelected
                        ? 'bg-blue-600 border-white text-white shadow-[0_0_10px_#2563eb]'
                        : 'bg-slate-900 border-blue-400 text-blue-300'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 border border-slate-700 text-white text-[9px] font-mono px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-lg z-40">
                    P{index + 1}: {lang === 'vi' ? wp.nameVI : wp.nameEN}
                  </div>
                </div>
              );
            })}

            {/* DOCKING STATION BADGE */}
            <div
              style={{ left: '22%', top: '82%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-15"
              title="Home Base Dock-01"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-300 text-[10px] font-bold shadow-[0_0_10px_#10b981]">
                ⚡
              </div>
              <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[8px] font-mono text-emerald-400 whitespace-nowrap font-bold">
                Dock
              </span>
            </div>

            {/* LIVE ROBOT POSITION (Active at Waypoint 3) */}
            <div
              style={{ left: '54%', top: '84%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none"
            >
              <div className="w-10 h-10 rounded-full border border-sky-400/50 bg-sky-400/10 -top-1.5 -left-1.5 absolute animate-pulse"></div>
              <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
                🤖
              </div>
              <div className="absolute top-7 left-1/2 -translate-x-1/2 text-[8px] font-mono bg-blue-950/90 text-sky-300 px-1.5 py-0.5 rounded border border-blue-700 whitespace-nowrap font-bold">
                Robot Active
              </div>
            </div>

          </div>

          {/* Mini 2D Footer Stats */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-sky-400 font-bold">Sequence:</span>
              <span>1 → 2 → 3 → 4 → Dock</span>
            </div>
            <div className="text-emerald-400 font-bold">
              4 Waypoints • 38.4m Loop
            </div>
          </div>

        </div>

      </div>

      {/* 3. SCHEDULE MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t.scheduleMatrixTitle}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t.patrolSchedulerSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnCreateSchedule}</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-5">{t.thScheduleName}</th>
                <th className="py-3.5 px-4">{t.thTrigger}</th>
                <th className="py-3.5 px-4">{t.thFrequency}</th>
                <th className="py-3.5 px-4">{t.thRoute}</th>
                <th className="py-3.5 px-4">{t.thStatus}</th>
                <th className="py-3.5 px-5 text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {schedules.map((sch) => {
                const name = lang === 'vi' ? sch.nameVI : sch.nameEN;
                const triggerDisplay = lang === 'vi' ? sch.triggerDisplayVI : sch.triggerDisplayEN;
                const frequency = lang === 'vi' ? sch.frequencyVI : sch.frequencyEN;
                const routeName = lang === 'vi' ? sch.routeNameVI : sch.routeNameEN;
                const zones = lang === 'vi' ? sch.zonesVI : sch.zonesEN;

                return (
                  <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Schedule Name & Security Mode */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          sch.mode === 'stealth'
                            ? 'bg-purple-100 text-purple-700'
                            : sch.mode === 'deterrent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                        }`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Mode: <span className="uppercase font-bold text-slate-600">{sch.mode}</span> • Next: {sch.nextRun}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Trigger (Time / Away Mode) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-bold text-slate-800 font-mono text-xs">
                          {triggerDisplay}
                        </span>
                      </div>
                    </td>

                    {/* Frequency & Days */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {frequency}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {sch.days.slice(0, 5).map((d, i) => (
                            <span key={i} className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {d}
                            </span>
                          ))}
                          {sch.days.length > 5 && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                              +{sch.days.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Waypoint Route & Target Rooms */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                          <Navigation className="w-3 h-3 text-purple-600" />
                          <span>{routeName}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {zones.map((z, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                              {z}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => toggleSchedule(sch.id)}
                        className="flex items-center space-x-1.5 cursor-pointer"
                      >
                        {sch.active ? (
                          <>
                            <ToggleRight className="w-7 h-7 text-emerald-600" />
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-7 h-7 text-slate-400" />
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Inactive
                            </span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Run Now, Edit, Delete */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => alert(lang === 'vi' ? `Đang kích hoạt khẩn cấp nhiệm vụ: ${name}` : `Dispatched mission now: ${name}`)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>{t.btnRunNow}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(lang === 'vi' ? `Chỉnh sửa lịch trình: ${name}` : `Editing schedule: ${name}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title={t.btnEdit}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(lang === 'vi' ? `Xóa lịch trình ${name}?` : `Delete schedule ${name}?`)) {
                              setSchedules(prev => prev.filter(s => s.id !== sch.id));
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title={t.btnDelete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL 1: CREATE NEW PATROL SCHEDULE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.scheduleModalTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {t.scheduleModalDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              
              {/* Schedule Name */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Tên Lịch Trình Tuần Tra' : 'Schedule Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'vi' ? 'VD: Tuần Tra Khuya 23:00' : 'e.g., Midnight Living Room Check'}
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Trigger Type Selection */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Loại Kích Hoạt (Trigger Type)' : 'Trigger Mechanism'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTriggerType('time')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      newTriggerType === 'time'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ⏰ {t.triggerTime}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTriggerType('away_mode')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      newTriggerType === 'away_mode'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🚶 {t.triggerAway}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTriggerType('recurring')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      newTriggerType === 'recurring'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔄 {t.triggerRecurring}
                  </button>
                </div>
              </div>

              {/* Time Input if time trigger */}
              {newTriggerType === 'time' && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    {lang === 'vi' ? 'Giờ Kích Hoạt (Time)' : 'Execution Time'}
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Frequency */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Tần Suất Lặp Lại' : 'Recurrence Frequency'}
                </label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">{t.freqDaily}</option>
                  <option value="weekdays">{t.freqWeekdays}</option>
                  <option value="weekends">{t.freqWeekends}</option>
                </select>
              </div>

              {/* Security Mode */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Chế Độ An Ninh (Security Mode)' : 'Patrol Behavioral Mode'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMode('stealth')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                      newMode === 'stealth'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🤫 Stealth Mode
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMode('deterrent')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                      newMode === 'deterrent'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🚨 Deterrent
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMode('quick')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                      newMode === 'quick'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ⚡ Quick Sweep
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.saveSchedule}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD WAYPOINT */}
      {isAddWpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.btnAddWaypoint}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddWpModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Target Room */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Chọn Phòng Mục Tiêu' : 'Select Target Room'}
                </label>
                <select
                  value={newWpRoom}
                  onChange={(e) => setNewWpRoom(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {lang === 'vi' ? r.nameVI : r.nameEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {lang === 'vi' ? 'Hành Động Cảm Biến Tại Điểm' : 'Sensor & Diagnostic Action'}
                </label>
                <select
                  value={newWpAction}
                  onChange={(e) => setNewWpAction(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scan_face">{t.actionScanFace}</option>
                  <option value="thermal">{t.actionThermalSmoke}</option>
                  <option value="motion">{t.actionMotionCamera}</option>
                  <option value="door">{t.actionDoorLockCheck}</option>
                </select>
              </div>

              {/* Dwell Time Slider */}
              <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{t.dwellTimeLabel}</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {newWpDwell} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={newWpDwell}
                  onChange={(e) => setNewWpDwell(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddWpModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleAddWaypoint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Thêm Vào Tuyến Đường' : 'Append Waypoint'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
