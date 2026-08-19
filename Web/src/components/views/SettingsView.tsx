import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Eye, 
  Wifi, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  Sparkles,
  Sliders,
  Bell,
  Cpu
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface SettingsViewProps {
  lang: Language;
  onOpenProfile?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ lang, onOpenProfile }) => {
  const t = translations[lang];

  const [volume, setVolume] = useState(75);
  const [aiConfidence, setAiConfidence] = useState(85);
  const [nightVisionAuto, setNightVisionAuto] = useState(true);
  const [soundAlarmOnThreat, setSoundAlarmOnThreat] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {lang === 'vi' ? 'Cài Đặt Robot & Cấu Hình An Ninh' : 'Robot Hardware & Security Configurations'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Fine-tune Edge NPU AI thresholds, speaker alert volumes, and networking
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? (lang === 'vi' ? 'Đã Lưu Cài Đặt!' : 'Saved Successfully!') : t.save}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Vision & Detection Sensitivity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>{lang === 'vi' ? 'Độ Nhạy Nhận Diện AI (NPU)' : 'Edge AI Sensitivity & Filters'}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>{lang === 'vi' ? 'Ngưỡng Tin Cậy AI (Confidence)' : 'AI Confidence Threshold'}</span>
              <span className="font-mono text-blue-600 font-bold">{aiConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={aiConfidence}
              onChange={(e) => setAiConfidence(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'vi' 
                ? 'Ngưỡng cao giảm thiểu báo động giả đối với vật nuôi và đồ gia dụng.'
                : 'Higher threshold reduces false alarms for domestic pets and moving shadows.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {lang === 'vi' ? 'Tự Động Bật Hồng Ngoại Ban Đêm' : 'Auto Night Vision IR Activation'}
              </div>
              <div className="text-[11px] text-slate-500">
                {lang === 'vi' ? 'Khi ánh sáng môi trường < 5 Lux' : 'When ambient illuminance falls below 5 Lux'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={nightVisionAuto}
              onChange={(e) => setNightVisionAuto(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Card 2: Audio & Alarm Volume */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>{lang === 'vi' ? 'Âm Thanh & Loa Cảnh Báo' : 'Acoustic Speaker & Sirens'}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>{lang === 'vi' ? 'Âm Lượng Loa Robot' : 'Robot Speaker Volume'}</span>
              <span className="font-mono text-blue-600 font-bold">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {lang === 'vi' ? 'Hú Còi Báo Động Khi Phát Hiện Kẻ Đột Nhập' : 'Auto Sound Siren on Unauthorized Intrusion'}
              </div>
              <div className="text-[11px] text-slate-500">
                {lang === 'vi' ? 'Cảnh báo 105dB xua đuổi đối tượng khả nghi' : '105dB deterrent buzzer sequence'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundAlarmOnThreat}
              onChange={(e) => setSoundAlarmOnThreat(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Card 3: Account & Profile Management Shortcut */}
        {onOpenProfile && (
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Hồ Sơ Quản Trị & Bảo Mật 2FA' : 'Admin Profile & 2FA Security'}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {lang === 'vi'
                  ? 'Quản lý thông tin gia chủ, đổi mật khẩu, kích hoạt bảo vệ 2 lớp (Google Authenticator) và kiểm tra các phiên đăng nhập.'
                  : 'Manage homeowner credentials, change passwords, enable 2FA authentication, and review connected devices.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenProfile}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shrink-0 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {lang === 'vi' ? 'Mở Hồ Sơ Người Dùng ➔' : 'Open User Profile ➔'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
