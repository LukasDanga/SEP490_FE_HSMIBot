import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Eye, 
  Wifi, 
  Radar, 
  MapPin, 
  Cpu, 
  Sparkles,
  Lock,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface LoginHeroProps {
  lang: Language;
}

export const LoginHero: React.FC<LoginHeroProps> = ({ lang }) => {
  const t = translations[lang];
  const [radarActive, setRadarActive] = useState<boolean>(true);
  const [activeSensors, setActiveSensors] = useState<number>(360);

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 p-10 xl:p-14 overflow-hidden select-none border-r border-slate-200">
      {/* Background Dot Matrix Pattern & Ambient Grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/60">
            {/* Robot Head Custom Icon */}
            <div className="relative flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                {t.brandName}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                PRO 4.2
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium max-w-sm mt-0.5">
              {t.brandTagline}
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">ROS2 Galactic</span>
        </div>
      </motion.div>

      {/* Center Interactive SVG Butler Robot & 360 LiDAR Visualization */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
        {/* Outer LiDAR Radar Ring Field */}
        <div className="relative w-80 h-80 xl:w-96 xl:h-96 flex items-center justify-center">
          {/* Radar Circles with calibrated distances */}
          <div className="absolute inset-0 rounded-full border border-blue-300/40" />
          <div className="absolute inset-8 rounded-full border border-dashed border-blue-300/50" />
          <div className="absolute inset-16 rounded-full border border-blue-200/60" />
          <div className="absolute inset-24 rounded-full border border-blue-300/70" />

          {/* Pulse wave ring */}
          <div className="absolute inset-4 rounded-full border-2 border-blue-400/40 animate-pulse-ring" />
          <div className="absolute inset-12 rounded-full border border-sky-400/30 animate-pulse-ring [animation-delay:1s]" />

          {/* Rotating LiDAR Radar Sweep Beam */}
          {radarActive && (
            <div className="absolute inset-0 rounded-full animate-radar pointer-events-none">
              <div 
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(37, 99, 235, 0.35) 0deg, rgba(56, 189, 248, 0.1) 45deg, transparent 90deg)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              />
              <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-gradient-to-t from-blue-600 to-sky-400 shadow-[0_0_8px_#38BDF8]" />
            </div>
          )}

          {/* Simulated LiDAR Obstacle Point Cloud Blips */}
          <div className="absolute top-12 left-16 flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm animate-ping" />
            <span className="text-[10px] font-mono text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs">0.82m</span>
          </div>

          <div className="absolute bottom-16 right-14 flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-sm animate-pulse" />
            <span className="text-[10px] font-mono text-amber-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs">1.45m</span>
          </div>

          <div className="absolute top-20 right-20 flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping [animation-delay:800ms]" />
          </div>

          {/* The Central Butler Robot Graphic (Stylized Sleek Modern Aesthetic) */}
          <motion.div 
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-20 w-44 h-44 xl:w-52 xl:h-52 bg-white rounded-3xl p-4 shadow-2xl shadow-blue-500/20 border border-slate-100 flex flex-col items-center justify-between"
          >
            {/* Robot Head / Top LiDAR Dome */}
            <div className="relative w-full flex flex-col items-center">
              {/* LiDAR Turret on Top with active laser sweep dot */}
              <div className="relative -mt-6 w-16 h-7 bg-slate-900 rounded-t-xl border border-slate-700 flex items-center justify-center shadow-md">
                <div className="w-10 h-2 bg-slate-800 rounded-full flex items-center justify-between px-1">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                </div>
                <div className="absolute -top-1 w-3 h-1 bg-blue-500 rounded-full animate-pulse" />
              </div>

              {/* Robot Face Display (Curved OLED Visor) */}
              <div className="w-full h-16 bg-slate-950 rounded-2xl p-2.5 flex flex-col justify-between border border-slate-800 shadow-inner mt-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-mono text-sky-400 font-bold">HSMIBOT 4K</span>
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 inline-block animate-pulse" />
                    AUTONOMOUS
                  </span>
                </div>
                
                {/* Dynamic Robot Animated Friendly Visor Eyes */}
                <div className="flex justify-around items-center px-4 py-0.5">
                  <div className="w-6 h-3 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <div className="w-6 h-3 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Visor telemetry sound bar */}
                <div className="flex items-center justify-center space-x-0.5 opacity-70">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  <div className="w-2 h-2 bg-sky-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Robot Lower Chassis & Telemetry Status Bar */}
            <div className="w-full bg-slate-50 rounded-xl p-2 border border-slate-200/80 flex items-center justify-between text-[11px] font-medium text-slate-700">
              <div className="flex items-center space-x-1">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>SLAM 3D</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nav2 Safe</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Telemetry Badges with Smooth Hover & Drift Animations */}
        {/* Badge 1: AI Vision */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -top-4 -left-4 xl:left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 border border-slate-200/90 flex items-center space-x-2.5 animate-float-slow"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.aiVisionBadge}</div>
            <div className="text-[10px] text-slate-500 font-medium">YOLOv8 Edge Realtime</div>
          </div>
        </motion.div>

        {/* Badge 2: Encrypted ROS2 Link */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-6 -right-4 xl:right-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 border border-slate-200/90 flex items-center space-x-2.5 animate-float-delayed"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.ros2Badge}</div>
            <div className="text-[10px] text-slate-500 font-medium">AES-256 DDS Hardware</div>
          </div>
        </motion.div>

        {/* Badge 3: LiDAR 360 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute -bottom-2 -left-2 xl:left-8 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 border border-slate-200/90 flex items-center space-x-2.5 animate-float-delayed"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.lidarBadge}</div>
            <div className="text-[10px] text-slate-500 font-medium">12m Radius • 25Hz Scan</div>
          </div>
        </motion.div>

        {/* Badge 4: Patrol Route */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -bottom-4 -right-2 xl:right-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 border border-slate-200/90 flex items-center space-x-2.5 animate-float-slow"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.patrolBadge}</div>
            <div className="text-[10px] text-slate-500 font-medium">Waypoint 04 / 12 Active</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Trust & Compliance Badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 pt-4 border-t border-slate-200/70 flex items-center justify-between"
      >
        <div className="flex items-start space-x-3 text-slate-600">
          <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed max-w-md font-medium text-slate-600">
            {t.trustNotice}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>v4.2.0-ROS2</span>
        </div>
      </motion.div>
    </div>
  );
};
