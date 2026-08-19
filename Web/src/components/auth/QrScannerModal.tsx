import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Scan, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { Language } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (serial: string) => void;
  lang: Language;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  lang
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [detectedSerial, setDetectedSerial] = useState<string | null>(null);

  const sampleSerials = [
    { code: 'HSMI-8924-A7X9', name: 'HSMIBot Alpha Sentry (LiDAR 3D)' },
    { code: 'HSMI-5520-PRO2', name: 'HSMIBot Pro Executive (Dual RealSense)' },
    { code: 'HSMI-3301-SNTX', name: 'HSMIBot Patrol Nano (Compact Dock)' }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setDetectedSerial(null);
    }
  }, [isOpen]);

  const handleSelectSample = (serial: string) => {
    setDetectedSerial(serial);
    setIsScanning(false);
    setTimeout(() => {
      onScanSuccess(serial);
      onClose();
    }, 650);
  };

  const handleSimulatedScan = () => {
    const randomSerial = sampleSerials[Math.floor(Math.random() * sampleSerials.length)].code;
    handleSelectSample(randomSerial);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'vi' ? 'Quét Mã QR Phần Cứng Robot' : 'Scan Robot Hardware QR'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {lang === 'vi' ? 'Dưới đáy trạm sạc hoặc tem nhãn hộp máy' : 'Located under charging dock or package label'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scanner Viewport Simulation */}
          <div className="p-5 space-y-4">
            <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner">
              {/* Simulated camera grid & corner markers */}
              <div className="absolute inset-4 border border-dashed border-white/20 rounded-xl pointer-events-none" />

              {/* Laser sweep animation */}
              {isScanning && (
                <div className="absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-bounce duration-1000" />
              )}

              {/* QR Framing Box */}
              <div className="relative w-36 h-36 border-2 border-sky-400/80 rounded-2xl flex items-center justify-center bg-sky-500/10">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-sky-400" />

                {detectedSerial ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center space-y-1 text-emerald-400"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                    <span className="text-[10px] font-mono font-bold bg-slate-900/90 px-2 py-0.5 rounded text-white border border-emerald-500">
                      {detectedSerial}
                    </span>
                  </motion.div>
                ) : (
                  <Scan className="w-12 h-12 text-sky-300 animate-pulse opacity-70" />
                )}
              </div>

              {/* Live Overlay Status */}
              <div className="absolute bottom-2.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>{detectedSerial ? (lang === 'vi' ? 'Đã Nhận Diện' : 'Key Detected!') : (lang === 'vi' ? 'Đang căn chỉnh camera...' : 'Aligning optical sensor...')}</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSimulatedScan}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Mô phỏng Quét Tự Động' : 'Auto-Detect QR'}</span>
              </button>
            </div>

            {/* Sample Keys for instant pairing click */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>{lang === 'vi' ? 'Hoặc chọn nhanh mã Robot mẫu:' : 'Or tap a demo hardware key:'}</span>
                <span className="text-[10px] text-slate-500">Click to autofill</span>
              </div>
              <div className="space-y-1.5">
                {sampleSerials.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s.code)}
                    className="w-full p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-blue-600">{s.code}</div>
                      <div className="text-[10px] text-slate-500">{s.name}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {lang === 'vi' ? 'Chọn' : 'Select'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
