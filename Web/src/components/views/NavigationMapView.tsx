import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers,
  Bot,
  Radio,
  Power,
  Crosshair,
  Gauge,
  Thermometer,
  Ruler,
  Plus,
  Minus,
  Zap,
  Wrench,
  Shield,
  Coffee,
  Route,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Home,
  Bed,
  Utensils,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Sliders,
  Keyboard,
  Gamepad2,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { Language, MapWaypoint } from '../../types';
import { translations } from '../../i18n/translations';

interface NavigationMapViewProps {
  lang: Language;
}

type ButlerActivity = 'patrol' | 'charging' | 'standby' | 'diagnostics';

export interface HomeRoomZone {
  id: string;
  key: string;
  nameVI: string;
  nameEN: string;
  type: 'dock' | 'living' | 'bedroom' | 'study' | 'kitchen' | 'foyer' | 'patio';
  color: string;
  borderColor: string;
  textColor: string;
  rect: { x: number; y: number; width: number; height: number };
  icon: string;
}

export const NavigationMapView: React.FC<NavigationMapViewProps> = ({ lang }) => {
  const t = translations[lang];
  const isVI = lang === 'vi';

  // Smart Butler Activities State
  const [currentActivity, setCurrentActivity] = useState<ButlerActivity>('patrol');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'room_management'>('monitor');

  // Layer Visibility Controls
  const [layers, setLayers] = useState({
    lidarRays: true,
    zones: true,
    corridors: true,
    bezierPaths: true,
    staticObstacles: true,
    gridMesh: true
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Butler Robot Position & Kinematics (Percentage Coordinates on 1440x840 viewbox)
  // Standard Cartesian/SVG: 0 deg = Facing Right (+X), 90 deg = Facing Down (+Y), 180 deg = Facing Left (-X), 270 deg = Facing Up (-Y)
  const [robotPos, setRobotPos] = useState({ x: 52.8, y: 79.8, angle: 270 });
  const [isNavigating, setIsNavigating] = useState(false);
  const [linearSpeed, setLinearSpeed] = useState<number>(0.8); // m/s
  const [activeKey, setActiveKey] = useState<'up' | 'down' | 'left' | 'right' | 'stop' | null>(null);
  const [lastActionText, setLastActionText] = useState<string>(isVI ? 'Sẵn sàng điều khiển' : 'Ready for control');
  const [actionCounter, setActionCounter] = useState<number>(0);

  // Editable Home Room Zones State
  const [homeZones, setHomeZones] = useState<HomeRoomZone[]>([
    {
      id: 'zone_dock',
      key: 'dock',
      nameVI: 'Trạm Sạc Thông Minh',
      nameEN: 'Smart Charging Dock',
      type: 'dock',
      color: '#EAB308',
      borderColor: '#EAB308',
      textColor: '#FDE047',
      rect: { x: 238, y: 80, width: 105, height: 90 },
      icon: 'zap'
    },
    {
      id: 'zone_living',
      key: 'living',
      nameVI: 'Phòng Khách & Tiếp Khách',
      nameEN: 'Main Living Room & Lounge',
      type: 'living',
      color: '#111827',
      borderColor: '#475569',
      textColor: '#94A3B8',
      rect: { x: 448, y: 80, width: 260, height: 490 },
      icon: 'home'
    },
    {
      id: 'zone_bedroom',
      key: 'bedroom',
      nameVI: 'Phòng Ngủ Master',
      nameEN: 'Master Bedroom Suite',
      type: 'bedroom',
      color: '#131B2B',
      borderColor: '#334155',
      textColor: '#94A3B8',
      rect: { x: 858, y: 80, width: 400, height: 420 },
      icon: 'bed'
    },
    {
      id: 'zone_study',
      key: 'study',
      nameVI: 'Phòng Đọc Sách & Làm Việc',
      nameEN: 'Study & Home Office',
      type: 'study',
      color: '#0F172A',
      borderColor: '#475569',
      textColor: '#94A3B8',
      rect: { x: 870, y: 580, width: 150, height: 180 },
      icon: 'book'
    },
    {
      id: 'zone_kitchen',
      key: 'kitchen',
      nameVI: 'Phòng Bếp & Bàn Ăn',
      nameEN: 'Kitchen & Dining Room',
      type: 'kitchen',
      color: '#0C2333',
      borderColor: '#0284C7',
      textColor: '#38BDF8',
      rect: { x: 1100, y: 610, width: 160, height: 160 },
      icon: 'utensils'
    },
    {
      id: 'zone_foyer',
      key: 'foyer',
      nameVI: 'Sảnh Chính & Nút Giao Trung Tâm',
      nameEN: 'Main Foyer & Corridor Hub',
      type: 'foyer',
      color: '#84CC16',
      borderColor: '#84CC16',
      textColor: '#BEF264',
      rect: { x: 710, y: 490, width: 150, height: 120 },
      icon: 'compass'
    }
  ]);

  // Zone Editing Modal / Inline State
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editNameVI, setEditNameVI] = useState('');
  const [editNameEN, setEditNameEN] = useState('');

  const startEditZone = (zone: HomeRoomZone) => {
    setEditingZoneId(zone.id);
    setEditNameVI(zone.nameVI);
    setEditNameEN(zone.nameEN);
  };

  const saveEditZone = (id: string) => {
    setHomeZones(prev => prev.map(z => {
      if (z.id === id) {
        return {
          ...z,
          nameVI: editNameVI.trim() || z.nameVI,
          nameEN: editNameEN.trim() || z.nameEN
        };
      }
      return z;
    }));
    setEditingZoneId(null);
    setDispatchStatus(isVI ? 'Đã cập nhật tên phòng thành công!' : 'Room name updated successfully!');
  };

  // Click-to-Dispatch Target
  const [dispatchTarget, setDispatchTarget] = useState<{
    xPct: number;
    yPct: number;
    xMeters: number;
    yMeters: number;
    zoneName: string;
  } | null>(null);

  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Preset Waypoints for Butler
  const [waypoints] = useState<MapWaypoint[]>([
    { id: 'wp_dock', nameVI: 'Trạm Sạc Tự Động', nameEN: 'Smart Charging Dock', x: 19.5, y: 15.0, type: 'dock' },
    { id: 'wp_living', nameVI: 'Bàn Trà Phòng Khách', nameEN: 'Living Room Coffee Table', x: 40.0, y: 38.0, type: 'checkpoint' },
    { id: 'wp_bedroom', nameVI: 'Cửa Phòng Ngủ Master', nameEN: 'Master Suite Entrance', x: 71.0, y: 39.0, type: 'patrol_point' },
    { id: 'wp_study', nameVI: 'Bàn Làm Việc & Sách', nameEN: 'Home Office Desk', x: 65.5, y: 80.0, type: 'patrol_point' },
    { id: 'wp_kitchen', nameVI: 'Quầy Bếp & Bàn Ăn', nameEN: 'Kitchen Island & Dining', x: 82.0, y: 78.0, type: 'checkpoint' },
    { id: 'wp_foyer', nameVI: 'Sảnh Chính Trung Tâm', nameEN: 'Central Foyer Junction', x: 55.5, y: 66.5, type: 'checkpoint' },
  ]);

  const [selectedWaypoint, setSelectedWaypoint] = useState<MapWaypoint | null>(waypoints[5]);

  // =========================================================================
  // REAL-TIME MOTION CONTROLLER: STEP & CONTINUOUS DRIVE
  // =========================================================================
  const stepMotion = useCallback((action: 'forward' | 'backward' | 'turn_left' | 'turn_right' | 'stop') => {
    setActionCounter(c => c + 1);

    if (action === 'stop') {
      setIsNavigating(false);
      setActiveKey('stop');
      setLastActionText(isVI ? '🛑 Đã dừng khẩn cấp' : '🛑 Emergency Stopped');
      setTimeout(() => setActiveKey(null), 300);
      return;
    }

    setIsNavigating(true);

    setRobotPos(prev => {
      let nextX = prev.x;
      let nextY = prev.y;
      let nextAngle = prev.angle;

      // Noticeable step size in percentage (approx 3% - 4% per step)
      const stepPct = linearSpeed * 3.8;

      switch (action) {
        case 'forward': {
          const rad = (prev.angle * Math.PI) / 180;
          nextX += Math.cos(rad) * stepPct;
          nextY += Math.sin(rad) * stepPct;
          setActiveKey('up');
          setLastActionText(isVI ? '⬆️ Đang tiến lên' : '⬆️ Moving Forward');
          break;
        }
        case 'backward': {
          const rad = (prev.angle * Math.PI) / 180;
          nextX -= Math.cos(rad) * stepPct;
          nextY -= Math.sin(rad) * stepPct;
          setActiveKey('down');
          setLastActionText(isVI ? '⬇️ Đang lùi lại' : '⬇️ Moving Backward');
          break;
        }
        case 'turn_left':
          nextAngle = (prev.angle - 30 + 360) % 360;
          setActiveKey('left');
          setLastActionText(isVI ? '⬅️ Xoay trái (-30°)' : '⬅️ Turning Left (-30°)');
          break;
        case 'turn_right':
          nextAngle = (prev.angle + 30) % 360;
          setActiveKey('right');
          setLastActionText(isVI ? '➡️ Xoay phải (+30°)' : '➡️ Turning Right (+30°)');
          break;
      }

      // Constrain within floorplan boundary limits (10% to 90%)
      nextX = Math.min(Math.max(nextX, 12), 88);
      nextY = Math.min(Math.max(nextY, 8), 88);

      return {
        x: Number(nextX.toFixed(2)),
        y: Number(nextY.toFixed(2)),
        angle: Math.round(nextAngle)
      };
    });
  }, [linearSpeed, isVI]);

  // Continuous driving on mouse/touch hold
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startContinuousDrive = (action: 'forward' | 'backward' | 'turn_left' | 'turn_right') => {
    stepMotion(action);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      stepMotion(action);
    }, 130);
  };

  const stopContinuousDrive = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setActiveKey(null);
  };

  // Keyboard Event Listener for Real-time WASD / Arrow Keys Control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting when user is typing in text input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      let handled = false;
      const key = e.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') {
        stepMotion('forward');
        handled = true;
      } else if (key === 'arrowdown' || key === 's') {
        stepMotion('backward');
        handled = true;
      } else if (key === 'arrowleft' || key === 'a') {
        stepMotion('turn_left');
        handled = true;
      } else if (key === 'arrowright' || key === 'd') {
        stepMotion('turn_right');
        handled = true;
      } else if (key === ' ' || key === 'spacebar') {
        stepMotion('stop');
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [stepMotion]);

  // Click on Map to set target
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    // Calculate simulated meter coordinates (Origin at center)
    const xMeters = Number(((xPct - 50) * 1.6).toFixed(2));
    const yMeters = Number(((50 - yPct) * 1.2).toFixed(2));

    // Match Zone Name from dynamic zones list
    let matchedZone = isVI ? 'Hành lang di chuyển' : 'Transit Corridor';
    
    if (xPct < 25 && yPct < 25) {
      const z = homeZones.find(item => item.id === 'zone_dock');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    } else if (xPct >= 31 && xPct <= 50 && yPct <= 68) {
      const z = homeZones.find(item => item.id === 'zone_living');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    } else if (xPct >= 60 && yPct <= 60) {
      const z = homeZones.find(item => item.id === 'zone_bedroom');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    } else if (xPct >= 60 && xPct <= 73 && yPct >= 69) {
      const z = homeZones.find(item => item.id === 'zone_study');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    } else if (xPct >= 76 && yPct >= 70) {
      const z = homeZones.find(item => item.id === 'zone_kitchen');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    } else if (xPct >= 49 && xPct <= 60 && yPct >= 58 && yPct <= 73) {
      const z = homeZones.find(item => item.id === 'zone_foyer');
      if (z) matchedZone = isVI ? z.nameVI : z.nameEN;
    }

    setDispatchTarget({
      xPct,
      yPct,
      xMeters,
      yMeters,
      zoneName: matchedZone
    });
  };

  // Confirm Dispatch to Target
  const handleConfirmDispatch = () => {
    if (!dispatchTarget || !isAvailable) return;

    setCurrentActivity('patrol');
    setIsNavigating(true);
    setDispatchStatus(
      isVI 
        ? `Quản gia đang di chuyển đến [${dispatchTarget.zoneName} (${dispatchTarget.xMeters}m, ${dispatchTarget.yMeters}m)]`
        : `Butler is heading to [${dispatchTarget.zoneName} (${dispatchTarget.xMeters}m, ${dispatchTarget.yMeters}m)]`
    );

    const targetPos = { 
      x: dispatchTarget.xPct, 
      y: dispatchTarget.yPct, 
      angle: Math.round(Math.atan2(dispatchTarget.yPct - robotPos.y, dispatchTarget.xPct - robotPos.x) * (180 / Math.PI)) 
    };
    setDispatchTarget(null);

    setTimeout(() => {
      setRobotPos(targetPos);
      setIsNavigating(false);
      setDispatchStatus(isVI ? `Quản gia đã đến vị trí yêu cầu!` : `Butler successfully arrived at target destination!`);
    }, 1200);
  };

  // Send Robot back to dock
  const handleReturnDock = () => {
    const dockWp = waypoints.find(w => w.id === 'wp_dock');
    if (dockWp) {
      handleDispatchToWaypoint(dockWp);
      setCurrentActivity('charging');
    }
  };

  // Dispatch to Preset Waypoint
  const handleDispatchToWaypoint = (wp: MapWaypoint) => {
    setSelectedWaypoint(wp);
    setIsNavigating(true);
    setDispatchStatus(
      isVI
        ? `Đang điều phối Butler-01 tới [${wp.nameVI}]...`
        : `Navigating Butler-01 to [${wp.nameEN}]...`
    );

    const targetPos = {
      x: wp.x,
      y: wp.y,
      angle: Math.round(Math.atan2(wp.y - robotPos.y, wp.x - robotPos.x) * (180 / Math.PI))
    };

    setTimeout(() => {
      setRobotPos(targetPos);
      setIsNavigating(false);
      setDispatchStatus(
        isVI
          ? `Quản gia đã đến [${wp.nameVI}] an toàn!`
          : `Butler reached [${wp.nameEN}] safely!`
      );
    }, 1200);
  };

  // Emergency Stop
  const handleEStop = () => {
    stepMotion('stop');
    setCurrentActivity('standby');
    setDispatchStatus(isVI ? '⚠️ ĐÃ KÍCH HOẠT DỪNG KHẨN CẤP (E-STOP)!' : '⚠️ EMERGENCY STOP TRIGGERED!');
  };

  return (
    <div className="w-full h-full flex flex-col space-y-3 bg-[#0B0F17] text-slate-100 p-3 select-none overflow-hidden font-sans">
      
      {/* =========================================================================
           1. TOP COMMAND BAR: STATUS & MODE TABS
           ========================================================================= */}
      <div className="flex items-center justify-between bg-[#111827] border border-slate-800 px-4 py-2.5 rounded-2xl shadow-xl shrink-0">
        
        {/* Left: Branding & 2 Mode Tabs */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  HSMIBot SMART BUTLER
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                  ROS2 ACTIVE
                </span>
              </div>
              <div className="text-[10px] text-sky-400 font-mono font-medium">
                {isVI ? 'Bản Đồ 2D Biệt Thự & Quản Gia' : '2D Villa Map & Smart Butler'}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800"></div>

          {/* Mode Tabs */}
          <div className="flex items-center space-x-1 bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'monitor' 
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isVI ? 'Giám Sát & Điều Khiển Lái' : 'Live Navigation & Teleop'}</span>
            </button>

            <button
              onClick={() => setActiveTab('room_management')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'room_management' 
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isVI ? 'Đổi Tên & Quản Lý Phòng' : 'Manage & Rename Rooms'}</span>
            </button>
          </div>
        </div>

        {/* Center: Butler Status Badge */}
        <div className="flex items-center space-x-3 bg-[#151D2A] border border-slate-700/60 px-3.5 py-1.5 rounded-full shadow-inner">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-xs font-mono font-bold text-white tracking-wide">Butler-01 [PRO]</span>
          </div>
          <span className="text-slate-600 font-mono text-xs">|</span>
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-400">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/40 text-[10px] uppercase">
              {currentActivity === 'patrol' && (isVI ? '🛡️ Tuần Tra' : '🛡️ Patrolling')}
              {currentActivity === 'charging' && (isVI ? '⚡ Đang Sạc Pin' : '⚡ Charging')}
              {currentActivity === 'standby' && (isVI ? '☕ Đang Chờ Lệnh' : '☕ Standby')}
              {currentActivity === 'diagnostics' && (isVI ? '🔧 Tự Kiểm Tra' : '🔧 Diagnostics')}
            </span>
          </div>
          <span className="text-slate-600 font-mono text-xs">|</span>
          <span className={`text-xs font-mono font-bold ${isAvailable ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isAvailable ? (isVI ? 'Sẵn Sàng Phục Vụ' : 'On-Duty') : (isVI ? 'Tạm Nghỉ' : 'Off-Duty')}
          </span>
        </div>

        {/* Right: Quick Emergency Stop */}
        <div className="flex items-center space-x-2">
          {dispatchStatus && (
            <div className="px-3 py-1 bg-sky-950/80 border border-sky-500/40 rounded-xl text-xs font-bold text-sky-300 animate-pulse flex items-center space-x-1.5 max-w-[220px]">
              <Radio className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-spin" />
              <span className="truncate">{dispatchStatus}</span>
            </div>
          )}

          <button
            onClick={handleEStop}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black tracking-wider uppercase transition shadow-md shadow-red-600/30 flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isVI ? 'DỪNG KHẨN CẤP' : 'E-STOP'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
           2. MAIN WORKSPACE: 2D SMART HOME MAP + SIDE CONFIGURATION PANEL
           ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        
        {/* LEFT: 2D HOME FLOORPLAN MAP CANVAS (8 or 9 Columns) */}
        <div className="xl:col-span-8 2xl:col-span-9 relative bg-[#0F141E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          
          {/* Top Canvas Bar: Real-time Coordinate Readout & Movement Toast */}
          <div className="absolute top-3 left-3 z-20 flex items-center space-x-3 bg-[#111827]/95 border border-cyan-500/50 px-3.5 py-1.5 rounded-xl backdrop-blur text-xs font-mono shadow-2xl">
            <div className="w-4 h-4 flex items-center justify-center text-cyan-400 border-r border-slate-700 pr-2 mr-1">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
            <div className="text-slate-300 font-semibold space-x-2">
              <span>X: <strong className="text-cyan-300 font-bold">{((robotPos.x - 50) * 1.6).toFixed(2)} m</strong></span>
              <span className="text-slate-600">|</span>
              <span>Y: <strong className="text-cyan-300 font-bold">{((50 - robotPos.y) * 1.2).toFixed(2)} m</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-yellow-400 font-bold">θ: {robotPos.angle}°</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 pl-2 border-l border-slate-700 text-[11px] text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lastActionText}</span>
            </div>
          </div>

          {/* Top-Right Floating Toolbars */}
          <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
            
            {/* Layer Visibility Menu Button */}
            <div className="relative">
              <button 
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center backdrop-blur transition shadow-xl cursor-pointer ${
                  showLayerMenu 
                    ? 'bg-sky-600 border-sky-400 text-white' 
                    : 'bg-[#151D2A]/90 hover:bg-[#1E293B] border-slate-700/80 text-sky-400'
                }`}
                title={isVI ? 'Lớp bản đồ' : 'Map Layers'}
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Floating Layer Dropdown */}
              {showLayerMenu && (
                <div className="absolute right-12 top-0 w-64 bg-[#111827] border border-slate-700 rounded-2xl p-3.5 shadow-2xl space-y-2 text-xs font-mono z-30">
                  <div className="text-[11px] font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>{isVI ? 'CÁC LỚP BẢN ĐỒ' : 'MAP LAYERS'}</span>
                    <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                    <span>{isVI ? 'Tia Quét Laser LiDAR 360°' : '360° LiDAR Laser Rays'}</span>
                    <input 
                      type="checkbox" 
                      checked={layers.lidarRays} 
                      onChange={(e) => setLayers({ ...layers, lidarRays: e.target.checked })} 
                      className="accent-sky-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                    <span>{isVI ? 'Phân Vùng Các Phòng' : 'Room Bounding Zones'}</span>
                    <input 
                      type="checkbox" 
                      checked={layers.zones} 
                      onChange={(e) => setLayers({ ...layers, zones: e.target.checked })} 
                      className="accent-sky-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                    <span>{isVI ? 'Hành Lang Di Chuyển' : 'Transit Corridors'}</span>
                    <input 
                      type="checkbox" 
                      checked={layers.corridors} 
                      onChange={(e) => setLayers({ ...layers, corridors: e.target.checked })} 
                      className="accent-sky-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                    <span>{isVI ? 'Đường Dẫn Quỹ Đạo Nav2' : 'Nav2 Bezier Paths'}</span>
                    <input 
                      type="checkbox" 
                      checked={layers.bezierPaths} 
                      onChange={(e) => setLayers({ ...layers, bezierPaths: e.target.checked })} 
                      className="accent-sky-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                    <span>{isVI ? 'Đồ Đạc & Chướng Ngại Vật' : 'Furniture & Obstacles'}</span>
                    <input 
                      type="checkbox" 
                      checked={layers.staticObstacles} 
                      onChange={(e) => setLayers({ ...layers, staticObstacles: e.target.checked })} 
                      className="accent-sky-500 rounded cursor-pointer" 
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Center-on-Robot Crosshair */}
            <button 
              onClick={() => {
                setZoomLevel(1);
                setDispatchStatus(isVI ? 'Đã căn giữa sơ đồ vào Robot Quản Gia' : 'Centered floorplan on Butler Bot');
              }}
              className="w-10 h-10 rounded-xl bg-[#151D2A]/90 hover:bg-[#1E293B] border border-slate-700/80 text-emerald-400 hover:text-emerald-300 flex items-center justify-center backdrop-blur transition shadow-xl cursor-pointer"
              title={isVI ? 'Căn giữa vào Robot' : 'Follow Butler'}
            >
              <Crosshair className="w-4 h-4" />
            </button>

            {/* Zoom In & Out */}
            <div className="flex flex-col rounded-xl bg-[#151D2A]/90 border border-slate-700/80 overflow-hidden shadow-xl">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                className="w-10 h-9 hover:bg-[#1E293B] text-slate-300 hover:text-white flex items-center justify-center transition border-b border-slate-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                className="w-10 h-9 hover:bg-[#1E293B] text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compass North Arrow */}
            <div className="w-10 h-10 rounded-xl bg-[#151D2A]/90 border border-slate-700/80 text-slate-300 flex items-center justify-center backdrop-blur shadow-xl">
              <div className="flex flex-col items-center">
                <Compass className="w-4 h-4 text-red-500" />
                <span className="text-[7px] font-mono font-bold text-slate-400">N</span>
              </div>
            </div>
          </div>

          {/* SVG 2D HOME FLOORPLAN (ViewBox 0 0 1440 840) */}
          <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden cursor-crosshair">
            <svg 
              onClick={handleMapClick}
              viewBox="0 0 1440 840" 
              className="w-full h-full object-contain transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})` }}
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="homeGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161F2E" strokeWidth="0.75" />
                  <circle cx="0" cy="0" r="1" fill="#243247" />
                </pattern>

                {/* Robot Halo Radial Glow */}
                <radialGradient id="butlerActiveGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#0284C7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 0. Canvas Background */}
              <rect width="1440" height="840" fill="#0B0F17" />
              {layers.gridMesh && <rect width="1440" height="840" fill="url(#homeGridPattern)" />}

              {/* 1. Villa Outer Structural Wall Footprint */}
              <path 
                d="M 120 70 H 230 V 40 H 860 V 70 H 1320 V 620 H 1170 V 780 H 160 V 670 H 120 Z" 
                fill="#0F172A" 
                stroke="#475569" 
                strokeWidth="2.5" 
              />

              {/* 2. LAYER 1: DENSE 360° LIDAR LASER SCAN RAYS */}
              {layers.lidarRays && (
                <g opacity="0.75" stroke="#1E293B" strokeWidth="0.5">
                  <path d="M 120 70 L 450 350 M 130 90 L 440 370 M 140 120 L 460 380 M 150 150 L 430 400 M 120 200 L 470 420" />
                  <path d="M 120 300 L 440 450 M 120 400 L 480 480 M 120 500 L 450 520 M 120 600 L 460 560 M 160 670 L 480 600" />
                  <path d="M 450 70 L 720 200 M 470 70 L 740 220 M 500 70 L 760 250 M 550 70 L 780 280 M 600 70 L 800 300" />
                  <path d="M 860 120 L 450 350 M 860 180 L 460 380 M 860 240 L 470 410 M 860 300 L 480 440 M 860 360 L 500 480" />
                  <path d="M 450 480 L 860 480 M 450 510 L 860 520 M 450 540 L 860 560 M 450 570 L 860 600 M 450 600 L 860 630" />
                  <path d="M 720 70 L 860 480 M 740 70 L 850 500 M 760 70 L 840 520 M 780 70 L 860 540 M 800 70 L 850 560" />
                  <path d="M 860 70 L 720 480 M 850 90 L 730 490 M 840 120 L 740 500 M 830 150 L 750 520 M 820 180 L 760 540" />
                  <path d="M 860 70 L 1320 480 M 880 70 L 1310 500 M 920 70 L 1300 520 M 960 70 L 1290 540 M 1000 70 L 1280 560" />
                  <path d="M 1320 100 L 900 450 M 1320 160 L 920 470 M 1320 220 L 940 490 M 1320 280 L 960 510 M 1320 340 L 980 530" />
                  <path d="M 900 620 L 1320 620 M 900 650 L 1300 670 M 900 680 L 1280 700 M 900 720 L 1240 740 M 900 760 L 1200 780" />
                  <path d="M 160 780 L 720 620 M 200 780 L 740 620 M 250 780 L 760 620 M 300 780 L 780 620 M 350 780 L 800 620" />
                </g>
              )}

              {/* 3. LAYER 2: DYNAMICALLY EDITABLE HOME ROOM ZONES */}
              {layers.zones && (
                <g>
                  {homeZones.map((zone) => {
                    const { rect, color, borderColor, textColor } = zone;
                    const zoneDisplayName = isVI ? zone.nameVI : zone.nameEN;

                    return (
                      <g key={zone.id}>
                        {/* Zone Bounding Box */}
                        <rect 
                          x={rect.x} 
                          y={rect.y} 
                          width={rect.width} 
                          height={rect.height} 
                          fill={color} 
                          fillOpacity={zone.type === 'dock' ? 0.12 : zone.type === 'foyer' ? 0.15 : 0.6} 
                          stroke={borderColor} 
                          strokeWidth={zone.type === 'dock' || zone.type === 'foyer' ? 1.5 : 1.8} 
                          strokeDasharray={zone.type === 'dock' || zone.type === 'foyer' ? '4,4' : '6,6'} 
                          rx="6" 
                        />

                        {/* Room Label */}
                        {zone.type === 'dock' ? (
                          <g transform={`translate(${rect.x + rect.width / 2}, ${rect.y + 35})`}>
                            <rect x="-11" y="-18" width="22" height="14" rx="2" fill="#EAB308" />
                            <path d="M -5 -4 L 0 4 L 5 -4 Z" fill="#EAB308" />
                            <text x="0" y="24" fill={textColor} fontSize="11" fontFamily="'Inter'" fontWeight="bold" textAnchor="middle">
                              {zoneDisplayName}
                            </text>
                          </g>
                        ) : (
                          <g transform={`translate(${rect.x + rect.width / 2}, ${rect.y + rect.height / 2})`}>
                            <text 
                              x="0" 
                              y="0" 
                              fill={textColor} 
                              fontSize={zone.type === 'living' || zone.type === 'bedroom' ? 14 : 12} 
                              fontFamily="'Inter'" 
                              fontWeight="700" 
                              textAnchor="middle" 
                              letterSpacing="0.5"
                            >
                              {zoneDisplayName}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 4. STATIC FURNITURE & HOME FIXTURES */}
              {layers.staticObstacles && (
                <g fill="#1E293B" stroke="#334155" strokeWidth="1.2">
                  {/* Living Room Sofas & TV Console */}
                  <rect x="465" y="110" width="40" height="18" rx="2" />
                  <rect x="465" y="145" width="40" height="18" rx="2" />
                  <rect x="465" y="180" width="40" height="18" rx="2" />
                  <rect x="465" y="215" width="40" height="18" rx="2" />
                  <rect x="465" y="250" width="40" height="18" rx="2" />

                  <rect x="525" y="110" width="55" height="22" rx="3" />
                  <rect x="600" y="110" width="55" height="22" rx="3" />

                  {/* Master Bedroom Wardrobe & Bed */}
                  <rect x="880" y="180" width="20" height="80" rx="3" />
                  <rect x="990" y="180" width="16" height="120" rx="3" />
                  <rect x="1100" y="180" width="16" height="140" rx="3" />

                  {/* Kitchen Island & Refrigerator */}
                  <rect x="1050" y="690" width="18" height="24" rx="3" stroke="#0284C7" />
                  <rect x="1135" y="690" width="18" height="24" rx="3" stroke="#0284C7" />
                </g>
              )}

              {/* 5. LAYER 3: HOME CORRIDORS & FLOW CHEVRONS */}
              {layers.corridors && (
                <g>
                  {/* Transit Corridor Bands */}
                  <rect x="180" y="180" width="250" height="95" fill="#0EA5E9" fillOpacity="0.18" rx="6" />
                  <rect x="180" y="275" width="80" height="320" fill="#0EA5E9" fillOpacity="0.18" rx="6" />
                  <rect x="340" y="275" width="85" height="240" fill="#0EA5E9" fillOpacity="0.18" rx="6" />
                  <rect x="330" y="490" width="130" height="120" fill="#0EA5E9" fillOpacity="0.18" rx="6" />
                  <rect x="320" y="630" width="450" height="90" fill="#0EA5E9" fillOpacity="0.18" rx="6" />
                  
                  <rect x="730" y="180" width="55" height="320" fill="#3B82F6" fillOpacity="0.25" rx="6" />
                  <rect x="805" y="180" width="55" height="320" fill="#0EA5E9" fillOpacity="0.22" rx="6" />
                  <rect x="730" y="100" width="130" height="80" fill="#64748B" fillOpacity="0.3" rx="6" />

                  <rect x="460" y="520" width="260" height="60" fill="#0EA5E9" fillOpacity="0.18" rx="4" />
                  <rect x="860" y="515" width="370" height="70" fill="#0EA5E9" fillOpacity="0.18" rx="4" />
                  <rect x="1190" y="430" width="110" height="230" fill="#0EA5E9" fillOpacity="0.25" rx="6" />

                  {/* Flow Chevrons */}
                  <g fill="#0284C7" fillOpacity="0.7">
                    <path d="M 220 220 L 235 228 L 220 236 L 225 228 Z" />
                    <path d="M 220 380 L 228 395 L 236 380 L 228 385 Z" />
                    <path d="M 220 520 L 228 535 L 236 520 L 228 525 Z" />
                    <path d="M 520 670 L 535 678 L 520 686 L 525 678 Z" />
                    <path d="M 680 670 L 695 678 L 680 686 L 685 678 Z" />
                    <path d="M 750 320 L 758 305 L 766 320 L 758 315 Z" />
                    <path d="M 830 320 L 838 335 L 846 320 L 838 325 Z" />
                  </g>
                </g>
              )}

              {/* 6. LAYER 4: NAV2 BEZIER CURVE TRAJECTORIES */}
              {layers.bezierPaths && (
                <g stroke="#00F0FF" strokeWidth="2.5" fill="none" strokeDasharray="6,6" opacity="0.85">
                  <path d="M 290 125 C 290 230, 220 230, 220 350 C 220 670, 220 670, 480 670 C 650 670, 755 600, 755 450 C 755 230, 755 230, 755 200 C 755 120, 835 120, 835 200 C 835 350, 835 550, 1180 550 C 1240 550, 1240 400, 1240 300" />
                </g>
              )}

              {/* 7. PRESET WAYPOINT NODES */}
              {waypoints.map((wp) => {
                const isSelected = selectedWaypoint?.id === wp.id;
                const pxX = (wp.x / 100) * 1440;
                const pxY = (wp.y / 100) * 840;

                return (
                  <g 
                    key={wp.id} 
                    transform={`translate(${pxX}, ${pxY})`} 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDispatchToWaypoint(wp);
                    }}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="14" fill="#00F0FF" fillOpacity="0.15" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3,3" className="animate-spin" />
                    )}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 6 : 4} 
                      fill={wp.type === 'dock' ? '#EAB308' : isSelected ? '#00F0FF' : '#38BDF8'} 
                      stroke="#0F172A" 
                      strokeWidth="1.5" 
                    />
                  </g>
                );
              })}

              {/* 9. CLICK-TO-DISPATCH TARGET CROSSHAIR & TRAJECTORY LINE */}
              {dispatchTarget && (
                <g>
                  {/* Projected Line to Target */}
                  <line 
                    x1={(robotPos.x / 100) * 1440} 
                    y1={(robotPos.y / 100) * 840} 
                    x2={(dispatchTarget.xPct / 100) * 1440} 
                    y2={(dispatchTarget.yPct / 100) * 840} 
                    stroke="#00F0FF" 
                    strokeWidth="2.5" 
                    strokeDasharray="6,6" 
                    className="animate-pulse" 
                  />

                  {/* Target Crosshair */}
                  <g transform={`translate(${(dispatchTarget.xPct / 100) * 1440}, ${(dispatchTarget.yPct / 100) * 840})`}>
                    <circle cx="0" cy="0" r="18" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" strokeDasharray="4,4" className="animate-spin" />
                    <circle cx="0" cy="0" r="6" fill="#10B981" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFFFFF" strokeWidth="1.5" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                </g>
              )}

              {/* 10. EXACT ONE ACTIVE SMART BUTLER ROBOT (HIGH VISIBILITY AVATAR) */}
              <g 
                transform={`translate(${(robotPos.x / 100) * 1440}, ${(robotPos.y / 100) * 840}) rotate(${robotPos.angle})`}
                className="transition-transform duration-100 ease-out pointer-events-none"
              >
                {/* Safety Glow Halo */}
                <circle cx="0" cy="0" r="42" fill="url(#butlerActiveGlow)" className="animate-pulse" />
                <circle cx="0" cy="0" r="32" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4,4" fill="none" opacity="0.9" />

                {/* White Butler Body with Rounded Chassis (Oriented along X axis) */}
                <rect x="-28" y="-20" width="56" height="40" rx="10" fill="#FFFFFF" stroke="#0B0F17" strokeWidth="3" />

                {/* Forward Heading Direction Pointer (Pointing +X) */}
                <path d="M 28 0 L 14 -10 L 14 10 Z" fill="#0284C7" />

                {/* 360° LiDAR Dome Sensor at Center */}
                <circle cx="-2" cy="0" r="10" fill="#0B0F17" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="-2" cy="0" r="4.5" fill="#00F0FF" />

                {/* Forward Laser Scanning Arc Cone */}
                <path d="M 24 -16 L 56 -32 A 64 64 0 0 1 56 32 L 24 16 Z" fill="#22C55E" fillOpacity="0.3" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="2,2" />

                {/* LED Status Indicator Beacons */}
                <circle cx="-20" cy="-12" r="3" fill="#00F0FF" />
                <circle cx="-20" cy="12" r="3" fill="#00F0FF" />
                <circle cx="20" cy="-12" r="3" fill="#10B981" />
                <circle cx="20" cy="12" r="3" fill="#10B981" />

                {/* Robot Label Tag */}
                <rect x="-18" y="-6" width="30" height="12" rx="3" fill="#0F172A" />
                <text x="-3" y="3" fill="#FFFFFF" fontSize="7.5" fontFamily="'JetBrains Mono'" fontWeight="900" textAnchor="middle">
                  BUTLER
                </text>
              </g>
            </svg>
          </div>

          {/* Target Dispatch Floating Modal on Map Click */}
          {dispatchTarget && (
            <div 
              style={{
                left: `${Math.min(Math.max(dispatchTarget.xPct, 15), 75)}%`,
                top: `${Math.min(Math.max(dispatchTarget.yPct, 20), 75)}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-full mb-4 z-30 w-72 bg-[#111827] border border-sky-400/80 rounded-2xl p-4 shadow-2xl space-y-3 backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-black text-white font-mono uppercase">
                    {isVI ? 'ĐIỀU PHỐI QUẢN GIA' : 'DISPATCH BUTLER'}
                  </span>
                </div>
                <button 
                  onClick={() => setDispatchTarget(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-mono space-y-1">
                <div className="text-sky-300 font-bold text-sm">{dispatchTarget.zoneName}</div>
                <div className="text-slate-400 text-[11px]">
                  {isVI ? 'Tọa độ:' : 'Target Pose:'} [x: {dispatchTarget.xMeters}m, y: {dispatchTarget.yMeters}m]
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={handleConfirmDispatch}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isVI ? 'ĐẾN ĐÂY NGAY' : 'GO HERE NOW'}</span>
                </button>
                <button
                  onClick={() => setDispatchTarget(null)}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-bold transition cursor-pointer"
                >
                  {isVI ? 'Hủy' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Map Status & Floorplan Version */}
          <div className="p-2.5 bg-[#0B0F17]/95 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-medium text-[11px]">
                {isVI ? 'Sơ Đồ Biệt Thự Thông Minh (SLAM 0.05m/px) • CycloneDDS' : 'Smart Villa SLAM Map (0.05m/px) • CycloneDDS'}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-[#111827] border border-slate-700 px-3 py-1 rounded-full text-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-bold">{isVI ? 'Đồng Bộ Trực Tiếp' : 'Live Synced'}</span>
              <span className="text-slate-500">&gt;</span>
              <span className="text-emerald-400 font-bold">Floor 1</span>
            </div>

            <div className="flex items-center space-x-2 text-cyan-300 text-[11px] font-black bg-cyan-950/80 border border-cyan-500/50 px-3 py-1 rounded-xl">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isVI ? 'Lái Bằng Phím: W A S D hoặc ↑ ↓ ← →' : 'Drive with: W A S D or ↑ ↓ ← →'}</span>
            </div>
          </div>

        </div>

        {/* RIGHT: SMART BUTLER TELEOP PANEL, ACTIVITIES & LOCATIONS (4 or 3 Columns) */}
        <div className="xl:col-span-4 2xl:col-span-3 bg-[#111827] border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between space-y-3.5 overflow-y-auto">
          
          <div className="space-y-3.5">
            
            {/* Header: Butler Robot Identity */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white font-mono">Butler-01 [PRO]</h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isVI ? 'Robot Quản Gia Thông Minh' : 'Smart Butler Assistant'}
                  </div>
                </div>
              </div>

              {/* Butler Availability Switch */}
              <button
                onClick={() => {
                  const next = !isAvailable;
                  setIsAvailable(next);
                  setDispatchStatus(
                    next 
                      ? (isVI ? 'Quản gia đã sẵn sàng phục vụ và tuần tra!' : 'Butler is ON-DUTY and ready for tasks!') 
                      : (isVI ? 'Quản gia đã chuyển sang chế độ tạm nghỉ.' : 'Butler is now OFF-DUTY.')
                  );
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border transition cursor-pointer flex items-center space-x-1 ${
                  isAvailable
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                }`}
                title={isVI ? 'Chuyển đổi trạng thái sẵn sàng' : 'Toggle Duty Status'}
              >
                <Power className="w-3 h-3" />
                <span>{isAvailable ? (isVI ? 'SẴN SÀNG' : 'ON-DUTY') : (isVI ? 'TẠM NGHỈ' : 'OFF-DUTY')}</span>
              </button>
            </div>

            {/* TAB 1: NAVIGATION, TELEOP CONTROLLER & ACTIVITIES */}
            {activeTab === 'monitor' && (
              <>
                {/* 1. PERMANENT TELEOP D-PAD CONTROLLER IN RIGHT PANEL */}
                <div className="bg-[#0B0F17] p-3 rounded-2xl border-2 border-cyan-500/60 shadow-lg space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-mono font-black text-cyan-400 uppercase flex items-center space-x-1.5">
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      <span>{isVI ? 'BẢNG PHÍM LÁI TRỰC TIẾP' : 'REAL-TIME TELEOP CONTROLLER'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      ROS2 /cmd_vel
                    </span>
                  </div>

                  {/* D-Pad Buttons in Right Panel */}
                  <div className="flex flex-col items-center space-y-1.5 py-1">
                    {/* Up Button */}
                    <button
                      onMouseDown={() => startContinuousDrive('forward')}
                      onMouseUp={stopContinuousDrive}
                      onMouseLeave={stopContinuousDrive}
                      onTouchStart={() => startContinuousDrive('forward')}
                      onTouchEnd={stopContinuousDrive}
                      onClick={() => stepMotion('forward')}
                      className={`w-16 h-11 rounded-xl flex flex-col items-center justify-center border font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                        activeKey === 'up' 
                          ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-cyan-400/80 font-black' 
                          : 'bg-[#151D2A] hover:bg-cyan-600 text-cyan-300 border-slate-700 hover:text-white'
                      }`}
                      title="W / Up Arrow"
                    >
                      <ArrowUp className="w-5 h-5 stroke-[3]" />
                      <span className="text-[8px] font-bold">W / ↑</span>
                    </button>

                    {/* Left, Stop, Right Row */}
                    <div className="flex items-center space-x-2">
                      {/* Left */}
                      <button
                        onMouseDown={() => startContinuousDrive('turn_left')}
                        onMouseUp={stopContinuousDrive}
                        onMouseLeave={stopContinuousDrive}
                        onTouchStart={() => startContinuousDrive('turn_left')}
                        onTouchEnd={stopContinuousDrive}
                        onClick={() => stepMotion('turn_left')}
                        className={`w-14 h-11 rounded-xl flex flex-col items-center justify-center border font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                          activeKey === 'left' 
                            ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-cyan-400/80 font-black' 
                            : 'bg-[#151D2A] hover:bg-cyan-600 text-cyan-300 border-slate-700 hover:text-white'
                        }`}
                        title="A / Left Arrow"
                      >
                        <ArrowLeft className="w-5 h-5 stroke-[3]" />
                        <span className="text-[8px] font-bold">A / ←</span>
                      </button>

                      {/* Stop Button */}
                      <button
                        onClick={() => stepMotion('stop')}
                        className="w-14 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white border border-red-400 flex flex-col items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer font-mono font-black"
                        title="Spacebar"
                      >
                        <Power className="w-4 h-4 stroke-[3]" />
                        <span className="text-[8px]">STOP</span>
                      </button>

                      {/* Right */}
                      <button
                        onMouseDown={() => startContinuousDrive('turn_right')}
                        onMouseUp={stopContinuousDrive}
                        onMouseLeave={stopContinuousDrive}
                        onTouchStart={() => startContinuousDrive('turn_right')}
                        onTouchEnd={stopContinuousDrive}
                        onClick={() => stepMotion('turn_right')}
                        className={`w-14 h-11 rounded-xl flex flex-col items-center justify-center border font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                          activeKey === 'right' 
                            ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-cyan-400/80 font-black' 
                            : 'bg-[#151D2A] hover:bg-cyan-600 text-cyan-300 border-slate-700 hover:text-white'
                        }`}
                        title="D / Right Arrow"
                      >
                        <ArrowRight className="w-5 h-5 stroke-[3]" />
                        <span className="text-[8px] font-bold">D / →</span>
                      </button>
                    </div>

                    {/* Down Button */}
                    <button
                      onMouseDown={() => startContinuousDrive('backward')}
                      onMouseUp={stopContinuousDrive}
                      onMouseLeave={stopContinuousDrive}
                      onTouchStart={() => startContinuousDrive('backward')}
                      onTouchEnd={stopContinuousDrive}
                      onClick={() => stepMotion('backward')}
                      className={`w-16 h-11 rounded-xl flex flex-col items-center justify-center border font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                        activeKey === 'down' 
                          ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-cyan-400/80 font-black' 
                          : 'bg-[#151D2A] hover:bg-cyan-600 text-cyan-300 border-slate-700 hover:text-white'
                      }`}
                      title="S / Down Arrow"
                    >
                      <ArrowDown className="w-5 h-5 stroke-[3]" />
                      <span className="text-[8px] font-bold">S / ↓</span>
                    </button>
                  </div>

                  {/* Hotkeys instruction */}
                  <div className="text-[10px] font-mono text-slate-400 bg-[#151D2A] p-2 rounded-xl flex items-center justify-between border border-slate-800">
                    <span className="text-cyan-400 font-bold">{isVI ? 'Phím tắt bàn phím:' : 'Hotkeys:'}</span>
                    <span>W, A, S, D / Mũi tên</span>
                  </div>
                </div>

                {/* 2. 4 Primary Smart Butler Activities */}
                <div className="space-y-2 bg-[#0B0F17] p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      {isVI ? 'Chế Độ Hoạt Động:' : 'Current Activity:'}
                    </span>
                    <span className="text-sky-400 font-bold uppercase">
                      {currentActivity === 'patrol' && (isVI ? 'Tuần Tra' : 'Patrol')}
                      {currentActivity === 'charging' && (isVI ? 'Sạc Pin' : 'Charging')}
                      {currentActivity === 'standby' && (isVI ? 'Chờ Lệnh' : 'Standby')}
                      {currentActivity === 'diagnostics' && (isVI ? 'Kiểm Tra' : 'Diagnostics')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold">
                    {/* 1. Patrol */}
                    <button
                      onClick={() => setCurrentActivity('patrol')}
                      className={`p-2 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        currentActivity === 'patrol'
                          ? 'bg-sky-950/80 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10'
                          : 'bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Shield className="w-3.5 h-3.5 text-sky-400" />
                        <span>{isVI ? 'Tuần Tra' : 'Patrol'}</span>
                      </span>
                      {currentActivity === 'patrol' && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
                    </button>

                    {/* 2. Charging */}
                    <button
                      onClick={() => {
                        setCurrentActivity('charging');
                        handleReturnDock();
                      }}
                      className={`p-2 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        currentActivity === 'charging'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                          : 'bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isVI ? 'Về Sạc' : 'Auto Dock'}</span>
                      </span>
                      {currentActivity === 'charging' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    </button>

                    {/* 3. Standby */}
                    <button
                      onClick={() => setCurrentActivity('standby')}
                      className={`p-2 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        currentActivity === 'standby'
                          ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                          : 'bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Coffee className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isVI ? 'Chờ Lệnh' : 'Standby'}</span>
                      </span>
                      {currentActivity === 'standby' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                    </button>

                    {/* 4. Diagnostics */}
                    <button
                      onClick={() => setCurrentActivity('diagnostics')}
                      className={`p-2 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        currentActivity === 'diagnostics'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-[#111827] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isVI ? 'Kiểm Tra' : 'Diagnostics'}</span>
                      </span>
                      {currentActivity === 'diagnostics' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  </div>
                </div>

                {/* 3. Preset Waypoint Quick Navigation */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{isVI ? 'Điểm Đến Cài Sẵn:' : 'Preset Locations:'}</span>
                    <span className="text-sky-400 text-[10px]">{waypoints.length} {isVI ? 'vị trí' : 'points'}</span>
                  </div>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {waypoints.map((wp) => {
                      const isSelected = selectedWaypoint?.id === wp.id;
                      return (
                        <div
                          key={wp.id}
                          onClick={() => handleDispatchToWaypoint(wp)}
                          className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs font-mono ${
                            isSelected
                              ? 'bg-sky-950/60 border-sky-500/80 text-white shadow-md'
                              : 'bg-[#0B0F17] border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <div className={`w-2 h-2 rounded-full ${wp.type === 'dock' ? 'bg-amber-400' : isSelected ? 'bg-sky-400 animate-ping' : 'bg-slate-500'}`}></div>
                            <span className="truncate font-semibold text-[11px]">{isVI ? wp.nameVI : wp.nameEN}</span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[9px] text-slate-500">[{wp.x.toFixed(0)}, {wp.y.toFixed(0)}]</span>
                            <Navigation className="w-3 h-3 text-sky-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: ROOM MANAGEMENT & RENAMING */}
            {activeTab === 'room_management' && (
              <div className="space-y-3 bg-[#0B0F17] p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-1.5">
                    <Edit3 className="w-4 h-4 text-sky-400" />
                    <span>{isVI ? 'Quản Lý & Đổi Tên Phòng' : 'Manage & Rename Rooms'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{homeZones.length} {isVI ? 'khu vực' : 'zones'}</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {homeZones.map((zone) => {
                    const isEditing = editingZoneId === zone.id;

                    return (
                      <div 
                        key={zone.id}
                        className="bg-[#111827] border border-slate-800 rounded-xl p-2.5 space-y-2 transition hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: zone.borderColor }}
                            ></span>
                            <span className="text-xs font-mono font-bold text-white">
                              {isVI ? zone.nameVI : zone.nameEN}
                            </span>
                          </div>

                          {!isEditing ? (
                            <button
                              onClick={() => startEditZone(zone)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                              title={isVI ? 'Sửa tên phòng' : 'Edit room name'}
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => saveEditZone(zone.id)}
                                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                                title={isVI ? 'Lưu' : 'Save'}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingZoneId(null)}
                                className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
                                title={isVI ? 'Hủy' : 'Cancel'}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Editable Form */}
                        {isEditing && (
                          <div className="space-y-2 pt-1 border-t border-slate-800/80">
                            <div>
                              <label className="text-[10px] font-mono text-slate-400 block mb-1">
                                {isVI ? 'Tên tiếng Việt:' : 'Vietnamese Name:'}
                              </label>
                              <input
                                type="text"
                                value={editNameVI}
                                onChange={(e) => setEditNameVI(e.target.value)}
                                className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-slate-400 block mb-1">
                                {isVI ? 'Tên tiếng Anh (International):' : 'English Name:'}
                              </label>
                              <input
                                type="text"
                                value={editNameEN}
                                onChange={(e) => setEditNameEN(e.target.value)}
                                className="w-full bg-[#0B0F17] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Quick Action Return to Dock */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleReturnDock}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs font-mono rounded-xl shadow-lg shadow-amber-600/20 transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isVI ? 'Về Trạm Sạc Tự Động' : 'Return to Smart Dock'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
