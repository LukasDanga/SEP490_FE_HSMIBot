import { Language } from '../types';

export const translations = {
  vi: {
    // Brand & App Bar
    brandName: 'HSMIBot OS',
    brandTagline: 'Robot Quản Gia & Giám Sát An Ninh Tư Gia',
    systemOnline: 'Hệ thống Sẵn sàng',
    systemConnecting: 'Đang kết nối DDS...',

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
    emailPlaceholder: 'owner@hsmibot.io',
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

    // Quick Demo Logins
    demoQuickLogin: 'Đăng nhập nhanh (Tài khoản mẫu):',
    demoOwner: 'Chủ nhà (VIP)',
    demoSecurity: 'Kỹ thuật ROS2',

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

    // Dashboard Preview (after login)
    dashGreeting: 'Xin chào,',
    dashRobotTitle: 'Robot Quản Gia HSMIBot',
    dashStatusOnDuty: 'Đang tuần tra tự hành',
    dashBattery: 'Pin',
    dashSignal: 'Wi-Fi 5GHz',
    dashTemp: 'Nhiệt độ',
    dashRos2: 'ROS2 Galactic',
    dashOnline: 'Đã kết nối',
    dashMode: 'Chế độ hiện tại',
    dashModePatrol: 'Tuần tra Khu A - Phòng Khách',
    quickActions: 'Lối tắt điều khiển nhanh',
    actLiveCam: 'Camera trực tiếp',
    actPatrol: 'Bắt đầu tuần tra',
    actReturnDock: 'Về trạm sạc',
    actEmergency: 'Dừng khẩn cấp',
    btnLogout: 'Đăng xuất tài khoản',
  },
  en: {
    // Brand & App Bar
    brandName: 'HSMIBot OS',
    brandTagline: 'Autonomous Butler Robot & Home Security Hub',
    systemOnline: 'System Ready',
    systemConnecting: 'Connecting DDS...',

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
    emailPlaceholder: 'owner@hsmibot.io',
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

    // Quick Demo Logins
    demoQuickLogin: 'Quick Demo Credentials:',
    demoOwner: 'Owner (VIP)',
    demoSecurity: 'ROS2 Engineer',

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

    // Dashboard Preview (after login)
    dashGreeting: 'Hello,',
    dashRobotTitle: 'HSMIBot Alpha Sentry',
    dashStatusOnDuty: 'Autonomous Patrol Active',
    dashBattery: 'Battery',
    dashSignal: 'Wi-Fi 5GHz',
    dashTemp: 'Temperature',
    dashRos2: 'ROS2 Galactic',
    dashOnline: 'Connected',
    dashMode: 'Current Mode',
    dashModePatrol: 'Patrol: Living Room Zone A',
    quickActions: 'Quick Controls',
    actLiveCam: 'Live Camera',
    actPatrol: 'Start Patrol',
    actReturnDock: 'Return to Dock',
    actEmergency: 'Emergency Stop',
    btnLogout: 'Sign Out',
  },
};
