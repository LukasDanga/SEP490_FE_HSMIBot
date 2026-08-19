export type Language = 'vi' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  robotId: string;
  robotName: string;
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
  speed: number;
  temperature: number;
  signalStrength: number;
}
