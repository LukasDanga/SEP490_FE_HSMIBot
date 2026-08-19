import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets, 
  ShieldAlert, 
  BellRing, 
  Radio, 
  Volume2, 
  VolumeX, 
  Video, 
  PhoneCall, 
  Navigation, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Square, 
  Cpu, 
  ChevronRight,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  Language, 
  FireSeverityLevel, 
  FireSeverityConfigItem, 
  EnvironmentSensorsLive, 
  FireIncidentHistoryItem 
} from '../../types';
import { translations } from '../../i18n/translations';

interface FireMatrixViewProps {
  lang: Language;
}

const INITIAL_SEVERITY_CONFIG: FireSeverityConfigItem[] = [
  {
    id: 'level_1',
    levelNumber: 1,
    nameVI: 'CẤP ĐỘ 1: CẢNH BÁO NHIỆT ĐỘ CAO (HEAT SPIKE)',
    nameEN: 'LEVEL 1: WARNING - HIGH TEMPERATURE (HEAT SPIKE)',
    tagVI: 'Nhiệt độ tăng bất thường / Tiền nguy cơ',
    tagEN: 'Thermal Anomaly / Pre-Hazard Stage',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    tempMin: 40,
    tempMax: 55,
    smokePpmMin: 50,
    smokePpmMax: 200,
    flameSensorRequired: false,
    pollingIntervalMs: 500,
    enableTts: true,
    ttsMessageVI: 'Cảnh báo: Phát hiện nhiệt độ cao bất thường tại khu vực Bếp.',
    ttsMessageEN: 'Warning: High temperature detected in Kitchen area.',
    enableBeacon: false,
    beaconMode: 'off',
    enableLiveStreamRecord: false,
    recordDurationSeconds: 15,
    enableBuzzer: false,
    buzzerDecibel: 60,
    enablePushNotification: true,
    enableEmergencySmsCall: false,
    enableMapCoordBroadcast: true,
    enableAutonomousEvac: false,
    evacTarget: 'stay_and_monitor'
  },
  {
    id: 'level_2',
    levelNumber: 2,
    nameVI: 'CẤP ĐỘ 2: BÁO ĐỘNG KHÓI ÂM ĐỘNG (SMOLDERING SMOKE)',
    nameEN: 'LEVEL 2: ALERT - SMOLDERING SMOKE (PRE-COMBUSTION)',
    tagVI: 'Khói âm ỉ / Tiền bốc cháy (Pre-Combustion)',
    tagEN: 'Smoldering Smoke / Pre-Combustion',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    tempMin: 55,
    tempMax: 70,
    smokePpmMin: 200,
    smokePpmMax: 500,
    flameSensorRequired: false,
    pollingIntervalMs: 250,
    enableTts: true,
    ttsMessageVI: 'Báo động: Phát hiện nồng độ khói âm ỉ vượt ngưỡng an toàn!',
    ttsMessageEN: 'Alert: Smoldering smoke gas detected above safety baseline!',
    enableBeacon: true,
    beaconMode: 'yellow_strobe',
    enableLiveStreamRecord: true,
    recordDurationSeconds: 30,
    enableBuzzer: false,
    buzzerDecibel: 75,
    enablePushNotification: true,
    enableEmergencySmsCall: false,
    enableMapCoordBroadcast: true,
    enableAutonomousEvac: false,
    evacTarget: 'safe_distance'
  },
  {
    id: 'level_3',
    levelNumber: 3,
    nameVI: 'CẤP ĐỘ 3: NGUY CẤP - PHÁT HIỆN NGỌN LỬA HOẠT ĐỘNG (ACTIVE FLAME)',
    nameEN: 'LEVEL 3: CRITICAL - ACTIVE FLAME DETECTED',
    tagVI: 'Cháy thực tế / Ngọn lửa quang học',
    tagEN: 'Active Combustion / Optical Flame',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    badgeClass: 'bg-red-100 text-red-800 border-red-400 font-bold',
    tempMin: 70,
    tempMax: 95,
    smokePpmMin: 500,
    smokePpmMax: 1000,
    flameSensorRequired: true,
    pollingIntervalMs: 100,
    enableTts: true,
    ttsMessageVI: 'NGUY HIỂM! Phát hiện ngọn lửa đang bốc cháy! Đang kích hoạt còi báo động.',
    ttsMessageEN: 'CRITICAL! Active flame detected! Activating emergency siren and dispatcher.',
    enableBeacon: true,
    beaconMode: 'red_pulse',
    enableLiveStreamRecord: true,
    recordDurationSeconds: 60,
    enableBuzzer: true,
    buzzerDecibel: 85,
    enablePushNotification: true,
    enableEmergencySmsCall: true,
    enableMapCoordBroadcast: true,
    enableAutonomousEvac: true,
    evacTarget: 'safe_distance'
  },
  {
    id: 'level_4',
    levelNumber: 4,
    nameVI: 'CẤP ĐỘ 4: KHẨN CẤP SƠ TÁN (THERMAL RUNAWAY & THREAT)',
    nameEN: 'LEVEL 4: EMERGENCY EVACUATION (THERMAL RUNAWAY & THREAT)',
    tagVI: 'Cháy lan rộng / Nguy cơ sập đổ cấu trúc',
    tagEN: 'Rapid Flame Spread / Structural Threat',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-400 font-extrabold',
    tempMin: 95,
    tempMax: 150,
    smokePpmMin: 1000,
    smokePpmMax: 5000,
    flameSensorRequired: true,
    rateOfRiseDegPerMin: 5.0,
    pollingIntervalMs: 100,
    enableTts: true,
    ttsMessageVI: 'CHÁY KHẨN CẤP! TẤT CẢ SƠ TÁN NGAY LẬP TỨC! THEO ROBOT RA LỐI THOÁT HIỂM!',
    ttsMessageEN: 'FIRE EMERGENCY! EVACUATE IMMEDIATELY! FOLLOW ROBOT TO NEAREST EXIT!',
    enableBeacon: true,
    beaconMode: 'emergency_flashing',
    enableLiveStreamRecord: true,
    recordDurationSeconds: 120,
    enableBuzzer: true,
    buzzerDecibel: 90,
    enablePushNotification: true,
    enableEmergencySmsCall: true,
    enableMapCoordBroadcast: true,
    enableAutonomousEvac: true,
    evacTarget: 'nearest_fire_exit'
  }
];

const INITIAL_SENSORS: EnvironmentSensorsLive = {
  ambientTemp: 27.4,
  tempStatus: 'normal',
  smokePpm: 110,
  smokeStatus: 'safe',
  opticalFlameDetected: false,
  flameStatus: 'safe',
  flameWavelengthNm: '760nm - 1100nm',
  humidityRh: 55,
  humidityStatus: 'optimal',
  dewPoint: 17.8,
  coPpm: 4.2,
  lpgPpm: 8.5,
  lastUpdated: '1s ago (ROS2 Topic: /sensors/environment)'
};

const INITIAL_HISTORY: FireIncidentHistoryItem[] = [
  {
    id: 'inc_fire_01',
    timestamp: '14:18:22 Hôm nay',
    zoneVI: 'Khu vực Bếp & Đảo nấu (Zone B)',
    zoneEN: 'Kitchen Cooking Island (Zone B)',
    level: 'level_1',
    levelLabelVI: 'Cấp 1 - Nhiệt độ cao (48.5°C)',
    levelLabelEN: 'Level 1 - Heat Spike (48.5°C)',
    tempRecorded: 48.5,
    smokePpmRecorded: 145,
    flameSensorValue: false,
    actionsExecutedVI: ['Di chuyển đến bếp', 'Chụp ảnh nhiệt snapshot', 'Phát TTS cảnh báo', 'Gửi Push Notification'],
    actionsExecutedEN: ['Navigated to kitchen', 'Captured thermal snapshot', 'Spoke TTS alert', 'Sent push notification'],
    status: 'resolved'
  },
  {
    id: 'inc_fire_02',
    timestamp: 'Hôm qua 19:45:10',
    zoneVI: 'Khu vực Ban công & Nướng BBQ',
    zoneEN: 'Balcony BBQ Area',
    level: 'level_2',
    levelLabelVI: 'Cấp 2 - Khói âm ỉ (280 ppm)',
    levelLabelEN: 'Level 2 - Smoldering Smoke (280 ppm)',
    tempRecorded: 58.2,
    smokePpmRecorded: 280,
    flameSensorValue: false,
    actionsExecutedVI: ['Bật LED vàng chớp', 'Ghi video 30s', 'Truyền WebRTC Live Stream', 'Gửi cảnh báo khẩn cấp'],
    actionsExecutedEN: ['Flash yellow LED beacon', 'Record 30s video', 'Stream WebRTC camera', 'High-priority push alert'],
    status: 'resolved'
  },
  {
    id: 'inc_fire_03',
    timestamp: '10/08/2026 11:20:05',
    zoneVI: 'Phòng Khách - Cửa sổ Hướng Tây',
    zoneEN: 'Living Room - West Window',
    level: 'level_1',
    levelLabelVI: 'Cấp 1 - Tăng nhiệt ánh nắng (42.0°C)',
    levelLabelEN: 'Level 1 - Solar Heat Glare (42.0°C)',
    tempRecorded: 42.0,
    smokePpmRecorded: 95,
    flameSensorValue: false,
    actionsExecutedVI: ['Xác nhận nguồn nhiệt mặt trời', 'Giải tỏa cảnh báo'],
    actionsExecutedEN: ['Verified solar glare heat', 'Auto-cleared false alarm'],
    status: 'resolved'
  }
];

// Telemetry 24-Hour Datapoints for SVG Chart
const TELEMETRY_24H = [
  { time: '00:00', temp: 24.1, smoke: 85 },
  { time: '02:00', temp: 23.8, smoke: 80 },
  { time: '04:00', temp: 23.5, smoke: 82 },
  { time: '06:00', temp: 24.5, smoke: 90 },
  { time: '08:00', temp: 26.2, smoke: 105 },
  { time: '10:00', temp: 27.0, smoke: 112 },
  { time: '12:00', temp: 28.5, smoke: 120 },
  { time: '14:00', temp: 48.5, smoke: 145 }, // Heat Spike Event
  { time: '16:00', temp: 28.1, smoke: 115 },
  { time: '18:00', temp: 27.8, smoke: 110 },
  { time: '20:00', temp: 26.9, smoke: 108 },
  { time: '22:00', temp: 25.4, smoke: 95 },
  { time: 'Now', temp: 27.4, smoke: 110 }
];

export const FireMatrixView: React.FC<FireMatrixViewProps> = ({ lang }) => {
  const t = translations[lang];

  // State
  const [sensors] = useState<EnvironmentSensorsLive>(INITIAL_SENSORS);
  const [severityConfigs, setSeverityConfigs] = useState<FireSeverityConfigItem[]>(INITIAL_SEVERITY_CONFIG);
  const [activeTabLevel, setActiveTabLevel] = useState<FireSeverityLevel>('level_1');
  const [incidentHistory, setIncidentHistory] = useState<FireIncidentHistoryItem[]>(INITIAL_HISTORY);
  
  // UI & Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatingLevel, setSimulatingLevel] = useState<FireSeverityLevel | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  
  // Audio synthesis reference for simulated buzzer / siren
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const activeConfig = severityConfigs.find(c => c.id === activeTabLevel) || severityConfigs[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Audio tone generator for simulations
  const playBuzzerTone = (frequency = 900, isPulsing = false) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isPulsing ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      if (isPulsing) {
        // Pulse sound
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.6);
      } else {
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
    } catch {
      // Audio context might fail on gesture policy
    }
  };

  const stopBuzzerTone = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    return () => {
      stopBuzzerTone();
    };
  }, []);

  // Update a single config field
  const handleConfigChange = <K extends keyof FireSeverityConfigItem>(
    levelId: FireSeverityLevel,
    field: K,
    value: FireSeverityConfigItem[K]
  ) => {
    setSeverityConfigs(prev =>
      prev.map(item => (item.id === levelId ? { ...item, [field]: value } : item))
    );
  };

  // Save & Sync CTA
  const handleSaveAndSync = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(t.matrixSyncSuccess);
    }, 1200);
  };

  // Reset to default ISO
  const handleResetDefaults = () => {
    setSeverityConfigs(INITIAL_SEVERITY_CONFIG);
    showToast(lang === 'vi' ? 'Đã khôi phục ma trận ngưỡng theo chuẩn PCCC ISO 7240 / NFPA 72.' : 'Restored fire severity matrix to ISO 7240 / NFPA 72 defaults.');
  };

  // Start Simulation for selected Level
  const handleStartSimulation = (levelId: FireSeverityLevel) => {
    if (simulatingLevel === levelId) {
      // Stop simulation
      setSimulatingLevel(null);
      stopBuzzerTone();
      setSimulationLog([]);
      showToast(lang === 'vi' ? 'Đã dừng thử nghiệm mô phỏng.' : 'Simulation stopped.');
      return;
    }

    setSimulatingLevel(levelId);
    const targetConfig = severityConfigs.find(c => c.id === levelId)!;

    if (targetConfig.enableBuzzer) {
      playBuzzerTone(levelId === 'level_4' ? 1200 : 900, true);
    } else {
      stopBuzzerTone();
    }

    // Generate dynamic logs
    const logs: string[] = [
      `[ROS2] Trigger simulation packet sent to node /fire_matrix_evaluator`,
      `[BEHAVIOR_TREE] Condition breached: Level ${targetConfig.levelNumber} (${targetConfig.nameEN})`,
      `[ACTION] TTS Engine: "${lang === 'vi' ? targetConfig.ttsMessageVI : targetConfig.ttsMessageEN}"`,
      targetConfig.enableBeacon ? `[HARDWARE] Beacon strobe engaged (${targetConfig.beaconMode})` : '[HARDWARE] Beacon: OFF',
      targetConfig.enableBuzzer ? `[HARDWARE] Onboard Buzzer active (${targetConfig.buzzerDecibel} dB)` : '[HARDWARE] Buzzer: OFF',
      targetConfig.enableLiveStreamRecord ? `[CAMERA] 4K Video recording initiated (${targetConfig.recordDurationSeconds}s)` : '[CAMERA] Recording: OFF',
      targetConfig.enableAutonomousEvac ? `[NAV2] Path planning target: ${targetConfig.evacTarget.toUpperCase()}` : '[NAV2] Move to site & observe'
    ];
    setSimulationLog(logs);

    // Also add to incident history for realism
    const newIncident: FireIncidentHistoryItem = {
      id: `sim_${Date.now()}`,
      timestamp: 'Vừa xong (Thử nghiệm)',
      zoneVI: 'Khu vực Thử Nghiệm Mô Phỏng',
      zoneEN: 'Simulation Test Zone',
      level: levelId,
      levelLabelVI: targetConfig.nameVI,
      levelLabelEN: targetConfig.nameEN,
      tempRecorded: targetConfig.tempMin + 3.5,
      smokePpmRecorded: targetConfig.smokePpmMin + 45,
      flameSensorValue: targetConfig.flameSensorRequired,
      actionsExecutedVI: [
        targetConfig.enableTts ? 'Phát TTS cảnh báo' : 'TTS tắt',
        targetConfig.enableBeacon ? 'Bật LED chớp' : 'LED tắt',
        targetConfig.enableBuzzer ? `Còi hú ${targetConfig.buzzerDecibel}dB` : 'Còi tắt',
        targetConfig.enableAutonomousEvac ? 'Dẫn đường sơ tán' : 'Duy trì vị trí'
      ],
      actionsExecutedEN: [
        targetConfig.enableTts ? 'Spoke TTS alert' : 'TTS disabled',
        targetConfig.enableBeacon ? 'Beacon flashing' : 'Beacon disabled',
        targetConfig.enableBuzzer ? `Buzzer ${targetConfig.buzzerDecibel}dB` : 'Buzzer disabled',
        targetConfig.enableAutonomousEvac ? 'Evac pathfinding' : 'Hold position'
      ],
      status: 'resolved'
    };
    setIncidentHistory(prev => [newIncident, ...prev]);

    showToast(`${t.matrixTestingNotice} (${targetConfig.levelNumber})`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* ACTIVE SIMULATION BANNER */}
      {simulatingLevel && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-red-500 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white animate-pulse">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-red-600 text-white uppercase">
                    SIMULATION ACTIVE
                  </span>
                  <span className="font-extrabold text-sm text-amber-300">
                    {severityConfigs.find(c => c.id === simulatingLevel)?.nameEN}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  ROS2 Butler Behavior Tree is executing multi-action hazard pipeline in test harness.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleStartSimulation(simulatingLevel)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer shadow-md"
            >
              <Square className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Dừng Thử Nghiệm' : 'Stop Simulation'}</span>
            </button>
          </div>

          {/* Real-time simulation event stream */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
            {simulationLog.map((log, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-emerald-400">❯</span>
                <span className={log.includes('CRITICAL') || log.includes('EMERGENCY') ? 'text-red-400 font-bold' : log.includes('ACTION') ? 'text-amber-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER TITLE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{t.fireHubTitle}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-300">
                4-STAGE MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.fireHubSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Chuẩn ISO 7240' : 'ISO Standard Defaults'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndSync}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/25 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Syncing ROS2...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.btnSaveAndSyncMatrix}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME ENVIRONMENT SENSOR TELEMETRY (TOP 4 METRICS CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Ambient Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700">{t.envCardTempTitle}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{t.envCardTempDesc}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t.sensorStatusNormal}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {sensors.ambientTemp}
              <span className="text-base font-bold text-slate-500 ml-1">°C</span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>Min: 21.8°C</div>
              <div>Max: 28.5°C</div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center space-x-1 text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Stable (+0.2°C/hr)</span>
            </div>
            <span className="text-slate-400">IR Focal: 100%</span>
          </div>
        </div>

        {/* Card 2: Smoke Gas Concentration (MQ-2 Sensor) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-2xs">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700">{t.envCardSmokeTitle}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{t.envCardSmokeDesc}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t.sensorStatusSafe}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {sensors.smokePpm}
              <span className="text-base font-bold text-slate-500 ml-1">ppm</span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>CO: {sensors.coPpm} ppm</div>
              <div>LPG: {sensors.lpgPpm} ppm</div>
            </div>
          </div>

          {/* Progress gauge */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Threshold: 200 ppm</span>
              <span>110 / 2000 ppm</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>

        {/* Card 3: Optical Flame Sensor (IR Flame) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700">{t.envCardFlameTitle}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{t.envCardFlameDesc}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t.sensorStatusNoFlame}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl font-black text-emerald-700 tracking-tight flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>0 (LOW)</span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>Latency: 15ms</div>
              <div>Filter: Kalman</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Spectrum: 760-1100nm</span>
            <span className="text-emerald-600 font-bold">100% Blind-Spot Free</span>
          </div>
        </div>

        {/* Card 4: Relative Humidity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700">{t.envCardHumidityTitle}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{t.envCardHumidityDesc}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t.sensorStatusOptimal}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {sensors.humidityRh}
              <span className="text-base font-bold text-slate-500 ml-1">% RH</span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>Dew Point: {sensors.dewPoint}°C</div>
              <div>VPD: 1.1 kPa</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Combustion Risk:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">VERY LOW</span>
          </div>
        </div>

      </div>

      {/* 2. CORE ADMIN FEATURE: DETAILED MULTI-LEVEL FIRE SEVERITY CONFIGURATION MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">{t.matrixSectionTitle}</h2>
              <p className="text-xs text-slate-500 font-medium">{t.matrixSectionSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">ROS2 Behavior Node:</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              /fire_decision_engine: ACTIVE
            </span>
          </div>
        </div>

        {/* 4 Levels Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {severityConfigs.map((cfg) => {
            const isSelected = activeTabLevel === cfg.id;
            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => setActiveTabLevel(cfg.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? `${cfg.bgColor} ${cfg.borderColor} ring-2 ring-blue-500 shadow-md`
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono uppercase tracking-wider ${cfg.badgeClass}`}>
                    LEVEL {cfg.levelNumber}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {lang === 'vi' ? cfg.nameVI : cfg.nameEN}
                </h4>
                
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {lang === 'vi' ? cfg.tagVI : cfg.tagEN}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <span>Temp: {cfg.tempMin}°C - {cfg.tempMax}°C</span>
                  <span className="font-bold text-slate-800">Smoke: &gt;{cfg.smokePpmMin}ppm</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Level Configuration Card */}
        <div className={`p-6 rounded-3xl border-2 ${activeConfig.borderColor} ${activeConfig.bgColor} space-y-6 shadow-sm`}>
          
          {/* Level Header & Simulation Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono uppercase ${activeConfig.badgeClass}`}>
                  LEVEL {activeConfig.levelNumber} CONFIGURATION
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {lang === 'vi' ? activeConfig.nameVI : activeConfig.nameEN}
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {lang === 'vi' ? activeConfig.tagVI : activeConfig.tagEN}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleStartSimulation(activeConfig.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-md cursor-pointer ${
                  simulatingLevel === activeConfig.id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {simulatingLevel === activeConfig.id ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Dừng Thử Nghiệm' : 'Stop Test'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t.btnTestSimulateLevel}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trigger Condition Matrix & Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Trigger Thresholds & Sliders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900">
                  <Thermometer className="w-4 h-4 text-orange-600" />
                  <span>1. Trigger Thresholds (Điều Kiện Kích Hoạt)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">ROS2 Parameters</span>
              </div>

              {/* Slider 1: Temperature (°C) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <label>{t.sliderTempThreshold}</label>
                  <span className="font-mono text-orange-600 font-extrabold">{activeConfig.tempMin}°C - {activeConfig.tempMax}°C</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="1"
                  value={activeConfig.tempMin}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'tempMin', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>30°C (Ambient)</span>
                  <span>55°C (Warm)</span>
                  <span>70°C (Fire)</span>
                  <span>120°C (Extreme)</span>
                </div>
              </div>

              {/* Slider 2: Smoke PPM */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <label>{t.sliderSmokeThreshold}</label>
                  <span className="font-mono text-sky-600 font-extrabold">{activeConfig.smokePpmMin} ppm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={activeConfig.smokePpmMin}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'smokePpmMin', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>50 ppm</span>
                  <span>200 ppm (Smolder)</span>
                  <span>500 ppm (Flame)</span>
                  <span>1500 ppm (Dense)</span>
                </div>
              </div>

              {/* Slider 3: Polling Interval */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <label>{t.sliderPollingInterval}</label>
                  <span className="font-mono text-indigo-600 font-extrabold">{activeConfig.pollingIntervalMs} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={activeConfig.pollingIntervalMs}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'pollingIntervalMs', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>100 ms (Fast Sweep)</span>
                  <span>500 ms (Balanced)</span>
                  <span>2000 ms (Eco)</span>
                </div>
              </div>

              {/* Toggle: Flame Sensor Required */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleFlameSensorRequired}</div>
                    <div className="text-[10px] text-slate-500">Optical 760-1100nm IR spectrum validation</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.flameSensorRequired}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'flameSensorRequired', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

              {/* Rate of rise indicator */}
              {activeConfig.id === 'level_4' && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-900">{t.sliderRateOfRise}</div>
                    <div className="text-[10px] text-purple-700">Triggers if temperature spikes rapidly</div>
                  </div>
                  <span className="px-2 py-1 bg-purple-200 text-purple-900 font-mono font-bold text-xs rounded">
                    &gt; 5.0 °C / min
                  </span>
                </div>
              )}

            </div>

            {/* Right: Autonomous Robot Reactions & Action Toggles */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900">
                  <Radio className="w-4 h-4 text-blue-600" />
                  <span>2. Autonomous Robot Behavior Actions</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Nav2 / ROS2
                </span>
              </div>

              {/* Action 1: AI TTS Voice Broadcast */}
              <div className="p-3 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">{t.toggleTtsAlert}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeConfig.enableTts}
                    onChange={(e) => handleConfigChange(activeConfig.id, 'enableTts', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>
                {activeConfig.enableTts && (
                  <input
                    type="text"
                    value={lang === 'vi' ? activeConfig.ttsMessageVI : activeConfig.ttsMessageEN}
                    onChange={(e) => {
                      if (lang === 'vi') {
                        handleConfigChange(activeConfig.id, 'ttsMessageVI', e.target.value);
                      } else {
                        handleConfigChange(activeConfig.id, 'ttsMessageEN', e.target.value);
                      }
                    }}
                    placeholder="TTS Voice message..."
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Action 2: Warning LED Beacons / Strobe */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <BellRing className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleLedStrobe}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Mode: {activeConfig.beaconMode}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.enableBeacon}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'enableBeacon', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

              {/* Action 3: WebRTC Live Video & Record */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleLiveVideoRec}</div>
                    <div className="text-[10px] text-slate-500">Duration: {activeConfig.recordDurationSeconds}s cloud clip</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.enableLiveStreamRecord}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'enableLiveStreamRecord', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

              {/* Action 4: Loud Onboard Buzzer (85dB) */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleBuzzer85dB}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Output: {activeConfig.buzzerDecibel} dB SPL</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.enableBuzzer}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'enableBuzzer', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded cursor-pointer accent-red-600"
                />
              </div>

              {/* Action 5: Emergency SMS & Phone Call API */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleEmergencyCallSms}</div>
                    <div className="text-[10px] text-slate-500">Twilio / Webhook gateway dispatch</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.enableEmergencySmsCall}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'enableEmergencySmsCall', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

              {/* Action 6: Autonomous Evacuation Pathfinding */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.toggleAutoEvacuationNav}</div>
                    <div className="text-[10px] text-slate-500">SLAM Target: {activeConfig.evacTarget}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeConfig.enableAutonomousEvac}
                  onChange={(e) => handleConfigChange(activeConfig.id, 'enableAutonomousEvac', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 3. FIRE INCIDENT HISTORY & ENVIRONMENTAL SENSOR LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 24h Sensor Telemetry & Threshold Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{t.historyChartTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">{t.historyChartSubtitle}</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 font-bold">Temp (°C)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="text-slate-600 font-bold">Smoke (ppm/10)</span>
              </div>
            </div>
          </div>

          {/* SVG 24H Line Chart with Highlighted Threshold Lines */}
          <div className="relative w-full h-64 bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner">
            {/* Grid & Threshold Guidelines */}
            <div className="absolute inset-x-4 top-8 border-b border-red-500/40 flex justify-between text-[9px] font-mono text-red-400">
              <span>LEVEL 3 / 4 THRESHOLD (70°C / 500ppm)</span>
              <span>CRITICAL</span>
            </div>
            <div className="absolute inset-x-4 top-24 border-b border-orange-500/30 flex justify-between text-[9px] font-mono text-orange-400">
              <span>LEVEL 2 SMOLDERING (55°C / 200ppm)</span>
              <span>ALERT</span>
            </div>
            <div className="absolute inset-x-4 top-36 border-b border-amber-500/25 flex justify-between text-[9px] font-mono text-amber-400">
              <span>LEVEL 1 HEAT SPIKE (40°C)</span>
              <span>WARNING</span>
            </div>

            {/* SVG Wave */}
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Temp Area */}
              <polygon
                fill="url(#tempGradient)"
                points="
                  20,160 
                  60,162 
                  100,164 
                  140,158 
                  180,148 
                  220,140 
                  260,132 
                  300,55 
                  340,135 
                  380,138 
                  420,144 
                  460,152 
                  490,140 
                  490,190 
                  20,190
                "
              />

              {/* Temp Line (Orange) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  20,160 
                  60,162 
                  100,164 
                  140,158 
                  180,148 
                  220,140 
                  260,132 
                  300,55 
                  340,135 
                  380,138 
                  420,144 
                  460,152 
                  490,140
                "
              />

              {/* Smoke Line (Sky Blue) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  20,170 
                  60,172 
                  100,171 
                  140,168 
                  180,162 
                  220,160 
                  260,155 
                  300,115 
                  340,158 
                  380,160 
                  420,165 
                  460,168 
                  490,162
                "
              />

              {/* Spike event marker dot */}
              <circle cx="300" cy="55" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="260" y="42" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                14:18 Heat Spike 48.5°C
              </text>
            </svg>

            {/* Time labels on X-axis */}
            <div className="absolute inset-x-4 bottom-2 flex justify-between text-[9px] font-mono text-slate-500">
              {TELEMETRY_24H.filter((_, i) => i % 2 === 0).map((dp, i) => (
                <span key={i}>{dp.time}</span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'vi' ? 'Nhiệt độ hiện tại: 27.4°C • Khói: 110 ppm • Đang ghi nhận 100 mẫu/giây' : 'Current Temp: 27.4°C • Smoke: 110 ppm • Sampling 100 samples/sec'}</span>
            </div>
            <span className="text-emerald-700 font-bold">ALL SENSORS NORMAL</span>
          </div>
        </div>

        {/* Right 1 Col: Recent Incident Event Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">{t.tableSensorLogsTitle}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                {incidentHistory.length} logs
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Auto-recorded ROS2 hazard triggers</p>
          </div>

          {/* Event Cards List */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[290px] pr-1">
            {incidentHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 space-y-2 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-extrabold text-slate-900">
                      {lang === 'vi' ? item.levelLabelVI : item.levelLabelEN}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{lang === 'vi' ? item.zoneVI : item.zoneEN}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-1.5 rounded-lg border border-slate-200/60">
                  <div>Temp: <strong className="text-orange-600">{item.tempRecorded}°C</strong></div>
                  <div>Smoke: <strong className="text-sky-600">{item.smokePpmRecorded} ppm</strong></div>
                </div>

                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {(lang === 'vi' ? item.actionsExecutedVI : item.actionsExecutedEN).map((act, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => showToast(lang === 'vi' ? 'Đã xuất file log PCCC (.csv/.json) thành công!' : 'Exported fire telemetry log (.csv/.json) successfully!')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {lang === 'vi' ? 'Xuất Báo Cáo PCCC (CSV / JSON)' : 'Export Safety Audit Log (CSV/JSON)'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
