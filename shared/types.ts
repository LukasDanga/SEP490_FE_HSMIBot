export type Language = 'vi' | 'en';

// Only 2 user roles: admin (Homeowner / Chủ nhà) and member (Thành viên)
export type UserRole = 'admin' | 'member';
export type UserCategory = 'owner' | 'resident' | 'engineer' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole; // 'admin' = Homeowner (Chủ nhà), 'member' = Thành viên
  category: UserCategory;
  robotId: string;
  robotName: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole; // 'admin' = Homeowner (Chủ nhà), 'member' = Thành viên
  category: UserCategory;
  categoryNameVI: string;
  categoryNameEN: string;
  robotId: string;
  robotName: string;
  phone: string;
  dialCode: string;
  villaAddress: string;
  permissions: string[];
  scheduleRestrictionsVI?: string;
  scheduleRestrictionsEN?: string;
  memberSince: string;
  verified: boolean;
  twoFactorEnabled: boolean;
  status: 'active' | 'inactive';
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
  fps?: number;
  lidarPoints?: number;
  temperature: number;
  signalStrength: number;
  cpuUsage?: number;
  ramUsage?: number;
  activeNodeCount?: number;
}
