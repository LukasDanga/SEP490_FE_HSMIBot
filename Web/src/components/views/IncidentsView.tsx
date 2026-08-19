import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  CheckCircle2, 
  Send, 
  Flame, 
  UserX, 
  DoorOpen, 
  Dog, 
  Download,
  Search,
  Eye,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  BatteryCharging,
  Zap,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Language, SecurityIncident } from '../../types';
import { translations } from '../../i18n/translations';

interface IncidentsViewProps {
  lang: Language;
  incidents: SecurityIncident[];
  onResolveIncident: (id: string) => void;
  onDispatchRobot: (incident: SecurityIncident) => void;
}

const INITIAL_EXTENDED_INCIDENTS: SecurityIncident[] = [
  {
    id: 'inc_01',
    severity: 'danger',
    eventType: 'fire_heat',
    titleVI: 'Phát hiện khói & nhiệt độ cao bất thường',
    titleEN: 'High Temperature & Smoke Detected',
    descVI: 'Cảm biến MQ-2 đo được 310 ppm và camera nhiệt phát hiện điểm nhiệt 48.2°C gần bếp gas.',
    descEN: 'MQ-2 gas sensor measured 310 ppm and thermal camera detected 48.2°C heat spot near gas stove.',
    timestamp: '14:20:15',
    date: '2026-08-16',
    zoneVI: 'Khu vực Bếp (Zone B)',
    zoneEN: 'Kitchen Stove (Zone B)',
    snapshotType: 'fire',
    snapshotUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    videoClipUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    videoDurationSec: 30,
    actionTakenVI: 'Robot tự động kích hoạt loa cảnh báo TTS, chụp ảnh nhiệt và gửi cảnh báo khẩn đến điện thoại gia chủ.',
    actionTakenEN: 'Robot triggered onboard TTS alert, captured thermal snapshot and pushed high-priority notification to owner.',
    sensorData: {
      tempDeg: 48.2,
      smokePpm: 310,
      flameDetected: false,
      confidencePct: 98.9,
      lidarDistanceM: 0.85,
      batteryLevel: 88
    },
    timeline: [
      { time: '14:20:15', eventVI: 'Cảm biến MQ-2 vượt ngưỡng 200 ppm', eventEN: 'MQ-2 sensor exceeded 200 ppm threshold' },
      { time: '14:20:17', eventVI: 'Camera nhiệt xác định điểm nóng 48.2°C', eventEN: 'Thermal camera pinpointed 48.2°C heat spot' },
      { time: '14:20:18', eventVI: 'Phát thông báo AI TTS trên loa Robot', eventEN: 'Spoke AI TTS voice warning on robot speaker' },
      { time: '14:20:20', eventVI: 'Lưu trữ video clip 30 giây lên Cloud HSMIBot', eventEN: 'Archived 30s WebRTC video buffer to Cloud' }
    ],
    resolved: false
  },
  {
    id: 'inc_02',
    severity: 'warning',
    eventType: 'intruder',
    titleVI: 'Phát hiện khuôn mặt người lạ (Face ID)',
    titleEN: 'Unknown Face Detected (Stranger)',
    descVI: 'Người lạ xuất hiện trước Cửa Chính Zone A lúc 11:05. Không khớp hồ sơ gia đình.',
    descEN: 'Unrecognized individual detected in Front Entrance Zone A at 11:05. No match with registered family database.',
    timestamp: '11:05:42',
    date: '2026-08-16',
    zoneVI: 'Cửa Chính (Zone A)',
    zoneEN: 'Front Entrance (Zone A)',
    snapshotType: 'person',
    snapshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    videoClipUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80',
    videoDurationSec: 25,
    actionTakenVI: 'Robot chụp crop khuôn mặt 512D, bật đèn chiếu sáng và kích hoạt đối thoại 2 chiều.',
    actionTakenEN: 'Robot extracted 512D facial embedding, turned on floodlight, and initialized 2-way intercom.',
    sensorData: {
      tempDeg: 26.5,
      smokePpm: 95,
      flameDetected: false,
      confidencePct: 99.4,
      lidarDistanceM: 1.2,
      batteryLevel: 92
    },
    timeline: [
      { time: '11:05:42', eventVI: 'YOLOv8 phát hiện người tại Cửa Chính', eventEN: 'YOLOv8 detected person at Front Door' },
      { time: '11:05:43', eventVI: 'FaceNet xác thực: Không thuộc Danh bạ Gia Đình', eventEN: 'FaceNet verified: Not in Family Whitelist' },
      { time: '11:05:45', eventVI: 'Gửi Push Notification kèm ảnh Crop 512px', eventEN: 'Sent push notification with 512px face crop' }
    ],
    resolved: false
  },
  {
    id: 'inc_03',
    severity: 'info',
    eventType: 'patrol',
    titleVI: 'Hoàn thành tuần tra định kỳ buổi sáng',
    titleEN: 'Routine Morning Patrol Completed',
    descVI: 'Tuần tra thành công 6/6 Waypoints. Tất cả các cửa sổ, cảm biến và lối đi đều an toàn.',
    descEN: 'Successfully traversed 6/6 waypoints. All windows, sensors, and pathways verified secure.',
    timestamp: '09:00:00',
    date: '2026-08-16',
    zoneVI: 'Toàn bộ ngôi nhà (Zones A, B, C)',
    zoneEN: 'Whole Home (Zones A, B, C)',
    snapshotType: 'system',
    snapshotUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    videoClipUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    videoDurationSec: 45,
    actionTakenVI: 'Robot tự động quay về Trạm sạc pin sau khi hoàn tất chu trình.',
    actionTakenEN: 'Robot autonomously docked and initiated auto-charging after mission completion.',
    sensorData: {
      tempDeg: 25.8,
      smokePpm: 88,
      flameDetected: false,
      confidencePct: 100,
      lidarDistanceM: 3.5,
      batteryLevel: 78
    },
    timeline: [
      { time: '08:30:00', eventVI: 'Bắt đầu tuần tra theo lịch hẹn', eventEN: 'Started scheduled patrol routine' },
      { time: '08:58:30', eventVI: 'Hoàn thành kiểm tra Waypoint 6/6', eventEN: 'Completed inspection at Waypoint 6/6' },
      { time: '09:00:00', eventVI: 'Cập bến sạc an toàn, pin 78%', eventEN: 'Docked safely at charging base, battery 78%' }
    ],
    resolved: true
  },
  {
    id: 'inc_04',
    severity: 'warning',
    eventType: 'door_window',
    titleVI: 'Phát hiện cửa ban công mở hé bất thường',
    titleEN: 'Balcony Door Ajar Warning',
    descVI: 'LiDAR phát hiện khoảng hở 15cm tại cửa ban công BBQ lúc 03:15 sáng.',
    descEN: 'LiDAR detected 15cm open gap at Balcony sliding door during night patrol at 03:15 AM.',
    timestamp: '03:15:22',
    date: '2026-08-16',
    zoneVI: 'Ban Công BBQ (Zone C)',
    zoneEN: 'Balcony BBQ (Zone C)',
    snapshotType: 'door',
    snapshotUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    videoClipUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    videoDurationSec: 20,
    actionTakenVI: 'Robot chụp ảnh góc rộng, chiếu đèn kiểm tra và gửi cảnh báo đến điện thoại.',
    actionTakenEN: 'Robot captured wide-angle photo, flashed spotlight to inspect and sent mobile warning.',
    sensorData: {
      tempDeg: 24.1,
      smokePpm: 75,
      flameDetected: false,
      confidencePct: 97.8,
      lidarDistanceM: 0.15,
      batteryLevel: 85
    },
    timeline: [
      { time: '03:15:22', eventVI: 'LiDAR quét đường biên cửa phát hiện hở', eventEN: 'LiDAR contour scan detected open door gap' },
      { time: '03:15:25', eventVI: 'Camera chụp ảnh hồng ngoại ban đêm (Night IR)', eventEN: 'Camera captured Night IR snapshot' }
    ],
    resolved: true
  },
  {
    id: 'inc_05',
    severity: 'info',
    eventType: 'system_obstacle',
    titleVI: 'Tự động tránh vật cản động (Thú cưng)',
    titleEN: 'Dynamic Obstacle Avoidance (Pet)',
    descVI: 'Robot phát hiện chú chó Husky nằm chắn lối đi tại Phòng Khách và tự động tính toán đường đi vòng.',
    descEN: 'Robot detected pet dog resting on main hallway path in Living Room and recalculated Nav2 trajectory.',
    timestamp: '19:40:10',
    date: '2026-08-15',
    zoneVI: 'Phòng Khách (Zone A)',
    zoneEN: 'Living Room (Zone A)',
    snapshotType: 'pet',
    snapshotUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    videoClipUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80',
    videoDurationSec: 15,
    actionTakenVI: 'Nav2 Costmap Dynamic Inflation kích hoạt, robot giảm tốc xuống 0.15m/s và đi vòng an toàn.',
    actionTakenEN: 'Nav2 Costmap Dynamic Inflation engaged, robot slowed to 0.15m/s and safely bypassed.',
    sensorData: {
      tempDeg: 27.0,
      smokePpm: 90,
      flameDetected: false,
      confidencePct: 99.1,
      lidarDistanceM: 0.6,
      batteryLevel: 65
    },
    timeline: [
      { time: '19:40:10', eventVI: 'Phát hiện vật thể di động trên bản đồ Costmap', eventEN: 'Detected moving object on local Costmap' },
      { time: '19:40:12', eventVI: 'Tạo quỹ đạo tránh né cách 0.5m', eventEN: 'Generated safety bypass trajectory at 0.5m distance' }
    ],
    resolved: true
  }
];

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  lang,
  incidents: propIncidents,
  onResolveIncident,
  onDispatchRobot
}) => {
  const t = translations[lang];

  // Merge prop incidents with extended data for rich display
  const [incidentsList, setIncidentsList] = useState<SecurityIncident[]>(() => {
    return INITIAL_EXTENDED_INCIDENTS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'danger' | 'warning' | 'info'>('all');
  const [filterEventType, setFilterEventType] = useState<'all' | 'fire_heat' | 'intruder' | 'patrol' | 'system_obstacle' | 'door_window'>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Modal / Playback States
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video Playback Simulation Timer
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying && selectedIncident) {
      const maxDuration = selectedIncident.videoDurationSec || 30;
      interval = window.setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= maxDuration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(maxDuration, prev + 1 * playbackSpeed);
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedIncident, playbackSpeed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Resolve handler
  const handleResolve = (id: string) => {
    setIncidentsList(prev => prev.map(inc => inc.id === id ? { ...inc, resolved: true } : inc));
    onResolveIncident(id);
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, resolved: true } : null);
    }
    showToast(lang === 'vi' ? 'Đã đánh dấu sự cố là ĐÃ GIẢI QUYẾT!' : 'Incident marked as RESOLVED!');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Date', 'Severity', 'EventType', 'Zone', 'Status', 'ActionTaken'];
    const rows = filteredIncidents.map(inc => [
      inc.id,
      inc.timestamp,
      inc.date || '2026-08-16',
      inc.severity,
      inc.eventType || inc.snapshotType,
      `"${lang === 'vi' ? inc.zoneVI : inc.zoneEN}"`,
      inc.resolved ? 'Resolved' : 'Active',
      `"${lang === 'vi' ? inc.actionTakenVI || inc.descVI : inc.actionTakenEN || inc.descEN}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HSMIBot_Security_Audit_Logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'vi' ? 'Đã xuất file báo cáo CSV kiểm toán an ninh!' : 'Security Audit CSV exported successfully!');
  };

  // Filtered List
  const filteredIncidents = useMemo(() => {
    return incidentsList.filter(item => {
      const title = lang === 'vi' ? item.titleVI : item.titleEN;
      const desc = lang === 'vi' ? item.descVI : item.descEN;
      const zone = lang === 'vi' ? item.zoneVI : item.zoneEN;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            zone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
      const matchesEventType = filterEventType === 'all' || item.eventType === filterEventType;

      return matchesSearch && matchesSeverity && matchesEventType;
    });
  }, [incidentsList, searchQuery, filterSeverity, filterEventType, lang]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIncidents.slice(start, start + itemsPerPage);
  }, [filteredIncidents, currentPage, itemsPerPage]);

  const openIncidentModal = (inc: SecurityIncident) => {
    setSelectedIncident(inc);
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const getEventBadge = (type?: string, snapshotType?: string) => {
    const finalType = type || snapshotType;
    switch (finalType) {
      case 'fire_heat':
      case 'fire':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-red-50 text-red-700 border border-red-200">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>{t.filterTypeFire}</span>
          </span>
        );
      case 'intruder':
      case 'person':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
            <UserX className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.filterTypeIntruder}</span>
          </span>
        );
      case 'patrol':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.filterTypePatrol}</span>
          </span>
        );
      case 'door_window':
      case 'door':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
            <DoorOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Door & Window</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.filterTypeSystem}</span>
          </span>
        );
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'danger':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase bg-red-600 text-white shadow-xs">
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase bg-amber-500 text-white shadow-xs">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase bg-blue-500 text-white shadow-xs">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          1. TOP KPI SUMMARY CARDS (4 CARDS)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Patrols Completed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden group hover:border-blue-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{t.kpiTotalPatrols}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">142</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">+12% vs last mo.</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{t.kpiTotalPatrolsSub}</p>
        </div>

        {/* Card 2: Stranger Detections */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{t.kpiStrangerEvents}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">3 Events</span>
            <span className="text-xs font-bold text-blue-600 font-mono">100% Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{t.kpiStrangerEventsSub}</p>
        </div>

        {/* Card 3: Fire / Temp Warnings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden group hover:border-red-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{t.kpiFireWarnings}</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">2 Spikes</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">0 Critical</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{t.kpiFireWarningsSub}</p>
        </div>

        {/* Card 4: Robot Uptime & Battery Health */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{t.kpiRobotUptime}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BatteryCharging className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">99.2%</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">96% Health</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{t.kpiRobotUptimeSub}</p>
        </div>

      </div>

      {/* =========================================================================
          2. SECURITY INCIDENT LOG TABLE & FILTER BAR
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
        
        {/* Table Header & Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900">{t.auditHubTitle}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{t.auditHubSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition flex items-center space-x-2 shadow-md cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{t.btnExportCsvReport}</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="px-5 pb-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Keyword Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={lang === 'vi' ? 'Tìm theo phòng, sự cố, từ khóa...' : 'Search by room, event, keyword...'}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Severity Filter */}
          <div className="md:col-span-3">
            <select
              value={filterSeverity}
              onChange={(e) => {
                setFilterSeverity(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">{t.filterAllSeverities}</option>
              <option value="danger">{t.filterCritical}</option>
              <option value="warning">{t.filterWarning}</option>
              <option value="info">{t.filterInfo}</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div className="md:col-span-3">
            <select
              value={filterEventType}
              onChange={(e) => {
                setFilterEventType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">{t.filterAllTypes}</option>
              <option value="fire_heat">{t.filterTypeFire}</option>
              <option value="intruder">{t.filterTypeIntruder}</option>
              <option value="patrol">{t.filterTypePatrol}</option>
              <option value="system_obstacle">{t.filterTypeSystem}</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-2">
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">{t.filterAllDates}</option>
              <option value="today">{t.filterToday}</option>
              <option value="7days">{t.filterLast7Days}</option>
              <option value="30days">{t.filterLast30Days}</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-y border-slate-200/80 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">{t.thTimestamp}</th>
                <th className="py-3 px-3 font-bold">{t.thSeverity}</th>
                <th className="py-3 px-3 font-bold">{t.thEventType}</th>
                <th className="py-3 px-3 font-bold">{t.thLocation}</th>
                <th className="py-3 px-3 font-bold text-center">{t.thSnapshot}</th>
                <th className="py-3 px-3 font-bold text-center">{t.thVideoClip}</th>
                <th className="py-3 px-4 font-bold">{t.thActionTaken}</th>
                <th className="py-3 px-3 font-bold text-center">{t.thStatus}</th>
                <th className="py-3 px-4 font-bold text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                    {lang === 'vi' ? 'Không tìm thấy sự cố nào phù hợp với bộ lọc.' : 'No incidents match current filter criteria.'}
                  </td>
                </tr>
              ) : (
                paginatedIncidents.map((incident) => {
                  const title = lang === 'vi' ? incident.titleVI : incident.titleEN;
                  const zone = lang === 'vi' ? incident.zoneVI : incident.zoneEN;
                  const action = lang === 'vi' ? (incident.actionTakenVI || incident.descVI) : (incident.actionTakenEN || incident.descEN);

                  return (
                    <tr 
                      key={incident.id}
                      onClick={() => openIncidentModal(incident)}
                      className="hover:bg-blue-50/40 transition cursor-pointer group"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div>{incident.timestamp}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{incident.date || '2026-08-16'}</div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getSeverityBadge(incident.severity)}
                      </td>

                      {/* Event Type */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getEventBadge(incident.eventType, incident.snapshotType)}
                      </td>

                      {/* Location Zone */}
                      <td className="py-3.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{zone}</span>
                        </div>
                      </td>

                      {/* Snapshot Thumbnail */}
                      <td className="py-3.5 px-3 text-center">
                        {incident.snapshotUrl ? (
                          <div className="inline-block relative rounded-lg overflow-hidden border border-slate-200 w-12 h-9 group/snap">
                            <img src={incident.snapshotUrl} alt="Snapshot" className="w-full h-full object-cover group-hover/snap:scale-110 transition" />
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Video Clip */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold group-hover:bg-blue-600 transition">
                          <Video className="w-3 h-3 text-emerald-400" />
                          <span>00:{incident.videoDurationSec || 30}</span>
                        </span>
                      </td>

                      {/* Action Taken */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-[11px] text-slate-600 leading-relaxed">{action}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {incident.resolved ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>{lang === 'vi' ? 'Đã Xử Lý' : 'Resolved'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span>{lang === 'vi' ? 'Cần Theo Dõi' : 'Active Alert'}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openIncidentModal(incident)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.btnViewDetails}</span>
                          </button>

                          {!incident.resolved && (
                            <button
                              type="button"
                              onClick={() => handleResolve(incident.id)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center space-x-1"
                              title={t.btnMarkResolved}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div>
            {t.showingRecords} <strong className="text-slate-900">{Math.min(filteredIncidents.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredIncidents.length, currentPage * itemsPerPage)}</strong> {t.ofTotalRecords} <strong className="text-slate-900">{filteredIncidents.length}</strong> {t.recordsUnit}
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. ANALYTICS CHARTS (2 CHARTS: PATROL TREND & ROOM DISTRIBUTION)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Daily Patrol Completion & Incident Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">{t.chartPatrolTrendTitle}</h3>
              <p className="text-[10px] text-slate-500 font-medium">{t.chartPatrolTrendSubtitle}</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1 text-blue-600 font-bold">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
                <span>{t.legendPatrolsCompleted}</span>
              </span>
              <span className="flex items-center space-x-1 text-red-500 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>{t.legendIncidentsLogged}</span>
              </span>
            </div>
          </div>

          {/* Bar / Column Chart Representation (7 Days: Mon - Sun) */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Mon', patrols: 20, incidents: 1 },
              { day: 'Tue', patrols: 22, incidents: 0 },
              { day: 'Wed', patrols: 24, incidents: 2 },
              { day: 'Thu', patrols: 19, incidents: 0 },
              { day: 'Fri', patrols: 21, incidents: 1 },
              { day: 'Sat', patrols: 18, incidents: 0 },
              { day: 'Sun (Today)', patrols: 18, incidents: 0 }
            ].map((d, i) => {
              const heightPct = (d.patrols / 25) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end group">
                  <div className="text-[10px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {d.patrols} runs
                  </div>
                  
                  {/* Container Column */}
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-xl relative overflow-hidden flex flex-col justify-end" style={{ height: '140px' }}>
                    <div 
                      className="w-full bg-blue-600 rounded-xl transition-all duration-500 group-hover:bg-blue-700" 
                      style={{ height: `${heightPct}%` }}
                    />
                    {d.incidents > 0 && (
                      <div className="absolute top-2 inset-x-0 flex justify-center">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-md">
                          {d.incidents}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-600">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Incidents by Room Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900">{t.chartRoomDistributionTitle}</h3>
            <p className="text-[10px] text-slate-500 font-medium">{t.chartRoomDistributionSubtitle}</p>
          </div>

          {/* Room Progress List */}
          <div className="space-y-3.5 pt-1">
            {[
              { name: lang === 'vi' ? 'Phòng Bếp (Khu Bếp Ga)' : 'Kitchen (Stove & Heat Area)', pct: 42, count: '5 events', color: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
              { name: lang === 'vi' ? 'Cửa Chính Vào Nhà' : 'Front Entrance & Porch', pct: 28, count: '3 events', color: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
              { name: lang === 'vi' ? 'Phòng Khách Trung Tâm' : 'Living Room Center', pct: 18, count: '2 events', color: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
              { name: lang === 'vi' ? 'Ban Công BBQ Ngoài Trời' : 'Outdoor Balcony BBQ', pct: 12, count: '1 event', color: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' }
            ].map((room, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${room.color}`} />
                    <span>{room.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">{room.count} ({room.pct}%)</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${room.color} rounded-full transition-all duration-700`} style={{ width: `${room.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="font-semibold">Total Audited Events: <strong>11 Anomaly Triggers</strong></span>
            <span className="font-mono text-emerald-600 font-bold">100% Cleared</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. INCIDENT DETAIL MODAL WITH FULL VIDEO PLAYBACK & SENSOR TIMELINE
         ========================================================================= */}
      {selectedIncident && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={() => setSelectedIncident(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-8 space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-slate-900">
                      {lang === 'vi' ? selectedIncident.titleVI : selectedIncident.titleEN}
                    </h3>
                    {getSeverityBadge(selectedIncident.severity)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex items-center space-x-2 mt-0.5">
                    <span>📍 {lang === 'vi' ? selectedIncident.zoneVI : selectedIncident.zoneEN}</span>
                    <span>•</span>
                    <span>🕒 {selectedIncident.timestamp} ({selectedIncident.date || '2026-08-16'})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns (Left Video Player + Right Sensor Timeline) */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              
              {/* Left Column: Synchronized 1080p Video Playback Player (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="text-xs font-extrabold text-slate-800 flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>{t.modalVideoPlayerTitle}</span>
                </div>

                {/* Video Container */}
                <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative border border-slate-800 shadow-xl group">
                  <img
                    src={selectedIncident.videoClipUrl || selectedIncident.snapshotUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"}
                    alt="Video Buffer Frame"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlays */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs font-mono select-none z-20">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10 text-[10px] font-bold">
                      BUFFER REPLAY: 1080p@30fps
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 text-[10px]">
                      {selectedIncident.timestamp}
                    </span>
                  </div>

                  {/* Play/Pause Large Center Overlay if paused */}
                  {!isPlaying && (
                    <div 
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition group-hover:bg-black/30"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition">
                        <Play className="w-6 h-6 ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Video Controls Scrubber Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 space-y-2 z-20">
                    
                    {/* Progress Bar Slider */}
                    <div className="space-y-1">
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all" 
                          style={{ width: `${(playbackTime / (selectedIncident.videoDurationSec || 30)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPlaybackTime(0)}
                          className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
                          title="Rewind"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <span className="text-[11px] font-bold">
                          00:{String(Math.floor(playbackTime)).padStart(2, '0')} / 00:{selectedIncident.videoDurationSec || 30}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Speed Toggle */}
                        <button
                          type="button"
                          onClick={() => setPlaybackSpeed(s => s === 1.0 ? 1.5 : s === 1.5 ? 2.0 : 1.0)}
                          className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold hover:bg-white/30 transition cursor-pointer"
                        >
                          {playbackSpeed}x
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Incident Description */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-extrabold text-slate-800">{t.thActionTaken}:</div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {lang === 'vi' ? (selectedIncident.actionTakenVI || selectedIncident.descVI) : (selectedIncident.actionTakenEN || selectedIncident.descEN)}
                  </p>
                </div>

              </div>

              {/* Right Column: Synchronized Sensor Telemetry & Action Chain (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                <div className="text-xs font-extrabold text-slate-800 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>{t.modalSensorTimelineTitle}</span>
                </div>

                {/* 4 Sensor Telemetry Readouts */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-0.5">
                    <div className="text-[10px] font-bold text-red-700 uppercase">{t.sensorTempReadout}</div>
                    <div className="text-base font-black text-red-900 font-mono">
                      {selectedIncident.sensorData?.tempDeg || 27.4}°C
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-0.5">
                    <div className="text-[10px] font-bold text-amber-800 uppercase">{t.sensorSmokeReadout}</div>
                    <div className="text-base font-black text-amber-900 font-mono">
                      {selectedIncident.sensorData?.smokePpm || 110} ppm
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-0.5">
                    <div className="text-[10px] font-bold text-blue-700 uppercase">{t.sensorConfidenceReadout}</div>
                    <div className="text-base font-black text-blue-900 font-mono">
                      {selectedIncident.sensorData?.confidencePct || 99.4}%
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">{t.sensorObstacleDist}</div>
                    <div className="text-base font-black text-emerald-900 font-mono">
                      {selectedIncident.sensorData?.lidarDistanceM || 1.2} m
                    </div>
                  </div>
                </div>

                {/* Synchronized Chronological Event Timeline */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">Chronological Action Chain:</div>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1.5">
                    {(selectedIncident.timeline || [
                      { time: selectedIncident.timestamp, eventVI: 'Cảm biến kích hoạt cảnh báo an ninh', eventEN: 'Sensor triggered security anomaly' },
                      { time: '14:20:18', eventVI: 'Chụp ảnh và phân tích AI Edge', eventEN: 'Captured snapshot and executed AI Edge analysis' },
                      { time: '14:20:20', eventVI: 'Lưu trữ bằng chứng video lên Cloud HSMIBot', eventEN: 'Archived video evidence to HSMIBot Cloud' }
                    ]).map((step, idx) => (
                      <div key={idx} className="relative space-y-0.5">
                        <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-300" />
                        <div className="text-[10px] font-mono font-bold text-slate-400">{step.time}</div>
                        <div className="text-xs font-semibold text-slate-800 leading-snug">
                          {lang === 'vi' ? step.eventVI : step.eventEN}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Modal Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {!selectedIncident.resolved ? (
                    <button
                      type="button"
                      onClick={() => handleResolve(selectedIncident.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.btnMarkResolved}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'vi' ? 'Sự cố này đã được giải quyết an toàn' : 'This incident is resolved and closed'}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
