import { Language } from '../types';

export const translations = {
  vi: {
    // Brand & App Bar
    brandName: 'HSMIBot OS',
    brandTagline: 'Robot Quản Gia & Giám Sát An Ninh Tư Gia',
    systemOnline: 'Hệ thống Sẵn sàng',
    systemConnecting: 'Đang kết nối DDS...',

    // 5 Bottom Navigation Tabs
    bottomNavHome: 'Trang chủ',
    bottomNavCamera: 'Camera',
    bottomNavMap: 'Bản đồ',
    bottomNavLogs: 'Nhật ký',
    bottomNavSettings: 'Cài đặt',

    // Role Badges
    roleHomeowner: 'Chủ nhà (Homeowner)',
    roleMember: 'Thành viên (Member)',

    // Screen Titles
    welcomeBack: 'Chào mừng trở lại! 👋',
    loginSubtext: 'Đăng nhập để điều khiển robot và giám sát an ninh.',
    createAccountHeader: 'Đăng ký & Ghép nối Robot 🚀',
    createAccountSubtext: 'Thiết lập tài khoản chủ nhà và kết nối phần cứng.',

    // Tabs
    tabLogin: 'Đăng nhập',
    tabRegister: 'Đăng ký mới',

    // Fields
    emailOrUsername: 'Email hoặc Tài khoản',
    emailAddress: 'Địa chỉ Email',
    emailPlaceholder: 'admin.khang@hsmibot.io',
    registerEmailPlaceholder: 'owner@hsmibot.io',
    password: 'Mật khẩu',
    passwordPlaceholder: '••••••••••••',
    confirmPassword: 'Xác nhận Mật khẩu',
    fullName: 'Họ và tên Chủ nhà',
    fullNamePlaceholder: 'Nguyễn Văn An',
    robotSerial: 'Mã định danh Robot (Serial)',
    robotSerialPlaceholder: 'HSMI-8924-XXXX',
    scanQrBtn: 'Quét mã QR',
    scanQrHint: 'Mã QR ở mặt dưới dock sạc hoặc tem thiết bị',

    // Auth Actions
    forgotPassword: 'Quên mật khẩu?',
    rememberMe: 'Ghi nhớ đăng nhập',
    useBiometrics: 'Face ID / Vân tay',
    signInButton: 'Đăng nhập',
    signingIn: 'Đang xác thực bảo mật...',
    orContinueWith: 'hoặc tiếp tục với',
    googleSignIn: 'Google',
    appleSignIn: 'Apple ID',
    noAccountPrompt: 'Chưa có tài khoản quản trị?',
    pairNewRobotPrompt: 'Đăng ký & Ghép nối ngay',
    alreadyHaveAccount: 'Đã có tài khoản?',
    loginNow: 'Đăng nhập ngay',

    // 4 Quick Demo Logins (1 Admin = Chủ nhà & 3 Members = Thành viên)
    demoQuickLogin: 'Đăng nhập nhanh mẫu (1 Chủ nhà & 3 Thành viên):',
    demoAdmin: '1. Chủ nhà (Admin)',
    demoResident: '2. Member (Gia đình)',
    demoEngineer: '3. Member (Kỹ thuật)',
    demoGuest: '4. Member (Giúp việc)',

    // Step Progress
    stepProfile: '1. Hồ sơ',
    stepRobotLink: '2. Ghép nối',
    stepActivation: '3. Kích hoạt',
    nextStepBtn: 'Tiếp tục Ghép nối',
    prevStepBtn: 'Quay lại',
    createAndPairBtn: 'Tạo tài khoản & Kích hoạt',

    // Password Checks
    strengthWeak: 'Yếu',
    strengthFair: 'Trung bình',
    strengthGood: 'Khá',
    strengthStrong: 'Rất mạnh',
    reqLength: 'Tối thiểu 8 ký tự',
    reqUpper: 'Có chữ hoa (A-Z)',
    reqNumber: 'Có số (0-9)',
    reqSpecial: 'Có ký tự đặc biệt (!@#$)',
    passwordMatch: 'Mật khẩu khớp',
    passwordMismatch: 'Mật khẩu không khớp',

    // Terms
    agreeTermsPrefix: 'Tôi đồng ý với',
    termsOfService: 'Điều khoản dịch vụ',
    andConjunction: 'và',
    privacyPolicy: 'Chính sách bảo mật PII',
    mustAcceptTerms: 'Vui lòng đồng ý với Điều khoản & Chính sách bảo mật.',

    // Biometric & Handshake
    biometricPrompt: 'Xác thực sinh trắc học để đăng nhập HSMIBot OS',
    biometricScanning: 'Đang xác thực Face ID / Sinh trắc học...',
    biometricSuccess: 'Xác thực sinh trắc học thành công!',
    biometricFailed: 'Không thể nhận diện. Vui lòng thử lại hoặc dùng mật khẩu.',

    // Activation Animation Stages
    activatingRobot: 'Đang kích hoạt liên kết DDS & phần cứng...',
    stage1Dds: 'Khởi tạo kênh truyền ROS2 DDS mã hóa AES-256...',
    stage2Sensors: 'Hiệu chuẩn LiDAR 360° & RealSense AI NPU...',
    stage3Cert: 'Trao đổi chứng chỉ định danh Ed25519...',
    stage4Done: 'Kích hoạt thành công! Robot đã sẵn sàng hoạt động.',
    enterPortalBtn: 'Vào Bảng điều khiển ngay 🚀',

    // Modals
    forgotModalTitle: 'Khôi phục Mật khẩu',
    forgotModalDesc: 'Nhập email đã đăng ký để nhận mã OTP khôi phục.',
    sendOtpBtn: 'Gửi mã OTP',
    otpSentSuccess: 'Mã OTP đã được gửi về email của bạn!',
    closeModal: 'Đóng',

    qrModalTitle: 'Quét mã QR Ghép nối Robot',
    qrModalDesc: 'Căn chỉnh camera vào mã QR dưới đáy robot hoặc trạm sạc.',
    simulatedScanBtn: 'Mô phỏng Quét mã QR Thành công',

    termsModalTitle: 'Điều khoản & Bảo mật Dữ liệu',
    termsAccept: 'Tôi đã hiểu & Đồng ý',

    // Dashboard Screen (Streamlined Web-matching)
    dashGreeting: 'Xin chào,',
    dashRobotTitle: 'Robot Quản Gia HSMIBot',
    dashStatusOnDuty: 'Đang tuần tra tự hành',
    patrolStateTitle: 'Trạng thái Tuần tra',
    patrolStateAutonomous: 'Đang tự hành',
    patrolStateRecharging: 'Đang nạp năng lượng',
    patrolStateStandby: 'Sẵn sàng lệnh',
    smartDockTitle: 'Trạm Sạc Thông Minh',
    dockedStatus: 'Ở trạm sạc',
    undockedStatus: 'Đang hoạt động',
    chargingFastLabel: '54.6V • 4.2A Sạc nhanh',
    batteryEstimatedRuntime: 'Thời lượng ~4.8h',
    ros2EdgeTitle: 'ROS2 Galactic Edge',
    activeNodesLabel: '16 Nodes Hoạt động',
    ros2Metrics: 'CPU: 34% • RAM: 48%',
    ros2SlaBadge: '99.98% SLA',
    hardwareSafetyTitle: 'An Toàn Cơ Khí',
    emergencyStopBtn: 'DỪNG KHẨN CẤP',
    emergencyBrakeSubtitle: 'Khóa động cơ tức thì',

    liveFeedHeading: 'Luồng Camera Tuần tra Trực tiếp 4K',
    liveFeedBadge: '30 FPS • H.265',
    aiBoxToggle: 'AI Bounding Box',
    quickRouteDispatchHeading: 'Điều hướng nhanh tuyến:',
    routeLivingRoom: 'Phòng khách (Khu A)',
    routeKitchen: 'Bếp ăn & Ban công',
    routePerimeter: 'Tuần tra chu vi toàn nhà',

    lidarRadarHeading: 'Bán kính Quét LiDAR 360°',
    radarScanRate: '25 Hz',
    envSensorsHeading: 'Cảm biến Môi trường',
    envTemp: 'Nhiệt độ',
    envSmoke: 'Khói MQ-2',
    envFlame: 'Quang phổ Lửa',
    envHumidity: 'Độ ẩm',
    statusSafe: 'An toàn',
    statusNormal: 'Bình thường',
    statusNoFlame: 'Không phát hiện',

    recentIncidentsHeading: 'Nhật ký An ninh Gần đây',
    viewAllIncidents: 'Xem tất cả',
    incident1Title: 'Đã nhận diện: Sarah Nguyễn (VIP)',
    incident1Desc: 'Phòng khách Khu A • Khớp 98.6% AI FaceNet',
    incident2Title: 'Hoàn thành chu kỳ tuần tra Khu B',
    incident2Desc: '0 nguy cơ nhiệt • Lưới LiDAR an toàn 100%',

    quickActions: 'Lối tắt điều khiển nhanh',
    actLiveCam: 'Camera trực tiếp',
    actPatrol: 'Bắt đầu tuần tra',
    actPausePatrol: 'Tạm dừng tuần tra',
    actReturnDock: 'Về trạm sạc',
    actEmergency: 'Dừng khẩn cấp',
    btnLogout: 'Đăng xuất tài khoản',

    // Placeholder Screens for Camera, Map, Logs, Settings
    underDevTitle: 'Tính năng đang phát triển 🚧',
    underDevDesc: 'Màn hình này đang trong lộ trình phát triển. Bạn có thể quay lại sau khi chi tiết chức năng được cập nhật.',
    underDevReadyTag: 'SẮP RA MẮT',
    backToHome: 'Quay lại Trang chủ',
    camScreenTitle: 'Hệ thống Camera 4K & Điều khiển PTZ',
    camScreenSub: 'Xem trực tiếp đa góc, xoay góc Pan/Tilt, đàm thoại 2 chiều và chụp ảnh AI.',
    mapScreenTitle: 'Bản đồ SLAM & Điều phối Tự hành Nav2',
    mapScreenSub: 'Bản đồ 2D Occupancy Grid, vẽ tường ảo, vùng cấm và định vị trạm sạc Dock.',
    logsScreenTitle: 'Nhật ký Sự cố & Báo cáo Kiểm toán',
    logsScreenSub: 'Lịch sử phát hiện người lạ, cảnh báo nhiệt/khói và video xem lại 1080p.',
    settingsScreenTitle: 'Cài đặt Hệ thống & Hồ sơ Chủ nhà',
    settingsScreenSub: 'Quản lý thành viên, cấu hình thông báo khẩn cấp 2FA và bảo mật ROS2.',
  },
  en: {
    // Brand & App Bar
    brandName: 'HSMIBot OS',
    brandTagline: 'Autonomous Butler Robot & Home Security Hub',
    systemOnline: 'System Ready',
    systemConnecting: 'Connecting DDS...',

    // 5 Bottom Navigation Tabs
    bottomNavHome: 'Home',
    bottomNavCamera: 'Camera',
    bottomNavMap: 'Map',
    bottomNavLogs: 'Logs',
    bottomNavSettings: 'Settings',

    // Role Badges
    roleHomeowner: 'Homeowner (Admin)',
    roleMember: 'Member',

    // Screen Titles
    welcomeBack: 'Welcome back! 👋',
    loginSubtext: 'Log in to control your butler robot and monitor security.',
    createAccountHeader: 'Register & Pair Robot 🚀',
    createAccountSubtext: 'Set up your homeowner profile and pair robot hardware.',

    // Tabs
    tabLogin: 'Sign In',
    tabRegister: 'Sign Up',

    // Fields
    emailOrUsername: 'Email or Username',
    emailAddress: 'Email Address',
    emailPlaceholder: 'admin.khang@hsmibot.io',
    registerEmailPlaceholder: 'owner@hsmibot.io',
    password: 'Password',
    passwordPlaceholder: '••••••••••••',
    confirmPassword: 'Confirm Password',
    fullName: 'Owner Full Name',
    fullNamePlaceholder: 'Alex Henderson',
    robotSerial: 'Robot Serial / Pairing Key',
    robotSerialPlaceholder: 'HSMI-8924-XXXX',
    scanQrBtn: 'Scan QR Code',
    scanQrHint: 'Find the QR code under the docking station or box',

    // Auth Actions
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    useBiometrics: 'Face ID / Fingerprint',
    signInButton: 'Sign In',
    signingIn: 'Authenticating credentials...',
    orContinueWith: 'or continue with',
    googleSignIn: 'Google',
    appleSignIn: 'Apple ID',
    noAccountPrompt: "Don't have an admin account?",
    pairNewRobotPrompt: 'Register & Pair Now',
    alreadyHaveAccount: 'Already have an account?',
    loginNow: 'Sign in now',

    // 4 Quick Demo Logins (1 Admin = Homeowner & 3 Members)
    demoQuickLogin: 'Quick Demo Accounts (1 Homeowner & 3 Members):',
    demoAdmin: '1. Homeowner (Admin)',
    demoResident: '2. Member (Family)',
    demoEngineer: '3. Member (Engineer)',
    demoGuest: '4. Member (Housekeeper)',

    // Step Progress
    stepProfile: '1. Profile',
    stepRobotLink: '2. Pairing',
    stepActivation: '3. Activation',
    nextStepBtn: 'Proceed to Pairing',
    prevStepBtn: 'Back',
    createAndPairBtn: 'Create Account & Activate',

    // Password Checks
    strengthWeak: 'Weak',
    strengthFair: 'Fair',
    strengthGood: 'Good',
    strengthStrong: 'Strong',
    reqLength: 'At least 8 characters',
    reqUpper: 'Uppercase letter (A-Z)',
    reqNumber: 'Number (0-9)',
    reqSpecial: 'Special symbol (!@#$)',
    passwordMatch: 'Passwords match',
    passwordMismatch: 'Passwords do not match',

    // Terms
    agreeTermsPrefix: 'I agree to the',
    termsOfService: 'Terms of Service',
    andConjunction: 'and',
    privacyPolicy: 'PII Privacy Policy',
    mustAcceptTerms: 'Please accept Terms of Service & Privacy Policy.',

    // Biometric & Handshake
    biometricPrompt: 'Authenticate with biometrics to enter HSMIBot OS',
    biometricScanning: 'Scanning Face ID / Biometrics...',
    biometricSuccess: 'Biometric authenticated successfully!',
    biometricFailed: 'Recognition failed. Please try again or use password.',

    // Activation Animation Stages
    activatingRobot: 'Activating DDS link & hardware...',
    stage1Dds: 'Initializing AES-256 encrypted ROS2 DDS channel...',
    stage2Sensors: 'Calibrating LiDAR 360° & RealSense AI NPU...',
    stage3Cert: 'Exchanging Ed25519 hardware certificates...',
    stage4Done: 'Activation successful! Robot is ready for duty.',
    enterPortalBtn: 'Enter Control Dashboard 🚀',

    // Modals
    forgotModalTitle: 'Reset Password',
    forgotModalDesc: 'Enter your registered email to receive an OTP code.',
    sendOtpBtn: 'Send OTP Code',
    otpSentSuccess: 'OTP verification code sent to your email!',
    closeModal: 'Close',

    qrModalTitle: 'Scan Robot Pairing QR Code',
    qrModalDesc: 'Align camera with the QR code under the robot dock.',
    simulatedScanBtn: 'Simulate Successful QR Scan',

    termsModalTitle: 'Terms & Data Privacy',
    termsAccept: 'I Understand & Agree',

    // Dashboard Screen (Streamlined Web-matching)
    dashGreeting: 'Hello,',
    dashRobotTitle: 'HSMIBot Alpha Sentry',
    dashStatusOnDuty: 'Autonomous Patrol Active',
    patrolStateTitle: 'Patrol State',
    patrolStateAutonomous: 'Autonomous Patrol',
    patrolStateRecharging: 'Recharging on Dock',
    patrolStateStandby: 'Standby / Ready',
    smartDockTitle: 'Autonomous Smart Dock',
    dockedStatus: 'Docked',
    undockedStatus: 'On Duty',
    chargingFastLabel: '54.6V • 4.2A Fast Charge',
    batteryEstimatedRuntime: 'Est. 4.8h runtime',
    ros2EdgeTitle: 'ROS2 Galactic Edge',
    activeNodesLabel: '16 Active Nodes',
    ros2Metrics: 'CPU: 34% • RAM: 48%',
    ros2SlaBadge: '99.98% SLA',
    hardwareSafetyTitle: 'Hardware Safety',
    emergencyStopBtn: 'EMERGENCY STOP',
    emergencyBrakeSubtitle: 'Instant Torque Cutoff',

    liveFeedHeading: 'Live 4K Autonomous Patrol Feed',
    liveFeedBadge: '30 FPS • H.265',
    aiBoxToggle: 'AI Bounding Box',
    quickRouteDispatchHeading: 'Quick Route Dispatch:',
    routeLivingRoom: 'Living Room (Zone A)',
    routeKitchen: 'Kitchen & Balcony',
    routePerimeter: 'Full Perimeter Sweep',

    lidarRadarHeading: 'LiDAR 360° Radar Field',
    radarScanRate: '25 Hz',
    envSensorsHeading: 'Environmental Telemetry',
    envTemp: 'Temperature',
    envSmoke: 'MQ-2 Smoke',
    envFlame: 'Flame Sensor',
    envHumidity: 'Humidity',
    statusSafe: 'Safe',
    statusNormal: 'Normal',
    statusNoFlame: 'Not Detected',

    recentIncidentsHeading: 'Recent Security Log',
    viewAllIncidents: 'View All',
    incident1Title: 'Recognized: Sarah Nguyễn (VIP)',
    incident1Desc: 'Living Room Zone A • 98.6% AI FaceNet match',
    incident2Title: 'Completed Patrol Zone B',
    incident2Desc: '0 thermal anomaly • LiDAR field 100% clear',

    quickActions: 'Quick Controls',
    actLiveCam: 'Live Camera',
    actPatrol: 'Start Patrol',
    actPausePatrol: 'Pause Patrol',
    actReturnDock: 'Return to Dock',
    actEmergency: 'Emergency Stop',
    btnLogout: 'Sign Out',

    // Placeholder Screens for Camera, Map, Logs, Settings
    underDevTitle: 'Feature Under Development 🚧',
    underDevDesc: 'This screen is part of our upcoming roadmap. You can return once functional specifications are provided.',
    underDevReadyTag: 'COMING SOON',
    backToHome: 'Back to Home',
    camScreenTitle: '4K Surveillance & PTZ Camera Hub',
    camScreenSub: 'Live multi-angle feeds, Pan/Tilt joystick, 2-way audio intercom and AI snapshots.',
    mapScreenTitle: 'SLAM 2D Mapping & Nav2 Dispatch',
    mapScreenSub: 'Real-time Occupancy Grid, virtual walls, keep-out zones and docking home base calibration.',
    logsScreenTitle: 'Security Incident Logs & Audit Trail',
    logsScreenSub: 'Intruder detection history, thermal/smoke warning timeline and 1080p WebRTC video playback.',
    settingsScreenTitle: 'System Settings & Homeowner Profile',
    settingsScreenSub: 'Member delegation, 2FA security credentials, push notifications and ROS2 preferences.',
  },
};
