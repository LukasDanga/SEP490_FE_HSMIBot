import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Headphones, Phone, Mail, MessageSquare, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';
import { Language } from '../../types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'vi' ? 'Hỗ Trợ Kỹ Thuật & Ghép Nối 24/7' : '24/7 Hardware & Pairing Support'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {lang === 'vi' ? 'Đội ngũ kỹ sư ROS2 sẵn sàng hỗ trợ trực tiếp' : 'ROS2 robotics engineering team on standby'}
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

          {/* Body */}
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>{lang === 'vi' ? 'Vị trí tìm mã Serial phần cứng:' : 'Where to find your Hardware Serial:'}</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>{lang === 'vi' ? 'Nhãn tem dán dưới đế trạm sạc Docking Station.' : 'Under the base plate of the charging dock.'}</li>
                <li>{lang === 'vi' ? 'Mã QR đính kèm trong thẻ bảo hành VIP HSMIBot.' : 'QR Code card inside the quick start box.'}</li>
                <li>{lang === 'vi' ? 'Màn hình OLED phía trước robot khi bật nguồn lần đầu.' : 'Front visor display during first boot sequence.'}</li>
              </ul>
            </div>

            {/* Contact Channels */}
            <div className="space-y-2">
              <a
                href="tel:19008899"
                className="p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-50 border border-blue-200 flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-900">{lang === 'vi' ? 'Hotline Kỹ Thuật VIP' : 'VIP Robotics Hotline'}</div>
                    <div className="text-[11px] text-blue-600 font-mono">1900 8899 • Miễn phí 24/7</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-lg border border-blue-200 text-blue-700">
                  {lang === 'vi' ? 'Gọi ngay' : 'Call'}
                </span>
              </a>

              <a
                href="mailto:support@hsmibot.io"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">Email Support</div>
                    <div className="text-[11px] text-slate-500">support@hsmibot.io</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
