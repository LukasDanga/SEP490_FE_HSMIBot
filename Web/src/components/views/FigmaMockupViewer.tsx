import React, { useState } from 'react';
import { 
  Figma, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Layers, 
  Monitor, 
  Smartphone, 
  Maximize2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Language } from '../../types';

interface FigmaMockupViewerProps {
  lang: Language;
}

interface FigmaScreenItem {
  id: string;
  nameVI: string;
  nameEN: string;
  category: string;
  fileName: string;
  descriptionVI: string;
  descriptionEN: string;
  badge: string;
  badgeColor: string;
}

export const FigmaMockupViewer: React.FC<FigmaMockupViewerProps> = ({ lang }) => {
  const isVI = lang === 'vi';

  const screens: FigmaScreenItem[] = [
    {
      id: '00_auth',
      nameVI: '00. Đăng Nhập & Ghép Nối Robot',
      nameEN: '00. Auth & Robot Pairing Portal',
      category: 'Auth & Onboarding',
      fileName: '00_auth_portal.html',
      descriptionVI: 'Màn hình Split-Screen 50/50: Bên trái radar quét SVG 360°, bên phải form đăng nhập, đo độ mạnh mật khẩu & mã Serial HSMI-8924-PRO.',
      descriptionEN: '50/50 Split-screen: Left SVG animated radar telemetry, right login & hardware serial pairing form.',
      badge: 'Split-Screen',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '01_dash',
      nameVI: '01. Tổng Quan (Dashboard)',
      nameEN: '01. Homeowner Dashboard',
      category: 'Core Navigation',
      fileName: '01_dashboard.html',
      descriptionVI: '4 thẻ KPI (Pin 88%, ROS2 24ms, Temp 38°C, CPU), Quick Actions (E-Stop, Dock, Patrol) & Mini Camera live preview.',
      descriptionEN: '4 KPI cards, Quick Action Bar (E-Stop, Return Dock) & Live camera feed with recent security incidents.',
      badge: 'Live KPIs',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: '02_cam',
      nameVI: '02. Camera & Giám Sát Trực Tuyến (Live Stream)',
      nameEN: '02. Camera & Live Video Teleop (1080p Stream)',
      category: 'Sensors & Perception',
      fileName: '08_teleop_voice.html',
      descriptionVI: 'Chia đôi 60/40: Bên trái stream WebRTC 1080p (32ms) điều khiển PTZ & phím lái; bên phải Whisper STT + bộ phân giải ý định giọng nói LLM.',
      descriptionEN: '60/40 Split: WebRTC 1080p live stream with PTZ controls & teleop + AI Whisper STT & LLM voice intent parsing chat.',
      badge: '4K AI Stream',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: '03_nav',
      nameVI: '03. Bản Đồ Điều Hướng (Nav2)',
      nameEN: '03. Map & Nav2 Dispatch (OTTO AMR)',
      category: 'Core Navigation',
      fileName: '03_navigation.html',
      descriptionVI: 'Bản đồ 2D OTTO AMR tương phản cao, phân vùng phòng khách/bếp/sân vườn, quỹ đạo Nav2, Point-and-Click Instant Dispatch popover.',
      descriptionEN: 'High-contrast 2D floorplan canvas, room zones, Nav2 path trajectory, and Point-and-Click goal drop popover.',
      badge: 'Point-and-Click',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '04_slam',
      nameVI: '04. SLAM Studio (Dựng Bản Đồ & Tường Ảo)',
      nameEN: '04. SLAM Mapping Studio & Virtual Walls',
      category: 'Configuration',
      fileName: '04_slam_studio.html',
      descriptionVI: 'Thanh công cụ vẽ Tường ảo (Virtual Wall), Vùng cấm đi (Keep-Out), Vùng giảm tốc (Slow Zone), mesh Cartographer & nút xuất file .yaml/.pgm.',
      descriptionEN: 'Drawing toolbar with Virtual Walls, Keep-Out zones, Slow speed zones, Cartographer mesh & export YAML/PGM.',
      badge: 'v1.4 Cartographer',
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: '05_sched',
      nameVI: '05. Lịch Trình Tuần Tra',
      nameEN: '05. Patrol Scheduler',
      category: 'Automation',
      fileName: '05_scheduler.html',
      descriptionVI: 'Banner tiến độ tuần tra đêm, sơ đồ chuỗi Waypoints 1-4 kèm hành vi kiểm tra quang học và bảng lịch trình định kỳ tự động.',
      descriptionEN: 'Night sweep progress banner, drag-and-drop sequential waypoint builder and weekly cron trigger table.',
      badge: 'Auto-Patrol',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: '06_face',
      nameVI: '06. Face ID & Nhận Diện Người Lạ',
      nameEN: '06. Face ID & Intruder Hub',
      category: 'Security & AI',
      fileName: '06_face_id.html',
      descriptionVI: 'Chế độ Away Mode cảnh báo cao, lưới thành viên gia đình whitelist 512D và thẻ so sánh ảnh crop người lạ vs góc rộng + nút hú còi 85dB.',
      descriptionEN: 'Away Mode high-alert toggle, 512-dim family whitelist cards and stranger comparison snapshot card with siren trigger.',
      badge: 'FaceNet 512D',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: '07_fire',
      nameVI: '07. Báo Cháy & Ma Trận 4 Cấp Độ',
      nameEN: '07. Fire Safety & Severity Matrix',
      category: 'Security & AI',
      fileName: '07_fire_matrix.html',
      descriptionVI: '4 cảm biến môi trường (Nhiệt, Khói gas MQ-2, Lửa quang học IR, Độ ẩm) và ma trận cấu hình 4 cấp độ phản ứng tự động (Warning -> Evacuation).',
      descriptionEN: '4 environment telemetry gauges and full 4-level configurable fire reaction matrix (Warning, Alert, Critical, Evacuate).',
      badge: '4-Level Matrix',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: '09_inc',
      nameVI: '08. Nhật Ký Sự Cố & Video Clip',
      nameEN: '08. Security Incidents & Video Logs',
      category: 'Audit & Logs',
      fileName: '09_incidents.html',
      descriptionVI: 'KPI tổng quan sự cố, bảng kiểm toán an ninh chi tiết kèm ảnh snapshot và nút mở popup xem video clip 30 giây.',
      descriptionEN: 'Incident summary KPIs and filterable security audit log table with incident snapshots & 30s video clip modal CTA.',
      badge: 'Video Audit',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: '10_telem',
      nameVI: '09. Sức Khỏe Phần Cứng & ROS2',
      nameEN: '09. Hardware Telemetry & ROS2',
      category: 'System Diagnostics',
      fileName: '10_telemetry.html',
      descriptionVI: 'Sức khỏe động cơ bánh xe, độ lệch góc IMU, cân bằng cell pin BMS, chất lượng Wi-Fi Mesh và bảng trạng thái các topic ROS2.',
      descriptionEN: 'Wheel motor temperatures, IMU drift rate, individual battery cell balance, and live ROS2 nodes/topics registry.',
      badge: 'ROS2 Galactic',
      badgeColor: 'bg-slate-100 text-slate-800'
    },
    {
      id: '11_profile',
      nameVI: '10. Cài Đặt & Hồ Sơ Gia Chủ',
      nameEN: '10. User Profile & Account Security',
      category: 'Configuration',
      fileName: '11_settings_profile.html',
      descriptionVI: 'Thẻ avatar gia chủ Alexander Tran, form thông tin biệt thự, cài đặt bảo mật xác thực 2 yếu tố 2FA và quản lý thiết bị đăng nhập.',
      descriptionEN: 'Homeowner avatar profile card, villa address config, 2-Factor Authentication toggle and active session manager.',
      badge: '2FA Security',
      badgeColor: 'bg-teal-100 text-teal-800'
    }
  ];

  const [selectedScreen, setSelectedScreen] = useState<FigmaScreenItem>(screens[1]); // Default to Dashboard

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      
      {/* Top Banner: Figma Verification Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-400">
              <Figma className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
              FIGMA HTML5 LIVE PREVIEW & AUDIT HUB
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight">
            {isVI ? 'Bộ Kiểm Duyệt Trực Tiếp 12 Màn Hình Figma HTML5' : '12 Standalone Figma HTML5 Screen Inspector'}
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {isVI 
              ? 'Tất cả các file HTML5 trong thư mục `figma/` được nhúng trực tiếp dưới đây để bạn đối chiếu, kiểm tra tỉ lệ layout 1440x900px, font Inter, màu sắc và icon trước khi import vào Figma bằng plugin html.to.design.'
              : 'All standalone HTML5 files under `figma/` are embedded below in real-time for visual layout verification (1440x900px, Inter font, Enterprise Light theme) before importing into Figma via html.to.design.'}
          </p>
        </div>

        {/* Quick External Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href={`/figma/${selectedScreen.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isVI ? 'Mở File Gốc Tab Mới' : 'Open Raw File in Tab'}</span>
          </a>
        </div>
      </div>

      {/* Screen Selector Grid Chips */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{isVI ? 'Chọn Màn Hình Để Xem Preview (12 Màn Hình Standalone):' : 'Select Screen to Preview (12 Standalone HTMLs):'}</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {isVI ? `Đang xem: ${selectedScreen.fileName}` : `Active: ${selectedScreen.fileName}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {screens.map((screen) => {
            const isSelected = selectedScreen.id === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => setSelectedScreen(screen)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${screen.badgeColor}`}>
                    {screen.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                  {isVI ? screen.nameVI : screen.nameEN}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Screen Detail Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">
              {isVI ? selectedScreen.nameVI : selectedScreen.nameEN}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {isVI ? selectedScreen.descriptionVI : selectedScreen.descriptionEN}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
            Viewport: 1440 × 900
          </span>
          <a
            href={`/figma/${selectedScreen.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Live Interactive iFrame Container (1440x900 Aspect Container) */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 text-xs font-mono text-slate-400 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="ml-2 text-slate-300 font-bold">figma/{selectedScreen.fileName}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-emerald-400">● Production HTML5</span>
            <span>•</span>
            <span>Tailwind CDN + Inter + FontAwesome 6</span>
          </div>
        </div>

        {/* The Responsive iFrame */}
        <div className="flex-1 w-full bg-slate-50 rounded-2xl overflow-hidden mt-2 relative min-h-[750px]">
          <iframe
            key={selectedScreen.fileName}
            src={`/figma/${selectedScreen.fileName}`}
            title={selectedScreen.nameVI}
            className="w-full h-full border-0 absolute inset-0 bg-white"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

    </div>
  );
};
