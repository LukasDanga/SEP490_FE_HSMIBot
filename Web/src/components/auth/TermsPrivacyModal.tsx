import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2, EyeOff } from 'lucide-react';
import { Language } from '../../types';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'terms' | 'privacy';
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'privacy'
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {lang === 'vi' ? 'Chính Sách Pháp Lý & Bảo Mật Dữ Liệu' : 'Legal Terms & Data Privacy Policy'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-100 bg-slate-50 p-1">
            <button
              onClick={() => setTab('privacy')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'privacy' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'vi' ? 'Chính Sách Bảo Mật (Zero-Cloud)' : 'Privacy Policy (Zero-Cloud)'}
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'terms' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'vi' ? 'Điều Khoản Sử Dụng' : 'Terms of Service'}
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
            {tab === 'privacy' ? (
              <>
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3 text-blue-900">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs">Zero-Knowledge Local Storage</div>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      {lang === 'vi'
                        ? 'Dữ liệu camera, bản đồ LiDAR SLAM và vector khuôn mặt được mã hóa trên chip NPU cục bộ của Robot. Không gửi video lên đám mây khi chưa có sự cho phép rõ ràng của Quản trị viên.'
                        : 'Camera streams, 3D LiDAR point clouds, and face vectors are processed and encrypted locally on the robot Edge NPU.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">1. Thu thập & Xử lý Dữ liệu Cảm biến</h4>
                  <p>
                    Robot sử dụng cảm biến LiDAR 360°, Camera RGB-D và cảm biến môi trường MQ-2 chỉ nhằm mục đích điều hướng tự động và phát hiện sự cố nguy hiểm trong khuôn viên nhà bạn.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">2. Quyền Kiểm soát của Chủ sở hữu</h4>
                  <p>
                    Bạn có toàn quyền vô hiệu hóa camera, đặt vùng cấm tuần tra (No-Go Zones) hoặc xóa hoàn toàn bộ nhớ nhận diện khuôn mặt bất cứ lúc nào từ Bảng điều khiển.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">1. Trách nhiệm Vận hành Robot</h4>
                  <p>
                    Chủ sở hữu cần đảm bảo đường đi trong nhà không có các vật cản dây điện trôi nổi hoặc chất lỏng nguy hại vượt quá khả năng chống nước IP54 của robot.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">2. Cập nhật Phần mềm & ROS2 Firmware</h4>
                  <p>
                    Các bản vá bảo mật và thuật toán điều hướng Nav2 sẽ được tải về tự động qua kênh mã hóa DDS an toàn khi robot đang ở trạm sạc.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {lang === 'vi' ? 'Đã Hiểu & Đóng' : 'I Understand & Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
