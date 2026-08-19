import { UserAccount, RobotTelemetry } from '../types';

/**
 * 4 Predefined HSMIBot Mock Users (1 Admin & 3 Members)
 * Used across Web and Mobile for authentication simulation, role-based UI testing,
 * and permissions verification before backend API deployment.
 */
export const mockUsers: UserAccount[] = [
  // ==========================================
  // USER 1: ADMIN (Chủ nhà / Quản trị viên)
  // ==========================================
  {
    id: 'usr_admin_01',
    name: 'Luan H. Bao Khang',
    email: 'admin.khang@hsmibot.io',
    password: 'HSMIBot2026!#',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    category: 'owner',
    categoryNameVI: 'Chủ nhà (Quản trị viên)',
    categoryNameEN: 'Homeowner (System Admin)',
    robotId: 'HSMI-BOT-9042-X',
    robotName: 'HSMIBot Alpha Sentry',
    phone: '0912345678',
    dialCode: '+84',
    villaAddress: 'Villa Riverside A12, Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    permissions: [
      'ALL_PERMISSIONS',
      'MANAGE_USERS',
      'CONTROL_ROBOT',
      'VIEW_CAMERAS',
      'EDIT_SLAM_MAP',
      'MANAGE_SCHEDULES',
      'FIRE_SAFETY_ADMIN',
      'ENROLL_FACES',
      'VIEW_AUDIT_LOGS',
      'EMERGENCY_OVERRIDE',
    ],
    memberSince: 'Tháng 1, 2026',
    verified: true,
    twoFactorEnabled: true,
    status: 'active',
  },

  // ==========================================
  // USER 2: MEMBER 1 (Thành viên Gia đình)
  // ==========================================
  {
    id: 'usr_member_01',
    name: 'Sarah Nguyễn',
    email: 'sarah.nguyen@hsmibot.io',
    password: 'SarahHomeSafe88!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'member',
    category: 'resident',
    categoryNameVI: 'Người nhà (Thành viên Thường trú)',
    categoryNameEN: 'Resident (Family Member)',
    robotId: 'HSMI-BOT-9042-X',
    robotName: 'HSMIBot Alpha Sentry',
    phone: '0987654321',
    dialCode: '+84',
    villaAddress: 'Villa Riverside A12, Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    permissions: [
      'CONTROL_ROBOT',
      'VIEW_CAMERAS',
      'RECEIVE_ALERTS',
      'VOICE_COMMANDS',
      'VIEW_INCIDENTS',
      'CALL_DOCK',
    ],
    memberSince: 'Tháng 2, 2026',
    verified: true,
    twoFactorEnabled: false,
    status: 'active',
  },

  // ==========================================
  // USER 3: MEMBER 2 (Kỹ thuật viên Vận hành ROS2)
  // ==========================================
  {
    id: 'usr_member_02',
    name: 'Alex Chen',
    email: 'ros2.dev@hsmibot.io',
    password: 'ROS2GalacticStack@1',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    role: 'member',
    category: 'engineer',
    categoryNameVI: 'Kỹ thuật viên Vận hành ROS2',
    categoryNameEN: 'ROS2 Diagnostics Engineer',
    robotId: 'HSMI-BOT-9042-X',
    robotName: 'HSMIBot Alpha Sentry',
    phone: '0903112233',
    dialCode: '+84',
    villaAddress: 'Villa Riverside A12, Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    permissions: [
      'VIEW_TELEMETRY',
      'DIAGNOSTIC_SENSORS',
      'CALIBRATE_DOCK',
      'VIEW_CAMERAS',
      'SLAM_POINTCLOUD',
      'TEST_FIRE_MATRIX',
    ],
    memberSince: 'Tháng 3, 2026',
    verified: true,
    twoFactorEnabled: true,
    status: 'active',
  },

  // ==========================================
  // USER 4: MEMBER 3 (Giúp việc / Khách theo giờ)
  // ==========================================
  {
    id: 'usr_member_03',
    name: 'Trần Thị Mai',
    email: 'mai.helper@hsmibot.io',
    password: 'MaiHelperAccess2026!',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    role: 'member',
    category: 'guest',
    categoryNameVI: 'Giúp việc / Khách theo giờ',
    categoryNameEN: 'Housekeeper / Scheduled Staff',
    robotId: 'HSMI-BOT-9042-X',
    robotName: 'HSMIBot Alpha Sentry',
    phone: '0934556677',
    dialCode: '+84',
    villaAddress: 'Villa Riverside A12, Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    scheduleRestrictionsVI: '07:00 - 18:00 (Thứ 2 đến Thứ 6)',
    scheduleRestrictionsEN: '07:00 - 18:00 (Monday to Friday)',
    permissions: [
      'CALL_ROBOT',
      'VIEW_BASIC_STATUS',
      'RECEIVE_FIRE_ALERTS',
    ],
    memberSince: 'Tháng 4, 2026',
    verified: true,
    twoFactorEnabled: false,
    status: 'active',
  },
];

/**
 * Shared Mock Robot Telemetry
 */
export const mockRobotTelemetry: RobotTelemetry = {
  battery: 88,
  isCharging: false,
  isDocked: false,
  ros2Connected: true,
  cloudSync: true,
  mode: 'patrol',
  currentZone: 'Living Room Zone A',
  speed: 0.35,
  fps: 30,
  lidarPoints: 12800,
  temperature: 28.4,
  signalStrength: 85,
  cpuUsage: 34,
  ramUsage: 48,
};

/**
 * Authentication helper for mock testing
 */
export const authenticateMockUser = (
  emailOrUsername: string,
  passwordInput?: string
): UserAccount => {
  const cleanInput = emailOrUsername.trim().toLowerCase();
  
  // Exact email match
  let user = mockUsers.find((u) => u.email.toLowerCase() === cleanInput);
  
  // Username prefix match (e.g. "admin", "sarah", "ros2", "mai")
  if (!user) {
    user = mockUsers.find((u) =>
      u.email.toLowerCase().startsWith(cleanInput) ||
      u.name.toLowerCase().includes(cleanInput) ||
      u.category.toLowerCase() === cleanInput
    );
  }

  // Fallback to Admin if input contains "admin" or "khang" or "owner"
  if (!user && (cleanInput.includes('admin') || cleanInput.includes('khang') || cleanInput.includes('owner'))) {
    return mockUsers[0];
  }

  // If no match found and input has an email format, create a guest/member mock session
  if (!user && cleanInput.includes('@')) {
    return {
      id: `usr_${Date.now()}`,
      name: cleanInput.split('@')[0],
      email: cleanInput,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      role: 'member',
      category: 'resident',
      categoryNameVI: 'Thành viên mới',
      categoryNameEN: 'New Member',
      robotId: 'HSMI-BOT-9042-X',
      robotName: 'HSMIBot Alpha Sentry',
      phone: '0900000000',
      dialCode: '+84',
      villaAddress: 'Villa Riverside A12, Vinhomes Ocean Park, Gia Lâm, Hà Nội',
      permissions: ['VIEW_BASIC_STATUS', 'RECEIVE_ALERTS'],
      memberSince: 'Hôm nay',
      verified: true,
      twoFactorEnabled: false,
      status: 'active',
    };
  }

  return user || mockUsers[0];
};

/**
 * Lookup helper by User ID
 */
export const getMockUserById = (userId: string): UserAccount | undefined => {
  return mockUsers.find((u) => u.id === userId);
};

/**
 * Lookup helper by Email
 */
export const getMockUserByEmail = (email: string): UserAccount | undefined => {
  return mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
};
