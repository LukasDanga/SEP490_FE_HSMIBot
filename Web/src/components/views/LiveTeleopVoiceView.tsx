import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Wifi, 
  Battery, 
  Camera, 
  Mic, 
  MicOff, 
  Moon, 
  Sun, 
  Maximize2, 
  CircleDot, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Navigation, 
  Compass, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sliders, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Radio, 
  Zap, 
  Flame, 
  ShieldCheck, 
  DoorClosed, 
  Search, 
  ChevronRight, 
  Image as ImageIcon,
  Square,
  Play
} from 'lucide-react';
import { Language, CommandChatMessage, PTZCameraState } from '../../types';
import { translations } from '../../i18n/translations';

interface LiveTeleopVoiceViewProps {
  lang: Language;
}

const INITIAL_PTZ_STATE: PTZCameraState = {
  panDeg: 0,
  tiltDeg: 0,
  zoomLevel: 1.0,
  nightVisionIR: false,
  micActive: false,
  audioSpeakerActive: true,
  isRecording: false,
  recordDurationSeconds: 0,
  fps: 30,
  latencyMs: 32,
  resolution: '1080p@30fps',
  bitrateMbps: 4.8,
  wifiSignalDbm: -42,
  batteryPct: 88
};

const INITIAL_MESSAGES: CommandChatMessage[] = [
  {
    id: 'msg_01',
    sender: 'user',
    timestamp: '14:20:15',
    isVoice: true,
    voiceDurationSec: 3.4,
    textVI: 'Hãy đi kiểm tra xem cửa sổ phòng bếp đã đóng kín chưa.',
    textEN: 'Go check if the kitchen window is closed and locked.'
  },
  {
    id: 'msg_02',
    sender: 'ai_parser',
    timestamp: '14:20:16',
    parsedIntent: {
      intent: 'NAVIGATE_AND_INSPECT',
      target: 'Kitchen Window (Zone B - Point 4)',
      actionType: 'NAVIGATE_AND_INSPECT',
      confidence: 99.4,
      status: 'completed'
    }
  },
  {
    id: 'msg_03',
    sender: 'robot',
    timestamp: '14:20:38',
    robotResponse: {
      textVI: 'Tôi đã đến khu vực Bếp. Cửa sổ đang đóng kín và khóa chốt an toàn. Đã chụp ảnh lưu trữ.',
      textEN: 'I have reached the Kitchen. The window appears closed and properly latched. Photo attached.',
      snapshotUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
      snapshotCaptionVI: 'Ảnh chụp thực tế Cửa sổ Bếp lúc 14:20',
      snapshotCaptionEN: 'Live camera snapshot of Kitchen Window at 14:20',
      currentZoneVI: 'Phòng Bếp (Zone B)',
      currentZoneEN: 'Kitchen (Zone B)',
      status: 'arrived'
    }
  }
];

export const LiveTeleopVoiceView: React.FC<LiveTeleopVoiceViewProps> = ({ lang }) => {
  const t = translations[lang];

  // Camera & PTZ State
  const [ptz, setPtz] = useState<PTZCameraState>(INITIAL_PTZ_STATE);
  const [linearSpeed, setLinearSpeed] = useState<number>(0.35); // m/s (0.1 to 0.5)
  const [angularSpeed, setAngularSpeed] = useState<number>(0.65); // rad/s (0.2 to 1.2)
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [odometryHeading, setOdometryHeading] = useState<number>(142);
  const [robotCoords, setRobotCoords] = useState<{ x: number; y: number }>({ x: 4.82, y: 3.15 });

  // Chat & Voice Command State
  const [messages, setMessages] = useState<CommandChatMessage[]>(INITIAL_MESSAGES);
  const [textInput, setTextInput] = useState('');
  const [isHoldingMic, setIsHoldingMic] = useState(false);
  const [micTimer, setMicTimer] = useState(0);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const micIntervalRef = useRef<number | null>(null);
  const recordIntervalRef = useRef<number | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Recording Timer
  useEffect(() => {
    if (ptz.isRecording) {
      recordIntervalRef.current = window.setInterval(() => {
        setPtz(prev => ({ ...prev, recordDurationSeconds: prev.recordDurationSeconds + 1 }));
      }, 1000);
    } else {
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [ptz.isRecording]);

  // Handle Push-to-Talk Mic Timer
  useEffect(() => {
    if (isHoldingMic) {
      setMicTimer(0);
      micIntervalRef.current = window.setInterval(() => {
        setMicTimer(prev => prev + 0.1);
      }, 100);
    } else {
      if (micIntervalRef.current) {
        clearInterval(micIntervalRef.current);
        micIntervalRef.current = null;
      }
    }
    return () => {
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
    };
  }, [isHoldingMic]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Keyboard controls listener for WASD + Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          handleDriveMove('forward');
          break;
        case 's':
        case 'arrowdown':
          handleDriveMove('backward');
          break;
        case 'a':
        case 'arrowleft':
          handleDriveMove('left');
          break;
        case 'd':
        case 'arrowright':
          handleDriveMove('right');
          break;
        case ' ':
          e.preventDefault();
          handleEmergencyStop();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        setActiveDirection(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [linearSpeed, angularSpeed]);

  // Drive actions
  const handleDriveMove = (dir: 'forward' | 'backward' | 'left' | 'right' | 'rotate') => {
    setActiveDirection(dir);
    if (dir === 'forward') {
      setRobotCoords(prev => ({ ...prev, y: Number((prev.y + 0.15 * linearSpeed).toFixed(2)) }));
    } else if (dir === 'backward') {
      setRobotCoords(prev => ({ ...prev, y: Number((prev.y - 0.15 * linearSpeed).toFixed(2)) }));
    } else if (dir === 'left') {
      setOdometryHeading(prev => (prev - 10 + 360) % 360);
      setRobotCoords(prev => ({ ...prev, x: Number((prev.x - 0.12 * linearSpeed).toFixed(2)) }));
    } else if (dir === 'right') {
      setOdometryHeading(prev => (prev + 10) % 360);
      setRobotCoords(prev => ({ ...prev, x: Number((prev.x + 0.12 * linearSpeed).toFixed(2)) }));
    } else if (dir === 'rotate') {
      setOdometryHeading(prev => (prev + 90) % 360);
    }
  };

  const handleEmergencyStop = () => {
    setActiveDirection(null);
    showToast(lang === 'vi' ? 'Đã phanh dừng khẩn cấp (Emergency Braking engaged)!' : 'Emergency Brake Engaged!');
  };

  // PTZ adjustments
  const handlePTZAdjust = (panDelta: number, tiltDelta: number) => {
    setPtz(prev => ({
      ...prev,
      panDeg: Math.max(-180, Math.min(180, prev.panDeg + panDelta)),
      tiltDeg: Math.max(-30, Math.min(90, prev.tiltDeg + tiltDelta))
    }));
  };

  const handleZoomCycle = () => {
    const nextZooms = [1.0, 2.0, 3.0, 5.0];
    const currentIdx = nextZooms.indexOf(ptz.zoomLevel);
    const nextZoom = nextZooms[(currentIdx + 1) % nextZooms.length];
    setPtz(prev => ({ ...prev, zoomLevel: nextZoom }));
    showToast(`Zoom: ${nextZoom}x`);
  };

  const handleSnapshot = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);
    showToast(lang === 'vi' ? 'Đã chụp snapshot 1080p & lưu vào Thư Viện Media' : '1080p Snapshot saved to Media Gallery');
  };

  const handleToggleRecord = () => {
    setPtz(prev => {
      const willRecord = !prev.isRecording;
      if (willRecord) {
        showToast(lang === 'vi' ? 'Bắt đầu ghi clip WebRTC 1080p...' : 'Recording WebRTC 1080p stream...');
      } else {
        showToast(lang === 'vi' ? `Đã lưu clip video (${prev.recordDurationSeconds}s) vào Cloud` : `Saved video clip (${prev.recordDurationSeconds}s) to Cloud`);
      }
      return {
        ...prev,
        isRecording: willRecord,
        recordDurationSeconds: 0
      };
    });
  };

  // Dispatch Quick Target Room Inspection
  const handleQuickInspect = (roomVI: string, roomEN: string, actionType: 'NAVIGATE_AND_INSPECT' | 'FIRE_CHECK' | 'PATROL_CYCLE') => {
    const userMsg: CommandChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      textVI: `Hãy di chuyển đến ${roomVI} và kiểm tra hiện trường an toàn.`,
      textEN: `Navigate to ${roomEN} and inspect the area.`
    };

    const aiParserMsg: CommandChatMessage = {
      id: `ai_${Date.now() + 1}`,
      sender: 'ai_parser',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      parsedIntent: {
        intent: 'NAVIGATE_AND_INSPECT',
        target: `${roomEN} (Nav2 Goal Point)`,
        actionType: actionType,
        confidence: 99.6,
        status: 'executing'
      }
    };

    setMessages(prev => [...prev, userMsg, aiParserMsg]);
    showToast(`${lang === 'vi' ? 'Đã phát lệnh tuần tra' : 'Dispatched inspection'}: ${lang === 'vi' ? roomVI : roomEN}`);

    // Simulate robot arrival after 2.5s
    setTimeout(() => {
      setMessages(prev => {
        // mark previous parser as completed
        const updated = prev.map(m => m.id === aiParserMsg.id && m.parsedIntent ? { ...m, parsedIntent: { ...m.parsedIntent, status: 'completed' as const } } : m);
        
        const robotResp: CommandChatMessage = {
          id: `rob_${Date.now()}`,
          sender: 'robot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          robotResponse: {
            textVI: `Đã hoàn thành kiểm tra tại ${roomVI}. Tình trạng bình thường, không phát hiện nhiệt độ cao, khói hoặc người lạ.`,
            textEN: `Inspection completed at ${roomEN}. Normal status, zero thermal anomaly, smoke or unauthorized intruders detected.`,
            snapshotUrl: roomVI.includes('bếp') || roomEN.includes('Kitchen') 
              ? 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
              : roomVI.includes('cửa') || roomEN.includes('Door')
              ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            snapshotCaptionVI: `Ảnh kiểm tra ${roomVI}`,
            snapshotCaptionEN: `Inspection photo of ${roomEN}`,
            currentZoneVI: roomVI,
            currentZoneEN: roomEN,
            status: 'arrived'
          }
        };
        return [...updated, robotResp];
      });
    }, 2500);
  };

  // Submit Text or Voice Command
  const handleSendCommand = (text: string, isVoice = false, duration = 0) => {
    if (!text.trim()) return;

    const userMsg: CommandChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isVoice,
      voiceDurationSec: isVoice ? Number(duration.toFixed(1)) : undefined,
      textVI: text,
      textEN: text
    };

    // Determine simulated intent
    let detectedAction: 'NAVIGATE_AND_INSPECT' | 'PATROL_CYCLE' | 'STATUS_QUERY' | 'DOCK_CHARGING' | 'EMERGENCY_STOP' = 'NAVIGATE_AND_INSPECT';
    let targetEntity = 'Zone Area';
    const lower = text.toLowerCase();

    if (lower.includes('ở đâu') || lower.includes('where are you') || lower.includes('status')) {
      detectedAction = 'STATUS_QUERY';
      targetEntity = 'Global Robot State';
    } else if (lower.includes('tuần tra') || lower.includes('patrol')) {
      detectedAction = 'PATROL_CYCLE';
      targetEntity = 'Waypoint Sequence 1-6';
    } else if (lower.includes('sạc') || lower.includes('dock') || lower.includes('charge')) {
      detectedAction = 'DOCK_CHARGING';
      targetEntity = 'Charging Station Base';
    } else if (lower.includes('dừng') || lower.includes('stop')) {
      detectedAction = 'EMERGENCY_STOP';
      targetEntity = 'All Actuators';
    } else if (lower.includes('bếp') || lower.includes('kitchen') || lower.includes('stove')) {
      targetEntity = 'Kitchen Stove (Zone B)';
    } else if (lower.includes('cửa') || lower.includes('door') || lower.includes('lock')) {
      targetEntity = 'Front Door (Zone A)';
    }

    const aiParserMsg: CommandChatMessage = {
      id: `ai_${Date.now() + 1}`,
      sender: 'ai_parser',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      parsedIntent: {
        intent: detectedAction,
        target: targetEntity,
        actionType: detectedAction,
        confidence: 98.9,
        status: 'executing'
      }
    };

    setMessages(prev => [...prev, userMsg, aiParserMsg]);
    setTextInput('');

    // Simulate Robot completion response after 2.2s
    setTimeout(() => {
      setMessages(prev => {
        const updated = prev.map(m => m.id === aiParserMsg.id && m.parsedIntent ? { ...m, parsedIntent: { ...m.parsedIntent, status: 'completed' as const } } : m);
        
        let robotMsgVI = `Đã nhận lệnh: "${text}". Robot đang thực thi và cập nhật trạng thái an toàn.`;
        let robotMsgEN = `Received instruction: "${text}". Robot executed the task and verified normal status.`;
        let photo: string | undefined = undefined;

        if (detectedAction === 'STATUS_QUERY') {
          robotMsgVI = `Tôi đang ở Tọa độ X: ${robotCoords.x}m, Y: ${robotCoords.y}m (Phòng Khách), Pin còn ${ptz.batteryPct}%, tất cả cảm biến bình thường.`;
          robotMsgEN = `I am at Coords X: ${robotCoords.x}m, Y: ${robotCoords.y}m (Living Room), Battery is at ${ptz.batteryPct}%, all sensors nominal.`;
        } else if (detectedAction === 'DOCK_CHARGING') {
          robotMsgVI = `Đang điều hướng về Trạm sạc tự động tại Phòng Khách. Ước tính 15 giây.`;
          robotMsgEN = `Navigating back to Autonomous Charging Base. Estimated ETA: 15s.`;
        } else if (detectedAction === 'PATROL_CYCLE') {
          robotMsgVI = `Bắt đầu chu trình tuần tra an ninh toàn bộ 6 điểm Waypoints.`;
          robotMsgEN = `Initiated full 6-waypoint autonomous security patrol sequence.`;
        } else {
          photo = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80';
        }

        const robotResp: CommandChatMessage = {
          id: `rob_${Date.now()}`,
          sender: 'robot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          robotResponse: {
            textVI: robotMsgVI,
            textEN: robotMsgEN,
            snapshotUrl: photo,
            snapshotCaptionVI: 'Ảnh chụp xác thực mục tiêu',
            snapshotCaptionEN: 'Live camera target verification snapshot',
            currentZoneVI: 'Khu vực điều hướng',
            currentZoneEN: 'Nav Target Area',
            status: 'completed' as unknown as 'arrived'
          }
        };
        return [...updated, robotResp];
      });
    }, 2200);
  };

  // Push-to-Talk Mouse/Touch Handlers
  const handleMicStart = () => {
    setIsHoldingMic(true);
  };

  const handleMicEnd = () => {
    if (!isHoldingMic) return;
    setIsHoldingMic(false);
    
    // Simulate Whisper transcription
    const duration = micTimer;
    const sampleVoicePhrasesVI = [
      'Hãy đến kiểm tra cửa sổ phòng bếp và chụp ảnh gửi tôi.',
      'Robot kiểm tra xem cửa chính đã đóng khóa chưa.',
      'Bắt đầu tuần tra toàn bộ ngôi nhà ngay bây giờ.',
      'Hãy quay về dock sạc pin.'
    ];
    const sampleVoicePhrasesEN = [
      'Go check if the kitchen window is closed and take a snapshot.',
      'Inspect the front door and verify if locked.',
      'Start full home security patrol routine now.',
      'Navigate back to charging station base.'
    ];

    const randomIdx = Math.floor(Math.random() * sampleVoicePhrasesVI.length);
    const spokenText = lang === 'vi' ? sampleVoicePhrasesVI[randomIdx] : sampleVoicePhrasesEN[randomIdx];

    handleSendCommand(spokenText, true, Math.max(1.2, duration));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MODAL: FULLSCREEN PHOTO INSPECTION PREVIEW */}
      {selectedSnapshot && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setSelectedSnapshot(null)}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl space-y-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-extrabold text-white">1080p Teleop HD Verification Photo</h3>
              </div>
              <button 
                onClick={() => setSelectedSnapshot(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
              >
                Close (ESC)
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <img src={selectedSnapshot} alt="Enlarged snapshot" className="w-full h-auto max-h-[70vh] object-cover" />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Timestamp: 14:20:38 UTC+7</span>
              <span>Metadata: Exposure 1/120s • ISO 200 • IR Filter OFF</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER TITLE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{t.teleopHubTitle}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                LOW-LATENCY WEBRTC
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.teleopHubSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span>-42 dBm</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <Battery className="w-4 h-4 text-emerald-600" />
            <span>88%</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            <Zap className="w-4 h-4" />
            <span>ROS2 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN DUAL-PANE SPLIT: 60% LEFT (WEBRTC & DRIVE) + 40% RIGHT (VOICE & AI COMMAND CENTER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==========================================
            LEFT 60% (7 COLS): LIVE WEBRTC STREAM & PTZ DRIVE CONTROLS
           ========================================== */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. 1080p Live Stream Viewport */}
          <div className="bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-xl relative group">
            
            {/* Shutter flash effect */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-in fade-in duration-75" />
            )}

            {/* Video Container (16:9 ratio) */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
              
              {/* Background Video Frame Mockup */}
              <img 
                src={
                  ptz.nightVisionIR 
                    ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80" 
                    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
                } 
                alt="Live Teleop Camera Stream"
                className={`w-full h-full object-cover transition duration-300 ${ptz.nightVisionIR ? 'brightness-125 contrast-125 hue-rotate-90 saturate-50 filter' : ''}`}
                style={{ transform: `scale(${ptz.zoomLevel}) translate(${-ptz.panDeg * 0.2}px, ${-ptz.tiltDeg * 0.2}px)` }}
              />

              {/* Night Vision Green Overlay Tone if IR active */}
              {ptz.nightVisionIR && (
                <div className="absolute inset-0 bg-emerald-950/30 mix-blend-color pointer-events-none" />
              )}

              {/* HUD Crosshairs & Grid Reticle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
                <div className="absolute inset-x-8 top-1/2 h-px bg-white/20" />
                <div className="absolute inset-y-8 left-1/2 w-px bg-white/20" />
              </div>

              {/* TOP OVERLAYS: LIVE Indicator, Latency, Battery, Wi-Fi */}
              <div className="absolute top-3 inset-x-4 flex items-center justify-between text-xs font-mono select-none z-20">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-black text-[10px] flex items-center space-x-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{t.streamBadgeLive}</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10 text-[11px] font-bold">
                    32ms latency
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 text-[11px]">
                    1080p@30fps
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {ptz.isRecording && (
                    <span className="px-2.5 py-1 rounded-lg bg-red-500/80 text-white font-mono text-[11px] font-bold flex items-center space-x-1.5 animate-pulse">
                      <CircleDot className="w-3.5 h-3.5" />
                      <span>REC {String(Math.floor(ptz.recordDurationSeconds / 60)).padStart(2, '0')}:{String(ptz.recordDurationSeconds % 60).padStart(2, '0')}</span>
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 text-[11px] flex items-center space-x-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pan: {ptz.panDeg > 0 ? `+${ptz.panDeg}` : ptz.panDeg}°</span>
                  </span>
                </div>
              </div>

              {/* BOTTOM-LEFT OVERLAY: Real-time Odometry & Heading */}
              <div className="absolute bottom-3 left-4 text-slate-300 text-[11px] font-mono bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-20 space-y-0.5">
                <div className="text-white font-bold flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>X: {robotCoords.x}m | Y: {robotCoords.y}m</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Heading: {odometryHeading}° • Speed: {activeDirection ? `${linearSpeed} m/s` : '0.00 m/s'}
                </div>
              </div>

              {/* OVER-VIDEO QUICK TOOLS BAR (BOTTOM-RIGHT) */}
              <div className="absolute bottom-3 right-4 flex items-center space-x-1.5 z-20 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
                
                {/* Snapshot */}
                <button
                  type="button"
                  onClick={handleSnapshot}
                  title={t.toolSnapshot}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Record Clip */}
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  title={t.toolRecordClip}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    ptz.isRecording 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <CircleDot className="w-4 h-4" />
                </button>

                {/* 2-Way Audio Mic */}
                <button
                  type="button"
                  onClick={() => setPtz(prev => ({ ...prev, micActive: !prev.micActive }))}
                  title={t.toolTwoWayAudio}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    ptz.micActive ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  {ptz.micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                {/* Night Vision IR Toggle */}
                <button
                  type="button"
                  onClick={() => setPtz(prev => ({ ...prev, nightVisionIR: !prev.nightVisionIR }))}
                  title={t.toolNightVision}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    ptz.nightVisionIR ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  {ptz.nightVisionIR ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Digital Zoom Cycle */}
                <button
                  type="button"
                  onClick={handleZoomCycle}
                  title={t.toolZoom}
                  className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition cursor-pointer"
                >
                  {ptz.zoomLevel.toFixed(1)}x
                </button>

                {/* Fullscreen Snapshot Enlarge */}
                <button
                  type="button"
                  onClick={() => setSelectedSnapshot("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80")}
                  title={t.toolFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

          {/* 2. Bottom Drive Controls (Virtual D-Pad & Speed Sliders) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">{t.driveControlTitle}</h3>
                  <p className="text-[10px] text-slate-400">WASD / Arrow Keys keyboard mapping enabled</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleEmergencyStop}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black tracking-wider uppercase transition shadow-md shadow-red-500/20 cursor-pointer flex items-center space-x-1.5"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{t.btnStopEmergency}</span>
                </button>
              </div>
            </div>

            {/* D-Pad & PTZ Controls + Speed Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left: Interactive Virtual D-Pad / Joystick (5 Cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-3 gap-2 w-44 h-44">
                  
                  {/* Top Left: Pan Left */}
                  <button
                    type="button"
                    onClick={() => handlePTZAdjust(-15, 0)}
                    title="Pan Left"
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer transition shadow-2xs"
                  >
                    <RotateCw className="w-4 h-4 -scale-x-100 text-slate-400" />
                  </button>

                  {/* Up: FORWARD (W) */}
                  <button
                    type="button"
                    onMouseDown={() => handleDriveMove('forward')}
                    onMouseUp={() => setActiveDirection(null)}
                    onTouchStart={() => handleDriveMove('forward')}
                    onTouchEnd={() => setActiveDirection(null)}
                    className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center transition shadow-md cursor-pointer ${
                      activeDirection === 'forward'
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                    <span className="text-[9px] font-mono mt-0.5">W</span>
                  </button>

                  {/* Top Right: Pan Right */}
                  <button
                    type="button"
                    onClick={() => handlePTZAdjust(15, 0)}
                    title="Pan Right"
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer transition shadow-2xs"
                  >
                    <RotateCw className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Left: TURN LEFT (A) */}
                  <button
                    type="button"
                    onMouseDown={() => handleDriveMove('left')}
                    onMouseUp={() => setActiveDirection(null)}
                    onTouchStart={() => handleDriveMove('left')}
                    onTouchEnd={() => setActiveDirection(null)}
                    className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center transition shadow-md cursor-pointer ${
                      activeDirection === 'left'
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-[9px] font-mono mt-0.5">A</span>
                  </button>

                  {/* Center: ROTATE 360 */}
                  <button
                    type="button"
                    onClick={() => handleDriveMove('rotate')}
                    className="p-2 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-extrabold flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-[8px] font-mono font-bold mt-0.5">360°</span>
                  </button>

                  {/* Right: TURN RIGHT (D) */}
                  <button
                    type="button"
                    onMouseDown={() => handleDriveMove('right')}
                    onMouseUp={() => setActiveDirection(null)}
                    onTouchStart={() => handleDriveMove('right')}
                    onTouchEnd={() => setActiveDirection(null)}
                    className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center transition shadow-md cursor-pointer ${
                      activeDirection === 'right'
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                    <span className="text-[9px] font-mono mt-0.5">D</span>
                  </button>

                  {/* Bottom Left: Tilt Down */}
                  <button
                    type="button"
                    onClick={() => handlePTZAdjust(0, -10)}
                    title="Tilt Down"
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer transition shadow-2xs"
                  >
                    <span className="text-[10px] font-mono">T-</span>
                  </button>

                  {/* Down: BACKWARD (S) */}
                  <button
                    type="button"
                    onMouseDown={() => handleDriveMove('backward')}
                    onMouseUp={() => setActiveDirection(null)}
                    onTouchStart={() => handleDriveMove('backward')}
                    onTouchEnd={() => setActiveDirection(null)}
                    className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center transition shadow-md cursor-pointer ${
                      activeDirection === 'backward'
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    <ArrowDown className="w-5 h-5" />
                    <span className="text-[9px] font-mono mt-0.5">S</span>
                  </button>

                  {/* Bottom Right: Tilt Up */}
                  <button
                    type="button"
                    onClick={() => handlePTZAdjust(0, 10)}
                    title="Tilt Up"
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer transition shadow-2xs"
                  >
                    <span className="text-[10px] font-mono">T+</span>
                  </button>

                </div>
              </div>

              {/* Right: Speed Sliders (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Linear Speed Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <label>{t.sliderLinearSpeed}</label>
                    <span className="font-mono text-blue-600 font-extrabold">{linearSpeed.toFixed(2)} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.50"
                    step="0.05"
                    value={linearSpeed}
                    onChange={(e) => setLinearSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0.10 m/s (Cautious)</span>
                    <span>0.30 m/s</span>
                    <span>0.50 m/s (Max)</span>
                  </div>
                </div>

                {/* Angular Speed Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <label>{t.sliderAngularSpeed}</label>
                    <span className="font-mono text-indigo-600 font-extrabold">{angularSpeed.toFixed(2)} rad/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="1.20"
                    step="0.05"
                    value={angularSpeed}
                    onChange={(e) => setAngularSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0.20 rad/s (Fine)</span>
                    <span>0.70 rad/s</span>
                    <span>1.20 rad/s (Quick)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Target Room Inspection Chips */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-600 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.quickInspectionTitle}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickInspect('Khu vực Bếp (Bếp Ga)', 'Kitchen Stove (Zone B)', 'FIRE_CHECK')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.chipKitchenStove}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickInspect('Cửa Chính Vào Nhà', 'Front Door (Zone A)', 'NAVIGATE_AND_INSPECT')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <DoorClosed className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.chipFrontDoor}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickInspect('Phòng Khách (Zone A)', 'Living Room Zone A', 'PATROL_CYCLE')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.chipLivingRoom}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickInspect('Ban Công BBQ', 'Balcony BBQ Area', 'FIRE_CHECK')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>{t.chipBalcony}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ==========================================
            RIGHT 40% (5 COLS): AI VOICE & TEXT MULTI-MODAL COMMAND CENTER
           ========================================== */}
        <div className="lg:col-span-5 flex flex-col h-[750px] bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Command Center Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold text-slate-900">{t.commandCenterTitle}</h2>
                <p className="text-[10px] text-slate-500 font-medium">{t.commandCenterSubtitle}</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase">
              Whisper STT
            </span>
          </div>

          {/* Interactive Chat/Command Message Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Bot className="w-10 h-10 text-slate-300" />
                <p className="text-xs">{t.chatFeedEmpty}</p>
              </div>
            ) : (
              messages.map((msg) => {
                
                // 1. User message bubble
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end items-start space-x-2.5 animate-in fade-in">
                      <div className="max-w-[85%] bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-none shadow-md shadow-blue-600/15 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-blue-200">
                          <span className="font-bold flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{t.senderUser}</span>
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {msg.isVoice ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 bg-blue-700/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                              <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                              <span>{msg.voiceDurationSec}s Audio Transcript</span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed">
                              "{lang === 'vi' ? msg.textVI : msg.textEN}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium leading-relaxed">
                            {lang === 'vi' ? msg.textVI : msg.textEN}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                // 2. AI Intent Parser bubble
                if (msg.sender === 'ai_parser' && msg.parsedIntent) {
                  return (
                    <div key={msg.id} className="flex items-start space-x-2.5 animate-in fade-in">
                      <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-1 border border-purple-200">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="max-w-[88%] bg-purple-50/70 border border-purple-200 text-purple-950 p-3 rounded-2xl rounded-tl-none text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-[10px] text-purple-700 font-bold">
                          <span>AI NLU INTENT PARSER</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="font-mono">
                            <span className="font-extrabold text-purple-900">Intent: </span>
                            <span className="bg-purple-200/80 px-1.5 py-0.5 rounded font-black text-[11px] text-purple-900">
                              {msg.parsedIntent.intent}
                            </span>
                          </div>
                          <div className="text-[11px] text-purple-800">
                            <span className="font-bold">Target: </span>{msg.parsedIntent.target}
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-purple-200/60 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-purple-600 font-bold">Confidence: {msg.parsedIntent.confidence}%</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            msg.parsedIntent.status === 'executing' 
                              ? 'bg-amber-100 text-amber-800 animate-pulse' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {msg.parsedIntent.status === 'executing' ? t.statusExecuting : t.statusCompleted}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 3. Robot Response bubble
                if (msg.sender === 'robot' && msg.robotResponse) {
                  return (
                    <div key={msg.id} className="flex items-start space-x-2.5 animate-in fade-in">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1 border border-emerald-200">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="max-w-[88%] bg-white border border-slate-200 text-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="font-bold text-slate-700">{t.senderRobot}</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <p className="text-xs font-medium text-slate-800 leading-relaxed">
                          {lang === 'vi' ? msg.robotResponse.textVI : msg.robotResponse.textEN}
                        </p>

                        {/* Snapshot Thumbnail if attached */}
                        {msg.robotResponse.snapshotUrl && (
                          <div className="pt-1 space-y-1.5">
                            <div 
                              onClick={() => setSelectedSnapshot(msg.robotResponse?.snapshotUrl || null)}
                              className="relative rounded-xl overflow-hidden border border-slate-200 group/img cursor-pointer max-h-40"
                            >
                              <img 
                                src={msg.robotResponse.snapshotUrl} 
                                alt="Robot Inspection"
                                className="w-full h-36 object-cover group-hover/img:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-xs font-bold space-x-1.5">
                                <Maximize2 className="w-4 h-4" />
                                <span>Click to Enlarge 1080p</span>
                              </div>
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold">
                                1080p Verification
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                              <span>{lang === 'vi' ? msg.robotResponse.snapshotCaptionVI : msg.robotResponse.snapshotCaptionEN}</span>
                              <span className="text-emerald-600 font-bold">Verified OK</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Preset Quick Voice Commands */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 shrink-0 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              {t.presetCommandsLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSendCommand(lang === 'vi' ? 'Bạn đang ở đâu?' : 'Where are you now?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
              >
                "{t.presetWhereAreYou}"
              </button>
              <button
                type="button"
                onClick={() => handleSendCommand(lang === 'vi' ? 'Bắt đầu tuần tra ngay bây giờ.' : 'Start patrol now.')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
              >
                "{t.presetStartPatrol}"
              </button>
              <button
                type="button"
                onClick={() => handleSendCommand(lang === 'vi' ? 'Quay về dock sạc pin.' : 'Go back to charging dock.')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
              >
                "{t.presetBackToDock}"
              </button>
              <button
                type="button"
                onClick={() => handleSendCommand(lang === 'vi' ? 'Kiểm tra bếp ga xem đã tắt chưa.' : 'Check if kitchen gas stove is off.')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
              >
                "{t.presetCheckStove}"
              </button>
            </div>
          </div>

          {/* Multi-Modal Input Bar (Push-to-Talk + Text Input) */}
          <div className="p-3.5 border-t border-slate-200 bg-white space-y-2 shrink-0">
            
            {/* Push-to-Talk Recording Wave Banner if active */}
            {isHoldingMic && (
              <div className="p-3 rounded-2xl bg-red-500 text-white flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2.5">
                  <Mic className="w-5 h-5 animate-bounce" />
                  <div>
                    <div className="text-xs font-black">{t.micListening}</div>
                    <div className="text-[10px] text-red-100 font-mono">Whisper STT Engine • Recording: {micTimer.toFixed(1)}s</div>
                  </div>
                </div>
                <span className="text-xs font-black tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-xl">
                  {t.btnReleaseToSend}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              
              {/* Push-to-Talk Large Button */}
              <button
                type="button"
                onMouseDown={handleMicStart}
                onMouseUp={handleMicEnd}
                onTouchStart={handleMicStart}
                onTouchEnd={handleMicEnd}
                title={t.btnHoldToSpeak}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 transition cursor-pointer shrink-0 shadow-md ${
                  isHoldingMic
                    ? 'bg-red-600 text-white ring-4 ring-red-300 scale-95'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Mic className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{isHoldingMic ? t.btnReleaseToSend : t.btnHoldToSpeak}</span>
              </button>

              {/* Text input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCommand(textInput);
                }}
                className="flex-1 flex items-center space-x-1.5"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.placeholderTextInput}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder:text-slate-400"
                />
                
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl transition cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
