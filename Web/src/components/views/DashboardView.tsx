import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertOctagon, 
  ShieldCheck, 
  Eye, 
  Radar, 
  Thermometer, 
  Volume2, 
  Wind, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Radio,
  MapPin
} from 'lucide-react';
import { Language, RobotTelemetry, SecurityIncident } from '../../types';
import { translations } from '../../i18n/translations';

interface DashboardViewProps {
  lang: Language;
  telemetry: RobotTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<RobotTelemetry>>;
  onOpenIncident: (incident: SecurityIncident) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  telemetry,
  setTelemetry
}) => {
  const t = translations[lang];
  const [teleopSpeed, setTeleopSpeed] = useState<number>(0.3);
  const [activePreset, setActivePreset] = useState<string>('living_room');
  const [aiOverlay, setAiOverlay] = useState<boolean>(true);

  const handleTogglePatrol = () => {
    setTelemetry(prev => ({
      ...prev,
      mode: prev.mode === 'patrol' ? 'idle' : 'patrol',
      isDocked: false,
      isCharging: false
    }));
  };

  const handleReturnDock = () => {
    setTelemetry(prev => ({
      ...prev,
      mode: 'docking',
      currentZone: lang === 'vi' ? 'Trạm sạc Docking Station' : 'Docking Station'
    }));
    setTimeout(() => {
      setTelemetry(prev => ({
        ...prev,
        mode: 'charging',
        isDocked: true,
        isCharging: true
      }));
    }, 2000);
  };

  const handleEmergencyStop = () => {
    setTelemetry(prev => ({
      ...prev,
      mode: 'idle',
      speed: 0
    }));
  };

  const handleJoystickMove = (direction: string) => {
    setTelemetry(prev => ({
      ...prev,
      mode: 'manual',
      isDocked: false,
      speed: teleopSpeed
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Quick Control & Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Patrol Action */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'vi' ? 'Trạng thái Tuần tra' : 'Patrol State'}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              telemetry.mode === 'patrol' 
                ? 'bg-blue-100 text-blue-700' 
                : telemetry.mode === 'charging'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
            }`}>
              {telemetry.mode.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {telemetry.mode === 'patrol' 
                  ? (lang === 'vi' ? 'Đang tự hành' : 'Autonomous Patrol')
                  : telemetry.mode === 'charging'
                    ? (lang === 'vi' ? 'Đang nạp năng lượng' : 'Recharging on Dock')
                    : (lang === 'vi' ? 'Sẵn sàng lệnh' : 'Standby / Ready')}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                📍 {telemetry.currentZone}
              </div>
            </div>
            <button
              onClick={handleTogglePatrol}
              className={`p-3 rounded-xl transition shadow-xs cursor-pointer ${
                telemetry.mode === 'patrol'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {telemetry.mode === 'patrol' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Card 2: Docking Dispatch */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'vi' ? 'Trạm Sạc Thông Minh' : 'Autonomous Dock'}
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {telemetry.battery}% ({telemetry.isDocked ? 'Docked' : 'Un-docked'})
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {telemetry.isCharging ? '54.6V • 4.2A Fast Charge' : 'Est. 4.8h runtime'}
              </div>
            </div>
            <button
              onClick={handleReturnDock}
              disabled={telemetry.isDocked}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-40"
            >
              {t.returnDock}
            </button>
          </div>
        </div>

        {/* Card 3: ROS2 Edge Telemetry */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ROS2 Galactic Edge
            </span>
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {telemetry.activeNodeCount} Nodes Active
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                CPU: {telemetry.cpuUsage}% • RAM: {telemetry.ramUsage}%
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
              99.98% SLA
            </span>
          </div>
        </div>

        {/* Card 4: Emergency Stop */}
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              {lang === 'vi' ? 'An Toàn Cơ Khí' : 'Hardware Safety'}
            </span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-red-900">
                {lang === 'vi' ? 'Khóa Động Cơ Khẩn' : 'Brake E-Stop'}
              </div>
              <div className="text-[11px] text-red-600 font-medium mt-0.5">
                {lang === 'vi' ? 'Ngắt lực kéo ngay' : 'Instant Torque Cutoff'}
              </div>
            </div>
            <button
              onClick={handleEmergencyStop}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition shadow-xs cursor-pointer"
            >
              {t.emergencyStop}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Live Vision Patrol & Teleop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Camera Stream with Neural AI Bounding Boxes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'vi' ? 'Luồng Camera Tuần tra Trực tiếp 4K' : 'Live 4K Autonomous Patrol Feed'}
              </h2>
              <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                30 FPS • H.265
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAiOverlay(!aiOverlay)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  aiOverlay 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                AI Bounding Box: {aiOverlay ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Video Stream Container Simulation */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800">
            {/* Live Camera Backdrop (Modern Smart Living Room Patrol) */}
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80"
              alt="Live Patrol Feed"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Scanline Animation */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-16 w-full animate-scan" />

            {/* AI Bounding Boxes Overlay */}
            {aiOverlay && (
              <>
                {/* Detected Person 1 */}
                <div className="absolute top-16 left-28 w-44 h-72 border-2 border-emerald-400 rounded-lg pointer-events-none shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                  <div className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-t-sm flex items-center justify-between">
                    <span>PERSON #1</span>
                    <span>98.6%</span>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-slate-950/80 backdrop-blur-xs text-emerald-300 text-[9px] font-mono px-1 rounded">
                    DIST: 2.14m • AUTH VIP
                  </div>
                </div>

                {/* Detected Pet */}
                <div className="absolute bottom-12 right-36 w-32 h-28 border-2 border-sky-400 rounded-lg pointer-events-none shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                  <div className="bg-sky-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-t-sm flex items-center justify-between">
                    <span>DOMESTIC PET</span>
                    <span>94.2%</span>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-slate-950/80 backdrop-blur-xs text-sky-300 text-[9px] font-mono px-1 rounded">
                    GOLDEN RETRIEVER
                  </div>
                </div>
              </>
            )}

            {/* Camera OSD Overlays */}
            <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[11px] font-mono">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>REC • 00:42:19</span>
            </div>

            <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-emerald-400 text-[11px] font-mono font-bold">
              SLAM POSE: X: 4.12 Y: 8.94 θ: 124°
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 text-[11px] font-mono">
              LiDAR: 18,400 pts/s • SPEED: {telemetry.speed.toFixed(2)} m/s
            </div>
          </div>

          {/* Quick Patrol Route Dispatch Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xs font-bold text-slate-600">
              {lang === 'vi' ? 'Điều hướng nhanh tuyến:' : 'Quick Route Dispatch:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'living_room', labelVI: 'Phòng khách (Khu A)', labelEN: 'Living Room (Zone A)' },
                { id: 'kitchen', labelVI: 'Bếp ăn & Ban công', labelEN: 'Kitchen & Balcony' },
                { id: 'perimeter', labelVI: 'Tuần tra toàn bộ chu vi', labelEN: 'Full Perimeter Sweep' }
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset.id);
                    setTelemetry(prev => ({
                      ...prev,
                      mode: 'patrol',
                      currentZone: lang === 'vi' ? preset.labelVI : preset.labelEN
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    activePreset === preset.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📍 {lang === 'vi' ? preset.labelVI : preset.labelEN}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: LiDAR Mini-Radar & Virtual Teleop Joystick */}
        <div className="space-y-6">
          {/* LiDAR Radar Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Radar className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {lang === 'vi' ? 'Bán Kính Quét LiDAR 360°' : 'LiDAR 360° Radar Field'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                25 Hz
              </span>
            </div>

            {/* Radar Circular Sweep Screen */}
            <div className="relative w-48 h-48 bg-slate-950 rounded-full border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-inner my-2">
              <div className="absolute inset-4 rounded-full border border-sky-500/20" />
              <div className="absolute inset-10 rounded-full border border-sky-500/30" />
              <div className="absolute inset-16 rounded-full border border-sky-500/40" />

              {/* Crosshair grid lines */}
              <div className="absolute w-full h-[1px] bg-sky-500/30" />
              <div className="absolute h-full w-[1px] bg-sky-500/30" />

              {/* Rotating Sweep Beam */}
              <div className="absolute inset-0 rounded-full animate-radar pointer-events-none">
                <div 
                  className="w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.4) 0deg, transparent 60deg)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  }}
                />
              </div>

              {/* Robot Center Marker */}
              <div className="relative z-10 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>

              {/* Target obstacles */}
              <span className="absolute top-8 left-12 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute bottom-10 right-10 w-2 h-2 bg-amber-400 rounded-full" />
            </div>

            <div className="w-full flex justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
              <span>{lang === 'vi' ? 'Vật cản gần nhất:' : 'Nearest Obstacle:'}</span>
              <span className="font-mono text-slate-800 font-bold">0.82 m (SAFE)</span>
            </div>
          </div>

          {/* Virtual Teleop Joystick */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.manualTeleop}
              </h3>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Tốc độ:</span>
                <select 
                  value={teleopSpeed} 
                  onChange={(e) => setTeleopSpeed(Number(e.target.value))}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-800"
                >
                  <option value={0.2}>0.2 m/s</option>
                  <option value={0.3}>0.3 m/s</option>
                  <option value={0.5}>0.5 m/s</option>
                </select>
              </div>
            </div>

            {/* D-Pad Controller Controls */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <button
                onClick={() => handleJoystickMove('up')}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleJoystickMove('left')}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shadow-inner">
                  STOP
                </div>

                <button
                  onClick={() => handleJoystickMove('right')}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleJoystickMove('down')}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Environmental Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              {lang === 'vi' ? 'Nhiệt độ Môi trường' : 'Ambient Temperature'}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              24.8 °C <span className="text-xs font-medium text-emerald-600">Optimal</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              {lang === 'vi' ? 'Độ ồn Âm thanh Micro' : 'Acoustic Sound Level'}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              38 dB <span className="text-xs font-medium text-emerald-600">Quiet</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              {lang === 'vi' ? 'Chỉ số Không khí AQI' : 'Air Quality Index'}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              18 AQI <span className="text-xs font-medium text-emerald-600">Clean & Fresh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
