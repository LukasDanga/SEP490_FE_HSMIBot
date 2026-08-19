import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  X, 
  Camera, 
  Eye, 
  Cpu, 
  Lock, 
  Scan, 
  RefreshCw, 
  Trash2, 
  Flame, 
  Radio, 
  UploadCloud,
  Sparkles
} from 'lucide-react';
import { Language, SecurityMode, FaceProfile, IntruderAlert } from '../../types';
import { translations } from '../../i18n/translations';

interface FaceRecognitionViewProps {
  lang: Language;
}

const INITIAL_PROFILES: FaceProfile[] = [
  {
    id: 'face_01',
    name: 'Alexander Tran',
    relationship: 'owner',
    relationshipVI: 'Chủ nhà (Admin)',
    relationshipEN: 'Owner & Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    angles: {
      front: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      left: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      right: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    embeddingStatus: 'synced',
    vectorDimension: 512,
    matchConfidence: 99.8,
    lastSeenVI: '10 phút trước (Phòng khách)',
    lastSeenEN: '10 mins ago (Living Room)',
    enrolledDate: '2026-01-15',
    accessLevel: 'full_admin'
  },
  {
    id: 'face_02',
    name: 'Sarah Nguyen',
    relationship: 'spouse',
    relationshipVI: 'Vợ (Spouse)',
    relationshipEN: 'Spouse (Resident)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    angles: {
      front: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
    },
    embeddingStatus: 'synced',
    vectorDimension: 512,
    matchConfidence: 99.4,
    lastSeenVI: '45 phút trước (Bếp & Ăn)',
    lastSeenEN: '45 mins ago (Kitchen & Dining)',
    enrolledDate: '2026-01-18',
    accessLevel: 'resident'
  },
  {
    id: 'face_03',
    name: 'Sophia Tran',
    relationship: 'child',
    relationshipVI: 'Con gái (Child)',
    relationshipEN: 'Daughter (Resident)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    angles: {
      front: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
    },
    embeddingStatus: 'synced',
    vectorDimension: 512,
    matchConfidence: 98.9,
    lastSeenVI: '2 giờ trước (Phòng Ngủ)',
    lastSeenEN: '2 hours ago (Nursery Bedroom)',
    enrolledDate: '2026-02-02',
    accessLevel: 'resident'
  },
  {
    id: 'face_04',
    name: 'Marcus Lee',
    relationship: 'staff',
    relationshipVI: 'Quản gia / Nhân viên',
    relationshipEN: 'Housekeeper / Staff',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    angles: {
      front: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    embeddingStatus: 'synced',
    vectorDimension: 512,
    matchConfidence: 99.1,
    lastSeenVI: 'Hôm qua 16:30 (Cửa chính)',
    lastSeenEN: 'Yesterday 16:30 (Main Entrance)',
    enrolledDate: '2026-02-10',
    accessLevel: 'scheduled',
    scheduleRestrictionsVI: 'T2 & T5 (08:00 - 17:00)',
    scheduleRestrictionsEN: 'Mon & Thu (08:00 - 17:00)'
  }
];

const INITIAL_ALERTS: IntruderAlert[] = [
  {
    id: 'alert_intruder_01',
    titleVI: 'Phát hiện Kẻ Lạ Chưa Khớp Whitelist tại Khu Vực A',
    titleEN: 'Unknown Person Detected in Living Room Zone A',
    timestamp: '14:22:05 Hôm nay',
    locationVI: 'Phòng Khách (Zone A - Gần Ban công)',
    locationEN: 'Living Room (Zone A - Near Balcony)',
    status: 'unverified',
    classification: 'stranger',
    confidence: 98.6,
    croppedFaceUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    fullSnapshotUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    coordinates: { x: 3.4, y: 1.2, zone: 'Zone_A_Living' },
    lidarHeightCm: 174,
    thermalSignature: 36.8,
    sensorTriggered: ['4K RGB-D Camera', 'LiDAR Ouster 360°', 'PIR Motion', 'Thermal IR'],
    detailsVI: 'Robot tuần tra AMR-01 phát hiện đối tượng lạ không có vector đặc trưng trong cơ sở dữ liệu FaceNet. Tốc độ di chuyển: 0.8 m/s.',
    detailsEN: 'Autonomous Butler AMR-01 detected an unidentified subject with zero similarity hash in the local FaceNet NPU database. Target velocity: 0.8 m/s.'
  },
  {
    id: 'alert_intruder_02',
    titleVI: 'Phát hiện Người Di chuyển tại Cửa Trước lúc 02:14 AM',
    titleEN: 'Motion & Unidentified Person at Front Porch at 02:14 AM',
    timestamp: '02:14:08 Sáng nay',
    locationVI: 'Hành Lang Cửa Chính (Zone C)',
    locationEN: 'Main Entrance Hallway (Zone C)',
    status: 'unverified',
    classification: 'stranger',
    confidence: 96.2,
    croppedFaceUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    fullSnapshotUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    coordinates: { x: 5.1, y: 0.8, zone: 'Zone_C_Entrance' },
    lidarHeightCm: 180,
    thermalSignature: 37.1,
    sensorTriggered: ['4K Camera', 'Wide PIR', 'LiDAR 360°'],
    detailsVI: 'Cảm biến PIR kích hoạt đánh thức robot tuần tra. Đối tượng đứng trước cửa chính quá 20 giây.',
    detailsEN: 'PIR motion triggered robot wakeup sweep. Target loitered near main entrance threshold for >20 seconds.'
  },
  {
    id: 'alert_intruder_03',
    titleVI: 'Nhận diện Thành viên Gia đình: Alexander Tran',
    titleEN: 'Recognized Family Member: Alexander Tran',
    timestamp: '08:30:12 Sáng nay',
    locationVI: 'Khu vực Bếp & Bàn ăn',
    locationEN: 'Kitchen & Dining Area',
    status: 'marked_family',
    classification: 'known_family',
    confidence: 99.8,
    croppedFaceUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    fullSnapshotUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    coordinates: { x: 2.1, y: 3.4, zone: 'Zone_B_Kitchen' },
    lidarHeightCm: 176,
    thermalSignature: 36.6,
    sensorTriggered: ['4K FaceNet', 'LiDAR'],
    detailsVI: 'Nhận diện thành công chủ nhà với độ tin cậy 99.8%. Tự động giải tỏa chế độ cảnh giác.',
    detailsEN: 'Successfully verified owner identity with 99.8% match. Patrol auto-cleared.'
  }
];

export const FaceRecognitionView: React.FC<FaceRecognitionViewProps> = ({ lang }) => {
  const t = translations[lang];

  // State
  const [securityMode, setSecurityMode] = useState<SecurityMode>('away');
  const [profiles, setProfiles] = useState<FaceProfile[]>(INITIAL_PROFILES);
  const [alerts, setAlerts] = useState<IntruderAlert[]>(INITIAL_ALERTS);
  const [filterTab, setFilterTab] = useState<'all' | 'unverified' | 'known_family' | 'false_alarm'>('all');
  
  // Modals & UI Toggles
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState<boolean>(false);
  const [selectedProfileForInspect, setSelectedProfileForInspect] = useState<FaceProfile | null>(null);
  
  // Siren State
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const sirenAudioContextRef = useRef<AudioContext | null>(null);
  const sirenOscillatorRef = useRef<OscillatorNode | null>(null);

  // Snapshot Viewer Mode per alert card
  const [snapshotViewMode, setSnapshotViewMode] = useState<Record<string, 'crop' | 'full'>>({
    alert_intruder_01: 'crop',
    alert_intruder_02: 'crop',
    alert_intruder_03: 'crop'
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enroll Form State
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    relationship: 'spouse' as FaceProfile['relationship'],
    frontPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    leftPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rightPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  });
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractProgress, setExtractProgress] = useState<number>(0);

  // Convert Stranger to Family Modal State
  const [convertingAlert, setConvertingAlert] = useState<IntruderAlert | null>(null);
  const [convertName, setConvertName] = useState<string>('');
  const [convertRelationship, setConvertRelationship] = useState<FaceProfile['relationship']>('relative');

  // Trigger audio siren simulation
  const startSirenAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      sirenAudioContextRef.current = ctx;
      sirenOscillatorRef.current = osc;
    } catch {
      // Audio context might fail on user gesture policy
    }
  };

  const stopSirenAudio = () => {
    try {
      if (sirenOscillatorRef.current) {
        sirenOscillatorRef.current.stop();
        sirenOscillatorRef.current.disconnect();
        sirenOscillatorRef.current = null;
      }
      if (sirenAudioContextRef.current) {
        sirenAudioContextRef.current.close();
        sirenAudioContextRef.current = null;
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleSiren = (alertId?: string) => {
    if (isSirenActive) {
      setIsSirenActive(false);
      stopSirenAudio();
      showToast(lang === 'vi' ? 'Đã tắt còi báo động và đèn cảnh báo.' : 'Siren and strobe lights silenced.');
    } else {
      setIsSirenActive(true);
      startSirenAudio();
      if (alertId) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, alarmTriggered: true, status: 'verified_intruder' } : a));
      }
      showToast(t.alertVerifiedStranger);
    }
  };

  useEffect(() => {
    return () => {
      stopSirenAudio();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Actions for alerts
  const handleMarkAsFamily = (alert: IntruderAlert) => {
    setConvertingAlert(alert);
    setConvertName(lang === 'vi' ? 'Khách / Người Thân Mới' : 'New Family Member');
  };

  const handleConfirmConvert = () => {
    if (!convertingAlert) return;

    const newProfile: FaceProfile = {
      id: `face_${Date.now()}`,
      name: convertName || (lang === 'vi' ? 'Thành viên mới' : 'New Member'),
      relationship: convertRelationship,
      relationshipVI: convertRelationship === 'spouse' ? 'Vợ/Chồng' : convertRelationship === 'child' ? 'Con cái' : 'Người thân',
      relationshipEN: convertRelationship === 'spouse' ? 'Spouse' : convertRelationship === 'child' ? 'Child' : 'Relative',
      avatarUrl: convertingAlert.croppedFaceUrl,
      angles: { front: convertingAlert.croppedFaceUrl },
      embeddingStatus: 'synced',
      vectorDimension: 512,
      matchConfidence: 99.2,
      lastSeenVI: `${convertingAlert.timestamp} (${convertingAlert.locationVI})`,
      lastSeenEN: `${convertingAlert.timestamp} (${convertingAlert.locationEN})`,
      enrolledDate: new Date().toISOString().split('T')[0],
      accessLevel: 'resident'
    };

    setProfiles(prev => [newProfile, ...prev]);
    setAlerts(prev => prev.map(a => a.id === convertingAlert.id ? { ...a, status: 'marked_family', classification: 'known_family' } : a));
    setConvertingAlert(null);
    showToast(t.alertAddedFamily);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'dismissed', classification: 'false_alarm' } : a));
    showToast(t.alertDismissed);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    showToast(lang === 'vi' ? 'Đã xóa hồ sơ khuôn mặt khỏi robot.' : 'Face profile deleted from robot memory.');
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.name.trim()) return;

    setIsExtracting(true);
    setExtractProgress(15);

    const step1 = setTimeout(() => setExtractProgress(45), 400);
    const step2 = setTimeout(() => setExtractProgress(85), 900);
    const step3 = setTimeout(() => {
      setExtractProgress(100);
      const newProfile: FaceProfile = {
        id: `face_${Date.now()}`,
        name: enrollForm.name,
        relationship: enrollForm.relationship,
        relationshipVI: enrollForm.relationship === 'owner' ? 'Chủ nhà' : enrollForm.relationship === 'spouse' ? 'Vợ/Chồng' : enrollForm.relationship === 'child' ? 'Con cái' : 'Khách / Nhân viên',
        relationshipEN: enrollForm.relationship === 'owner' ? 'Owner' : enrollForm.relationship === 'spouse' ? 'Spouse' : enrollForm.relationship === 'child' ? 'Child' : 'Guest / Staff',
        avatarUrl: enrollForm.frontPhoto,
        angles: {
          front: enrollForm.frontPhoto,
          left: enrollForm.leftPhoto,
          right: enrollForm.rightPhoto
        },
        embeddingStatus: 'synced',
        vectorDimension: 512,
        matchConfidence: 99.6,
        lastSeenVI: 'Vừa đăng ký',
        lastSeenEN: 'Just enrolled',
        enrolledDate: new Date().toISOString().split('T')[0],
        accessLevel: enrollForm.relationship === 'owner' ? 'full_admin' : 'resident'
      };

      setProfiles(prev => [newProfile, ...prev]);
      setIsExtracting(false);
      setIsEnrollModalOpen(false);
      setEnrollForm({
        name: '',
        relationship: 'spouse',
        frontPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        leftPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        rightPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
      });
      showToast(lang === 'vi' ? `Đã đồng bộ thành công hồ sơ ${newProfile.name} vào ROS2!` : `Face profile for ${newProfile.name} synced to ROS2!`);
    }, 1400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterTab === 'all') return true;
    if (filterTab === 'unverified') return alert.status === 'unverified' || alert.status === 'verified_intruder';
    if (filterTab === 'known_family') return alert.status === 'marked_family' || alert.classification === 'known_family';
    if (filterTab === 'false_alarm') return alert.status === 'dismissed' || alert.classification === 'false_alarm';
    return true;
  });

  const unverifiedCount = alerts.filter(a => a.status === 'unverified').length;

  return (
    <div className="space-y-6 select-none">
      
      {/* SIREN ACTIVE TOP EMERGENCY BAR */}
      {isSirenActive && (
        <div className="bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-6 h-6 animate-spin text-amber-300" />
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-amber-200">
                {lang === 'vi' ? '🚨 ĐANG PHÁT CÒI HÚ BÁO ĐỘNG KHẨN CẤP 105dB & ĐÈN CHỚP' : '🚨 EMERGENCY 105dB DETERRENT SIREN & HIGH-BEAM STROBE ACTIVE'}
              </div>
              <div className="text-[11px] text-red-100 font-mono">
                ROS2 Command: /butler/siren_active=TRUE • AMR-01 Defense Posture Engaged
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggleSiren()}
            className="px-4 py-1.5 bg-white text-red-700 hover:bg-red-50 text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <VolumeX className="w-4 h-4" />
            <span>{t.btnStopSiren}</span>
          </button>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. SECURITY MODE QUICK BAR (HIGH PROMINENCE SEGMENTED TOGGLE) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-extrabold text-slate-900">{t.securityModeTitle}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {t.secModeActive}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.faceHubSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">{t.secSensorsArmed}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              5/5 Online
            </span>
          </div>
        </div>

        {/* Segmented 3-Way Mode Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Mode 1: Home (Disarmed) */}
          <button
            type="button"
            onClick={() => {
              setSecurityMode('home');
              showToast(lang === 'vi' ? 'Đã chuyển sang Chế độ Ở Nhà (Cảm biến cơ bản)' : 'Switched to Home Mode (Disarmed)');
            }}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
              securityMode === 'home'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  securityMode === 'home' ? 'bg-slate-800 text-blue-400' : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs">{t.modeHome}</span>
              </div>
              {securityMode === 'home' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </div>
            <p className={`text-[11px] ${securityMode === 'home' ? 'text-slate-300' : 'text-slate-500'}`}>
              {t.modeHomeSub}
            </p>
          </button>

          {/* Mode 2: Away Mode (High Alert - Arm All) */}
          <button
            type="button"
            onClick={() => {
              setSecurityMode('away');
              showToast(lang === 'vi' ? 'Đã kích hoạt CHẾ ĐỘ VẮNG NHÀ (High Alert)!' : 'AWAY MODE ARMED! All sensors on high alert.');
            }}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
              securityMode === 'away'
                ? 'bg-red-950 text-white border-red-500 shadow-lg shadow-red-950/20 ring-2 ring-red-500/30'
                : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  securityMode === 'away' ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-red-600 border border-slate-200'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className={`font-extrabold text-xs ${securityMode === 'away' ? 'text-red-300' : 'text-slate-900'}`}>
                  {t.modeAway}
                </span>
              </div>
              {securityMode === 'away' && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
            <p className={`text-[11px] ${securityMode === 'away' ? 'text-red-200' : 'text-slate-500'}`}>
              {t.modeAwaySub}
            </p>
          </button>

          {/* Mode 3: Night Guard */}
          <button
            type="button"
            onClick={() => {
              setSecurityMode('night');
              showToast(lang === 'vi' ? 'Đã chuyển sang Canh gác Ban đêm (Stealth Watch)' : 'Night Guard mode armed (Stealth watch)');
            }}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
              securityMode === 'night'
                ? 'bg-indigo-950 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  securityMode === 'night' ? 'bg-indigo-800 text-indigo-300' : 'bg-white text-indigo-600 border border-slate-200'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs">{t.modeNight}</span>
              </div>
              {securityMode === 'night' && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
            </div>
            <p className={`text-[11px] ${securityMode === 'night' ? 'text-indigo-200' : 'text-slate-500'}`}>
              {t.modeNightSub}
            </p>
          </button>
        </div>

        {/* Armed Sensors Ribbon */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-600">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="font-bold text-slate-700">{t.secSensorsArmed}</span>
            <span className="text-slate-500">{t.armedSensorsList}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-700 font-bold">NPU Hardware Latency: 42ms</span>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: REGISTERED FAMILY FACE REGISTRY (AI WHITELIST) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900">{t.whitelistSectionTitle}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {profiles.length} {lang === 'vi' ? 'Hồ sơ đã duyệt' : 'Authorized Profiles'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.whitelistSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.zeroCloudNotice}</span>
            </span>

            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.btnEnrollFace}</span>
            </button>
          </div>
        </div>

        {/* Family Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative group"
            >
              {/* Avatar & Top Badge */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                    ✓
                  </span>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wider ${
                    profile.accessLevel === 'full_admin'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : profile.accessLevel === 'scheduled'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {profile.accessLevel === 'full_admin' ? 'ADMIN OWNER' : profile.accessLevel === 'scheduled' ? 'SCHEDULED GUEST' : 'FAMILY RESIDENT'}
                  </span>

                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{t.badgeEnrolled}</span>
                  </span>
                </div>
              </div>

              {/* Name & Relationship */}
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{profile.name}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'vi' ? profile.relationshipVI : profile.relationshipEN}
                  {profile.scheduleRestrictionsEN && (
                    <span className="block text-[10px] text-amber-700 font-mono mt-0.5">
                      {lang === 'vi' ? profile.scheduleRestrictionsVI : profile.scheduleRestrictionsEN}
                    </span>
                  )}
                </p>
              </div>

              {/* Telemetry & Vector Sync Info */}
              <div className="pt-2.5 border-t border-slate-100 space-y-1 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t.lblMatchConfidence}</span>
                  <strong className="text-emerald-600 font-bold">{profile.matchConfidence}%</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t.lblVectors}</span>
                  <span className="text-slate-700 font-semibold">{profile.vectorDimension}-dim NPU</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t.lblLastSeen}</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[120px]" title={lang === 'vi' ? profile.lastSeenVI : profile.lastSeenEN}>
                    {lang === 'vi' ? profile.lastSeenVI : profile.lastSeenEN}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfileForInspect(profile);
                    setIsInspectModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.btnInspectVector}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    title={t.btnRetrain}
                    onClick={() => showToast(lang === 'vi' ? `Đang huấn luyện lại vector cho ${profile.name}...` : `Retraining embedding model for ${profile.name}...`)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  {profile.accessLevel !== 'full_admin' && (
                    <button
                      type="button"
                      title={t.btnDeleteProfile}
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECTION 2: INTRUDER & UNKNOWN PERSON ALERTS FEED */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900">{t.intruderSectionTitle}</h3>
                {unverifiedCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse">
                    {unverifiedCount} {lang === 'vi' ? 'CHƯA XÁC THỰC' : 'UNVERIFIED'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.intruderSubtitle}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabAllIncidents} ({alerts.length})
            </button>
            <button
              onClick={() => setFilterTab('unverified')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                filterTab === 'unverified' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-700 hover:text-red-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>{t.tabUnverified} ({alerts.filter(a => a.status === 'unverified').length})</span>
            </button>
            <button
              onClick={() => setFilterTab('known_family')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterTab === 'known_family' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabKnownFamily} ({alerts.filter(a => a.classification === 'known_family').length})
            </button>
            <button
              onClick={() => setFilterTab('false_alarm')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterTab === 'false_alarm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabFalseAlarms} ({alerts.filter(a => a.classification === 'false_alarm').length})
            </button>
          </div>
        </div>

        {/* Alert Cards List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">
                {lang === 'vi' ? 'Không có sự cố nào trong bộ lọc này.' : 'No alert incidents found in this filter.'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'vi' ? 'Hệ thống an ninh và camera đang hoạt động ổn định.' : 'All surveillance feeds and whitelist models are nominal.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isStranger = alert.classification === 'stranger' || alert.status === 'unverified' || alert.status === 'verified_intruder';
              const currentMode = snapshotViewMode[alert.id] || 'crop';

              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl border-2 transition-all p-5 shadow-sm space-y-4 ${
                    alert.status === 'unverified'
                      ? 'bg-red-50/60 border-red-400 ring-1 ring-red-400/30'
                      : alert.status === 'verified_intruder'
                      ? 'bg-red-100 border-red-600 ring-2 ring-red-600/30'
                      : alert.status === 'marked_family'
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                    
                    {/* Left: Snapshots with Toggle Mode (Cropped vs Full 4K) */}
                    <div className="space-y-2 shrink-0">
                      <div className="relative w-full lg:w-48 h-48 rounded-xl bg-slate-950 overflow-hidden border-2 border-slate-800 shadow-inner group">
                        <img
                          src={currentMode === 'crop' ? alert.croppedFaceUrl : alert.fullSnapshotUrl}
                          alt="Surveillance Snapshot"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Bounding Box on Cropped View */}
                        {currentMode === 'crop' && (
                          <div className="absolute inset-3 border-2 border-dashed border-red-500 rounded-lg pointer-events-none">
                            <span className="absolute -top-2.5 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded font-mono">
                              {alert.status === 'unverified' ? 'UNMATCHED 98.6%' : 'MATCH: OWNER 99.8%'}
                            </span>
                          </div>
                        )}

                        {/* Mode Indicator Overlay */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded text-[9px] font-mono text-slate-300">
                          <span>{currentMode === 'crop' ? 'NPU Face ROI' : '4K RealSense RGB-D'}</span>
                          <span className="text-sky-400 font-bold">1080p</span>
                        </div>
                      </div>

                      {/* Switch View Mode Buttons */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSnapshotViewMode(prev => ({ ...prev, [alert.id]: 'crop' }))}
                          className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            currentMode === 'crop'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t.toggleFaceCrop}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSnapshotViewMode(prev => ({ ...prev, [alert.id]: 'full' }))}
                          className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            currentMode === 'full'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t.toggleFullCam}
                        </button>
                      </div>
                    </div>

                    {/* Center: Metadata, Telemetry & Sensor Readings */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isStranger ? (
                          <span className="px-2.5 py-0.5 bg-red-600 text-white text-xs font-black rounded-full flex items-center space-x-1 shadow-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{t.cardHighPriorityAlert}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-black rounded-full flex items-center space-x-1 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'vi' ? 'ĐÃ XÁC NHẬN GIA ĐÌNH' : 'AUTHORIZED RESIDENT'}</span>
                          </span>
                        )}

                        <span className="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                          {alert.timestamp}
                        </span>

                        <span className="text-xs font-mono font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                          {t.cardConfidence} <strong className="text-red-700">{alert.confidence}%</strong>
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          {lang === 'vi' ? alert.titleVI : alert.titleEN}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                          {lang === 'vi' ? alert.detailsVI : alert.detailsEN}
                        </p>
                      </div>

                      {/* Telemetry & Hardware Sensors Ribbon */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="bg-white/90 p-2 rounded-xl border border-slate-200/80 text-[11px] font-mono">
                          <div className="text-slate-400 font-medium">{t.cardLocation}</div>
                          <div className="font-bold text-slate-900 truncate" title={lang === 'vi' ? alert.locationVI : alert.locationEN}>
                            {lang === 'vi' ? alert.locationVI : alert.locationEN}
                          </div>
                        </div>

                        <div className="bg-white/90 p-2 rounded-xl border border-slate-200/80 text-[11px] font-mono">
                          <div className="text-slate-400 font-medium">{t.cardCoordinates}</div>
                          <div className="font-bold text-slate-900">
                            X: {alert.coordinates.x}m, Y: {alert.coordinates.y}m
                          </div>
                        </div>

                        <div className="bg-white/90 p-2 rounded-xl border border-slate-200/80 text-[11px] font-mono">
                          <div className="text-slate-400 font-medium">{t.cardLidarHeight}</div>
                          <div className="font-bold text-blue-700">
                            {alert.lidarHeightCm} cm
                          </div>
                        </div>

                        <div className="bg-white/90 p-2 rounded-xl border border-slate-200/80 text-[11px] font-mono">
                          <div className="text-slate-400 font-medium">{t.cardThermal}</div>
                          <div className="font-bold text-rose-700 flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-rose-500" />
                            <span>{alert.thermalSignature}°C</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 font-semibold mr-1">Sensors:</span>
                        {alert.sensorTriggered.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex flex-col space-y-2 w-full lg:w-64 shrink-0 justify-center pt-2 lg:pt-0">
                      {isStranger && (
                        <button
                          type="button"
                          onClick={() => handleToggleSiren(alert.id)}
                          className={`w-full px-4 py-2.5 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
                            isSirenActive && alert.alarmTriggered
                              ? 'bg-amber-600 hover:bg-amber-700'
                              : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{isSirenActive && alert.alarmTriggered ? t.btnStopSiren : t.btnTriggerSiren}</span>
                        </button>
                      )}

                      {alert.status === 'unverified' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsFamily(alert)}
                          className="w-full px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center space-x-2 transition cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span>{t.btnMarkFamily}</span>
                        </button>
                      )}

                      {alert.status !== 'dismissed' && (
                        <button
                          type="button"
                          onClick={() => handleDismissAlert(alert.id)}
                          className="w-full px-4 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-white/60 rounded-xl transition text-center cursor-pointer"
                        >
                          {t.btnDismissFalse}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. MODAL: ENROLL NEW FACE PROFILE */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{t.modalEnrollTitle}</h3>
                  <p className="text-xs text-slate-500 font-medium">{t.modalEnrollDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.inputFullName}</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    placeholder={t.inputFullNamePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.selectRelationship}</label>
                  <select
                    value={enrollForm.relationship}
                    onChange={(e) => setEnrollForm({ ...enrollForm, relationship: e.target.value as FaceProfile['relationship'] })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="spouse">{t.relSpouse}</option>
                    <option value="child">{t.relChild}</option>
                    <option value="relative">{t.relRelative}</option>
                    <option value="owner">{t.relOwner}</option>
                    <option value="guest">{t.relGuest}</option>
                    <option value="staff">{t.relStaff}</option>
                  </select>
                </div>
              </div>

              {/* 3-Angle Photos Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Scan className="w-4 h-4 text-blue-600" />
                    <span>{t.uploadAnglesTitle}</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    512-D MobileNet / FaceNet
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Front Angle */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-xl bg-slate-200 overflow-hidden relative group">
                      <img src={enrollForm.frontPhoto} alt="Front View" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">{t.angleFront}</div>
                    <span className="inline-block text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Ready
                    </span>
                  </div>

                  {/* Left Angle */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-xl bg-slate-200 overflow-hidden relative group">
                      <img src={enrollForm.leftPhoto} alt="Left View" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">{t.angleLeft}</div>
                    <span className="inline-block text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Ready
                    </span>
                  </div>

                  {/* Right Angle */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-xl bg-slate-200 overflow-hidden relative group">
                      <img src={enrollForm.rightPhoto} alt="Right View" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">{t.angleRight}</div>
                    <span className="inline-block text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Extraction Progress Bar (Simulated) */}
              {isExtracting && (
                <div className="space-y-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between text-xs font-mono text-blue-900 font-bold">
                    <span>{t.extractingProgress}</span>
                    <span>{extractProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${extractProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => showToast(lang === 'vi' ? 'Đã yêu cầu robot chụp ảnh trực tiếp 4K...' : 'Capturing 3 angles directly from robot RealSense camera...')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>{t.btnUseLiveCamera}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    {lang === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isExtracting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>{t.btnExtractEmbeddings}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: MARK STRANGER AS FAMILY MEMBER */}
      {convertingAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {lang === 'vi' ? 'Thêm Kẻ Lạ Vào Danh Sách Người Thân' : 'Enroll Stranger Into Family Whitelist'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'vi' ? 'Lưu trữ embedding khuôn mặt đã chụp để robot nhận diện' : 'Save cropped face tensor into authorized whitelist'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConvertingAlert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={convertingAlert.croppedFaceUrl}
                alt="Face crop"
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500 shadow-sm shrink-0"
              />
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900">
                  {lang === 'vi' ? convertingAlert.titleVI : convertingAlert.titleEN}
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  {convertingAlert.timestamp} • {lang === 'vi' ? convertingAlert.locationVI : convertingAlert.locationEN}
                </div>
                <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-mono font-bold">
                  NPU Vector Hash Ready
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">{t.inputFullName}</label>
                <input
                  type="text"
                  value={convertName}
                  onChange={(e) => setConvertName(e.target.value)}
                  placeholder="e.g. Grandma Helen"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">{t.selectRelationship}</label>
                <select
                  value={convertRelationship}
                  onChange={(e) => setConvertRelationship(e.target.value as FaceProfile['relationship'])}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="spouse">{t.relSpouse}</option>
                  <option value="child">{t.relChild}</option>
                  <option value="relative">{t.relRelative}</option>
                  <option value="guest">{t.relGuest}</option>
                  <option value="staff">{t.relStaff}</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setConvertingAlert(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                {lang === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmConvert}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Lưu Vào Whitelist Gia Đình' : 'Save to Family Whitelist'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: 512D VECTOR EMBEDDING INSPECTOR */}
      {isInspectModalOpen && selectedProfileForInspect && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] text-white rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {lang === 'vi' ? 'Ma Trận Vector 512-D NPU' : 'NPU 512-D Embedding Matrix'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Profile: {selectedProfileForInspect.name} (SHA-256 Hash Locked)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInspectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview Bar */}
            <div className="flex items-center space-x-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <img
                src={selectedProfileForInspect.avatarUrl}
                alt={selectedProfileForInspect.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-sky-400 shrink-0"
              />
              <div className="text-xs font-mono space-y-0.5">
                <div className="text-white font-bold">{selectedProfileForInspect.name}</div>
                <div className="text-emerald-400">Match Confidence: {selectedProfileForInspect.matchConfidence}%</div>
                <div className="text-slate-400">Dim: 512 Floating Point (FP16 quantized)</div>
              </div>
            </div>

            {/* Heatmap Visualization Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Vector Heatmap Tensor (64x8)</span>
                <span className="text-sky-400 font-bold">L2 Norm: 1.000</span>
              </div>
              <div className="grid grid-cols-16 gap-1 p-2 bg-slate-950 rounded-xl border border-slate-800">
                {Array.from({ length: 64 }).map((_, i) => {
                  const val = ((i * 37 + (selectedProfileForInspect.name.length * 13)) % 100) / 100;
                  return (
                    <div
                      key={i}
                      title={`dim_${i}: ${val.toFixed(4)}`}
                      className="h-4 rounded-xs transition-colors"
                      style={{
                        backgroundColor: val > 0.7 ? '#38bdf8' : val > 0.4 ? '#3b82f6' : val > 0.2 ? '#1e3a8a' : '#0f172a'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Raw Vector Dump Snippet */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
              <div className="text-slate-500">// Sample Floating Point Values:</div>
              <div className="text-sky-300 break-all leading-relaxed">
                [+0.0421, -0.1983, +0.8841, -0.0092, +0.3129, -0.5401, +0.7712, +0.1209, -0.0452, +0.6621, -0.3290, +0.0128, +0.4419, ...]
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                Algorithm: FaceNet-v2 (NPU Edge-Trained)
              </span>
              <button
                type="button"
                onClick={() => setIsInspectModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
