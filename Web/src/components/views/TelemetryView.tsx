import React from 'react';
import { 
  Activity, 
  Cpu, 
  Radio, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Gauge, 
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { Language, RobotTelemetry } from '../../types';
import { translations } from '../../i18n/translations';

interface TelemetryViewProps {
  lang: Language;
  telemetry: RobotTelemetry;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ lang, telemetry }) => {
  const t = translations[lang];

  const rosNodes = [
    { name: '/nav2_controller_server', status: 'ACTIVE', hz: '20.0 Hz', pid: 1402 },
    { name: '/ouster_lidar_driver', status: 'ACTIVE', hz: '25.0 Hz', pid: 1408 },
    { name: '/realsense_rgbd_pipeline', status: 'ACTIVE', hz: '30.0 Hz', pid: 1419 },
    { name: '/slam_toolbox_mapper', status: 'ACTIVE', hz: '10.0 Hz', pid: 1422 },
    { name: '/diffdrive_motor_bridge', status: 'ACTIVE', hz: '50.0 Hz', pid: 1430 },
    { name: '/safety_cliff_bumper_node', status: 'ACTIVE', hz: '100.0 Hz', pid: 1435 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {lang === 'vi' ? 'Chẩn Đoán ROS2 Galactic & Phần Cứng' : 'ROS2 Galactic Telemetry & Hardware Health'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time DDS middleware ping • Hardware sensor bus telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-xl border border-emerald-200">
            DDS Latency: 4.2ms
          </span>
        </div>
      </div>

      {/* Hardware Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>NPU / CPU LOAD</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{telemetry.cpuUsage}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${telemetry.cpuUsage}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>RAM MEMORY</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{telemetry.ramUsage}% (3.8 / 8GB)</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${telemetry.ramUsage}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>CORE TEMPERATURE</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900">{telemetry.temperature} °C</div>
          <div className="text-xs text-emerald-600 font-bold">Heatsink fan 1,800 RPM</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>TOTAL ODOMETRY</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">42.84 km</div>
          <div className="text-xs text-slate-500 font-medium">Wheel encoders calibrated</div>
        </div>
      </div>

      {/* Active ROS2 Nodes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {lang === 'vi' ? 'Danh Sách ROS2 Nodes Đang Chạy' : 'Active ROS2 Execution Nodes'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="pb-3">NODE TOPIC</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">FREQUENCY</th>
                <th className="pb-3">PID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rosNodes.map((node, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 font-mono text-blue-600 font-bold">{node.name}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {node.status}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-slate-700">{node.hz}</td>
                  <td className="py-2.5 font-mono text-slate-500">{node.pid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
