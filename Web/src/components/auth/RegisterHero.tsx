import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Eye, 
  Cpu, 
  Sparkles, 
  Lock, 
  Radio, 
  CheckCircle2, 
  Radar, 
  Flame, 
  Fingerprint, 
  MapPin,
  Bot
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface RegisterHeroProps {
  lang: Language;
}

export const RegisterHero: React.FC<RegisterHeroProps> = ({ lang }) => {
  const t = translations[lang];

  const featureBadges = [
    {
      title: t.featLidarPatrol,
      desc: t.featLidarPatrolDesc,
      icon: <Radar className="w-5 h-5 text-blue-600" />,
      tag: 'Nav2 • 360°'
    },
    {
      title: t.featFacePrivacy,
      desc: t.featFacePrivacyDesc,
      icon: <Fingerprint className="w-5 h-5 text-emerald-600" />,
      tag: 'Zero-PII • NPU'
    },
    {
      title: t.featThermalAlert,
      desc: t.featThermalAlertDesc,
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      tag: '< 3s Alert'
    }
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 p-10 xl:p-14 overflow-hidden select-none border-r border-slate-200">
      {/* Background Dot Matrix Pattern & Ambient Lighting */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/60">
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
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

      {/* Center Showcase: Title & 3 Feature Bullet Badges */}
      <div className="relative z-10 my-auto py-6 space-y-6 max-w-lg">
        {/* Welcome Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Home Defense</span>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t.startSecurityJourney}
          </h1>
          <p className="text-xs xl:text-sm text-slate-600 font-medium leading-relaxed">
            {t.regHeroSubtext}
          </p>
        </motion.div>

        {/* 3 High-Impact Feature Badges with Check Circle Icons */}
        <div className="space-y-3.5 pt-2">
          {featureBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
              whileHover={{ x: 6 }}
              className="group bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-start space-x-3.5 cursor-default"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200 shrink-0 transition-colors">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {badge.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {badge.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Robot Pairing Telemetry Radar Micro-Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700"
        >
          <div className="flex items-center space-x-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </div>
            <span className="font-semibold">IoT Discovery Beacon: 12 Nodes Detected</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            DDS 2.4 GHz
          </span>
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
