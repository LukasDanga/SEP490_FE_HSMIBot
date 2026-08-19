export type Language = 'vi' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  robotId: string;
  robotName: string;
}

export interface UserSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile' | 'tablet';
}

export interface UserProfileDetails {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  dialCode: string;
  avatar: string;
  timezone: string;
  preferredLanguage: string;
  villaAddress: string;
  robotId: string;
  robotName: string;
  twoFactorEnabled: boolean;
  memberSince: string;
  verified: boolean;
  sessions: UserSession[];
}

export type RobotMode = 'idle' | 'patrol' | 'manual' | 'docking' | 'alert' | 'charging';

export interface RobotTelemetry {
  battery: number;
  isCharging: boolean;
  isDocked: boolean;
  ros2Connected: boolean;
  cloudSync: boolean;
  mode: RobotMode;
  currentZone: string;
  speed: number; // m/s
  fps: number;
  lidarPoints: number;
  temperature: number; // °C
  signalStrength: number; // dBm / %
  cpuUsage: number; // %
  ramUsage: number; // %
  activeNodeCount: number;
  odometryDistance: number; // km
}

export type IncidentSeverity = 'danger' | 'warning' | 'info' | 'safe';

export interface SecurityIncident {
  id: string;
  severity: IncidentSeverity;
  titleVI: string;
  titleEN: string;
  descVI: string;
  descEN: string;
  timestamp: string;
  date?: string;
  zoneVI: string;
  zoneEN: string;
  snapshotType: 'person' | 'fire' | 'pet' | 'door' | 'system';
  eventType?: 'fire_heat' | 'intruder' | 'patrol' | 'system_obstacle' | 'door_window';
  snapshotUrl?: string;
  videoClipUrl?: string;
  videoDurationSec?: number;
  actionTakenVI?: string;
  actionTakenEN?: string;
  sensorData?: {
    tempDeg?: number;
    smokePpm?: number;
    flameDetected?: boolean;
    confidencePct?: number;
    lidarDistanceM?: number;
    batteryLevel?: number;
  };
  timeline?: {
    time: string;
    eventVI: string;
    eventEN: string;
  }[];
  resolved: boolean;
}

export interface PatrolWaypointItem {
  id: string;
  nameVI: string;
  nameEN: string;
  roomVI: string;
  roomEN: string;
  actionVI: string;
  actionEN: string;
  dwellSeconds: number;
  x: number; // 0 - 100% on floorplan
  y: number; // 0 - 100%
  sensors: ('camera' | 'lidar' | 'thermal' | 'smoke' | 'motion' | 'ptz')[];
  speedLimit?: number; // m/s
}

export interface PatrolSchedule {
  id: string;
  nameVI: string;
  nameEN: string;
  triggerType: 'time' | 'away_mode' | 'recurring';
  triggerDisplayVI: string;
  triggerDisplayEN: string;
  time: string; // e.g. "01:00 AM" or "Every 2 hours"
  frequencyVI: string;
  frequencyEN: string;
  days: string[];
  zonesVI: string[];
  zonesEN: string[];
  routeNameVI: string;
  routeNameEN: string;
  waypointsCount: number;
  active: boolean;
  mode: 'stealth' | 'deterrent' | 'quick';
  lastRun?: string;
  nextRun?: string;
}

export interface MapWaypoint {
  id: string;
  nameVI: string;
  nameEN: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'dock' | 'patrol_point' | 'checkpoint' | 'nogo_zone';
}

export type SlamZoneType = 'virtual_wall' | 'keep_out' | 'slow_speed' | 'room_partition';
export type SlamDrawingTool = 'select' | 'virtual_wall' | 'keep_out' | 'slow_speed' | 'room_partition' | 'dock_calibration';

export interface SlamZone {
  id: string;
  nameVI: string;
  nameEN: string;
  type: SlamZoneType;
  visible: boolean;
  color?: string;
  maxSpeed?: number; // m/s e.g. 0.2
  activeTimeRule?: 'all_day' | 'night_only' | 'custom';
  timeRange?: string; // e.g. "22:00 - 06:00"
  // For walls: line (x1, y1) -> (x2, y2)
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  // For zones & rooms: box (x, y, width, height) in percentage (0-100)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  areaM2?: number;
  floorLabel?: string;
}

export interface SlamDockCalibration {
  x: number;
  y: number;
  angle: number; // 0 - 360 degrees
  nameVI: string;
  nameEN: string;
  clearanceRadius: number; // in meters (e.g. 0.8)
  dockingSpeed: number; // m/s
  autoAlign: boolean;
}

export interface SlamMapMetadata {
  name: string;
  version: string;
  resolution: number; // 0.05 m/pixel
  origin: [number, number, number];
  occupiedThresh: number;
  freeThresh: number;
  negate: number;
  lastSaved: string;
  totalAreaM2: number;
  loopClosures: number;
  pointsCount: number;
}

export type SecurityMode = 'home' | 'away' | 'night';

export interface FaceProfile {
  id: string;
  name: string;
  relationship: 'owner' | 'spouse' | 'child' | 'guest' | 'relative' | 'staff';
  relationshipVI: string;
  relationshipEN: string;
  avatarUrl: string;
  angles: {
    front: string;
    left?: string;
    right?: string;
  };
  embeddingStatus: 'synced' | 'syncing' | 'pending';
  vectorDimension: number;
  matchConfidence: number; // e.g. 99.8
  lastSeenVI: string;
  lastSeenEN: string;
  enrolledDate: string;
  accessLevel: 'full_admin' | 'resident' | 'scheduled';
  scheduleRestrictionsVI?: string;
  scheduleRestrictionsEN?: string;
}

export interface IntruderAlert {
  id: string;
  titleVI: string;
  titleEN: string;
  timestamp: string;
  locationVI: string;
  locationEN: string;
  status: 'unverified' | 'verified_intruder' | 'marked_family' | 'dismissed';
  classification: 'stranger' | 'known_family' | 'false_alarm';
  confidence: number; // e.g. 98.6
  croppedFaceUrl: string;
  fullSnapshotUrl: string;
  coordinates: { x: number; y: number; zone: string };
  lidarHeightCm: number;
  thermalSignature: number; // 36.8 °C
  sensorTriggered: string[];
  detailsVI: string;
  detailsEN: string;
  alarmTriggered?: boolean;
}

export type FireSeverityLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4';

export interface FireSeverityConfigItem {
  id: FireSeverityLevel;
  levelNumber: number;
  nameVI: string;
  nameEN: string;
  tagVI: string;
  tagEN: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  // Trigger Conditions
  tempMin: number;
  tempMax: number;
  smokePpmMin: number;
  smokePpmMax?: number;
  flameSensorRequired: boolean;
  rateOfRiseDegPerMin?: number; // e.g. > 5 deg/min
  pollingIntervalMs: number;
  // Actions
  enableTts: boolean;
  ttsMessageVI: string;
  ttsMessageEN: string;
  enableBeacon: boolean;
  beaconMode: 'off' | 'yellow_strobe' | 'red_pulse' | 'emergency_flashing';
  enableLiveStreamRecord: boolean;
  recordDurationSeconds: number;
  enableBuzzer: boolean;
  buzzerDecibel: number; // 85dB
  enablePushNotification: boolean;
  enableEmergencySmsCall: boolean;
  enableMapCoordBroadcast: boolean;
  enableAutonomousEvac: boolean;
  evacTarget: 'safe_distance' | 'nearest_fire_exit' | 'stay_and_monitor';
}

export interface EnvironmentSensorsLive {
  ambientTemp: number; // e.g. 27.4 °C
  tempStatus: 'normal' | 'warm' | 'critical';
  smokePpm: number; // e.g. 110 ppm
  smokeStatus: 'safe' | 'elevated' | 'danger';
  opticalFlameDetected: boolean; // false = Not Detected
  flameStatus: 'safe' | 'flame_detected';
  flameWavelengthNm: string; // 760nm - 1100nm
  humidityRh: number; // 55%
  humidityStatus: 'optimal' | 'dry' | 'humid';
  dewPoint: number; // °C
  coPpm: number;
  lpgPpm: number;
  lastUpdated: string;
}

export interface FireIncidentHistoryItem {
  id: string;
  timestamp: string;
  zoneVI: string;
  zoneEN: string;
  level: FireSeverityLevel;
  levelLabelVI: string;
  levelLabelEN: string;
  tempRecorded: number;
  smokePpmRecorded: number;
  flameSensorValue: boolean;
  actionsExecutedVI: string[];
  actionsExecutedEN: string[];
  status: 'resolved' | 'active_monitoring' | 'verified_extinguished';
}

export type CommandMessageSender = 'user' | 'ai_parser' | 'robot' | 'system';

export interface CommandChatMessage {
  id: string;
  sender: CommandMessageSender;
  timestamp: string;
  isVoice?: boolean;
  voiceDurationSec?: number;
  textVI?: string;
  textEN?: string;
  parsedIntent?: {
    intent: string;
    target: string;
    actionType: 'NAVIGATE_AND_INSPECT' | 'PATROL_CYCLE' | 'STATUS_QUERY' | 'DOCK_CHARGING' | 'EMERGENCY_STOP' | 'FIRE_CHECK';
    confidence: number; // e.g. 99.2%
    status: 'executing' | 'completed' | 'queued' | 'failed';
  };
  robotResponse?: {
    textVI: string;
    textEN: string;
    snapshotUrl?: string;
    snapshotCaptionVI?: string;
    snapshotCaptionEN?: string;
    currentZoneVI?: string;
    currentZoneEN?: string;
    status: 'idle' | 'moving' | 'inspecting' | 'arrived' | 'charging';
  };
}

export interface PTZCameraState {
  panDeg: number; // -180 to +180
  tiltDeg: number; // -30 to +90
  zoomLevel: number; // 1.0x to 5.0x
  nightVisionIR: boolean;
  micActive: boolean;
  audioSpeakerActive: boolean;
  isRecording: boolean;
  recordDurationSeconds: number;
  fps: number;
  latencyMs: number;
  resolution: string;
  bitrateMbps: number;
  wifiSignalDbm: number;
  batteryPct: number;
}



