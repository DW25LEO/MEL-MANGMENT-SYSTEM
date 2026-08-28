import {
  LayoutDashboard,
  User,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  Award,
  Users,
  School,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  Bell,
  Settings,
  FileText,
  CalendarDays,
  MessageSquare,
  Database,
  Palette,
  Lock,
  HardDriveDownload,
  Globe2,
  Building2,
  BookMarked,
  FolderOpen,
  ListChecks,
  CheckSquare,
  Megaphone,
  Send,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { label: string; to: string; icon: LucideIcon };

export type DashboardRole =
  | 'student' | 'teacher' | 'lecturer'
  | 'school-admin' | 'tertiary-education-admin' | 'super-admin'
  | 'school-student' | 'tertiary-education-student' | 'admin';

export const roleLabels: Record<DashboardRole, string> = {
  'student': 'Student',
  'teacher': 'Teacher',
  'lecturer': 'Lecturer',
  'school-admin': 'School Admin',
  'tertiary-education-admin': 'Tertiary Education Admin',
  'super-admin': 'Super Admin',
  'school-student': 'School Student',
  'tertiary-education-student': 'Tertiary Education Student',
  'admin': 'Admin',
};

export const roleBasePaths: Record<DashboardRole, string> = {
  'student': '/student/dashboard',
  'teacher': '/teacher/dashboard',
  'lecturer': '/lecturer/dashboard',
  'school-admin': '/school-admin/dashboard',
  'tertiary-education-admin': '/tertiary-education-admin/dashboard',
  'super-admin': '/super-admin/dashboard',
  'school-student': '/school-student/dashboard',
  'tertiary-education-student': '/tertiary-education-student/dashboard',
  'admin': '/admin/dashboard',
};

// ── Student Nav ──
export const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', to: '/student/profile', icon: User },
  { label: 'Course Registration', to: '/student/courses', icon: BookOpen },
  { label: 'Exams', to: '/student/exams', icon: ClipboardCheck },
  { label: 'Results', to: '/student/results', icon: Award },
  { label: 'Payments', to: '/student/payments', icon: CreditCard },
  { label: 'Testimonials', to: '/student/testimonials', icon: MessageSquare },
];

// ── Teacher Nav ──
export const teacherNav: NavItem[] = [
  { label: 'Dashboard', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Classes', to: '/teacher/classes', icon: School },
  { label: 'My Subjects', to: '/teacher/subjects', icon: BookOpen },
  { label: 'Students', to: '/teacher/students', icon: Users },
  { label: 'Attendance', to: '/teacher/attendance', icon: CheckSquare },
  { label: 'Question Bank', to: '/teacher/question-bank', icon: Database },
  { label: 'Student Scores', to: '/teacher/scores', icon: BarChart3 },
  { label: 'Results', to: '/teacher/results', icon: Award },
  { label: 'Announcements', to: '/teacher/announcements', icon: Megaphone },
  { label: 'Profile', to: '/teacher/profile', icon: Settings },
];

// ── Lecturer Nav ──
export const lecturerNav: NavItem[] = [
  { label: 'Dashboard', to: '/lecturer/dashboard', icon: LayoutDashboard },
  { label: 'My Faculty', to: '/lecturer/faculty', icon: Building2 },
  { label: 'My Department', to: '/lecturer/department', icon: Building2 },
  { label: 'My Courses', to: '/lecturer/courses', icon: BookOpen },
  { label: 'Registered Students', to: '/lecturer/students', icon: Users },
  { label: 'Course Materials', to: '/lecturer/materials', icon: FolderOpen },
  { label: 'Question Bank', to: '/lecturer/question-bank', icon: Database },
  { label: 'Create Exam', to: '/lecturer/create-exam', icon: ListChecks },
  { label: 'Mark Exams', to: '/lecturer/mark-exams', icon: ClipboardCheck },
  { label: 'Student Scores', to: '/lecturer/scores', icon: BarChart3 },
  { label: 'Results', to: '/lecturer/results', icon: Award },
  { label: 'Announcements', to: '/lecturer/announcements', icon: Megaphone },
  { label: 'Profile', to: '/lecturer/profile', icon: Settings },
];

// ── School Admin Nav ──
export const schoolAdminNav: NavItem[] = [
  { label: 'Dashboard', to: '/school-admin/dashboard', icon: LayoutDashboard },
  { label: 'School Profile', to: '/school-admin/profile', icon: School },
  { label: 'Primary 1-5', to: '/school-admin/primary', icon: School },
  { label: 'JSS 1-3', to: '/school-admin/jss', icon: School },
  { label: 'SSS 1-3', to: '/school-admin/sss', icon: School },
  { label: 'Classes', to: '/school-admin/classes', icon: BookOpen },
  { label: 'Subjects', to: '/school-admin/subjects', icon: BookMarked },
  { label: 'Teachers', to: '/school-admin/teachers', icon: Users },
  { label: 'Students', to: '/school-admin/students', icon: User },
  { label: 'Exam Timetable', to: '/school-admin/exam-timetable', icon: CalendarDays },
  { label: 'Exams', to: '/school-admin/exams', icon: ClipboardCheck },
  { label: 'Exam Payment', to: '/school-admin/payments', icon: CreditCard },
  { label: 'Results', to: '/school-admin/results', icon: Award },
  { label: 'Report Cards', to: '/school-admin/report-cards', icon: FileText },
  { label: 'Attendance', to: '/school-admin/attendance', icon: CheckSquare },
  { label: 'Announcements', to: '/school-admin/announcements', icon: Megaphone },
  { label: 'Notifications', to: '/school-admin/notifications', icon: Send },
  { label: 'Settings', to: '/school-admin/settings', icon: Settings },
];

// ── Tertiary Education Admin Nav ──
export const tertiaryEducationAdminNav: NavItem[] = [
  { label: 'Dashboard', to: '/tertiary-education-admin/dashboard', icon: LayoutDashboard },
  { label: 'Tertiary Education Profile', to: '/tertiary-education-admin/profile', icon: GraduationCap },
  { label: 'Faculties', to: '/tertiary-education-admin/faculties', icon: Building2 },
  { label: 'Departments', to: '/tertiary-education-admin/departments', icon: Building2 },
  { label: 'Programmes', to: '/tertiary-education-admin/programmes', icon: BookMarked },
  { label: 'Levels', to: '/tertiary-education-admin/levels', icon: BarChart3 },
  { label: 'Courses', to: '/tertiary-education-admin/courses', icon: BookOpen },
  { label: 'Lecturers', to: '/tertiary-education-admin/lecturers', icon: Users },
  { label: 'Students', to: '/tertiary-education-admin/students', icon: User },
  { label: 'Exam Timetable', to: '/tertiary-education-admin/exam-timetable', icon: CalendarDays },
  { label: 'Exams', to: '/tertiary-education-admin/exams', icon: ClipboardCheck },
  { label: 'Exam Payment', to: '/tertiary-education-admin/payments', icon: CreditCard },
  { label: 'Results', to: '/tertiary-education-admin/results', icon: Award },
  { label: 'Transcripts', to: '/tertiary-education-admin/transcripts', icon: FileText },
  { label: 'Announcements', to: '/tertiary-education-admin/announcements', icon: Megaphone },
  { label: 'Notifications', to: '/tertiary-education-admin/notifications', icon: Send },
  { label: 'Settings', to: '/tertiary-education-admin/settings', icon: Settings },
];

// ── Super Admin Nav ──
export const superAdminNav: NavItem[] = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Platform Management', to: '/super-admin/platform', icon: Globe2 },
  { label: 'Tertiary Education', to: '/super-admin/tertiary', icon: GraduationCap },
  { label: 'Primary / Secondary Schools', to: '/super-admin/primary-secondary', icon: School },
  { label: 'Payment Management', to: '/super-admin/payments', icon: CreditCard },
  { label: 'Sub Admin Login Pages', to: '/super-admin/sub-admins', icon: Lock },
  { label: 'Manage Courses', to: '/super-admin/courses', icon: BookOpen },
  { label: 'Examinations', to: '/super-admin/exams', icon: ClipboardCheck },
  { label: 'Academic Terms', to: '/super-admin/terms', icon: CalendarDays },
  { label: 'Exam Types', to: '/super-admin/exam-types', icon: ListChecks },
  { label: 'Backups', to: '/super-admin/backups', icon: HardDriveDownload },
  { label: 'Create School Portal', to: '/super-admin/create-portal', icon: Building2 },
  { label: 'Backup', to: '/super-admin/backup', icon: HardDriveDownload },
  { label: 'All Users', to: '/super-admin/users', icon: Users },
  { label: 'Exam Settings', to: '/super-admin/exam-settings', icon: ClipboardCheck },
  { label: 'Settings', to: '/super-admin/settings', icon: Settings },
];

// ── School Student Nav ──
export const schoolStudentNav: NavItem[] = [
  { label: 'Dashboard', to: '/school-student/dashboard', icon: LayoutDashboard },
  { label: 'Subjects', to: '/school-student/subjects', icon: BookOpen },
  { label: 'Learning', to: '/school-student/learning', icon: BookMarked },
  { label: 'CBT Test/Exam', to: '/school-student/cbt', icon: ClipboardCheck },
  { label: 'Payment', to: '/school-student/payment', icon: CreditCard },
  { label: 'Results', to: '/school-student/results', icon: Award },
  { label: 'Settings', to: '/school-student/settings', icon: Settings },
];

// ── Tertiary Education Student Nav ──
export const tertiaryEducationStudentNav: NavItem[] = [
  { label: 'Dashboard', to: '/tertiary-education-student/dashboard', icon: LayoutDashboard },
  { label: 'Courses', to: '/tertiary-education-student/courses', icon: BookOpen },
  { label: 'Learning', to: '/tertiary-education-student/learning', icon: BookMarked },
  { label: 'CBT Test/Exam', to: '/tertiary-education-student/cbt', icon: ClipboardCheck },
  { label: 'Payment', to: '/tertiary-education-student/payment', icon: CreditCard },
  { label: 'Results', to: '/tertiary-education-student/results', icon: Award },
  { label: 'Settings', to: '/tertiary-education-student/settings', icon: Settings },
];

export const roleNavMap: Record<DashboardRole, NavItem[]> = {
  'student': studentNav,
  'teacher': teacherNav,
  'lecturer': lecturerNav,
  'school-admin': schoolAdminNav,
  'tertiary-education-admin': tertiaryEducationAdminNav,
  'super-admin': superAdminNav,
  'school-student': schoolStudentNav,
  'tertiary-education-student': tertiaryEducationStudentNav,
  'admin': superAdminNav,
};

// ── Mock Data: Student ──
export const studentStats = [
  { label: 'Registered Courses', value: '6', icon: BookOpen, color: 'primary' },
  { label: 'Upcoming Exams', value: '3', icon: ClipboardCheck, color: 'accent' },
  { label: 'Completed Exams', value: '12', icon: Award, color: 'success' },
  { label: 'Current CGPA', value: '4.2', icon: BarChart3, color: 'primary' },
];

export const studentCourses = [
  { code: 'CSC 301', name: 'Data Structures & Algorithms', credits: 3, instructor: 'Dr. A. Okonkwo', schedule: 'Mon 10:00', status: 'Registered' },
  { code: 'CSC 305', name: 'Database Systems', credits: 3, instructor: 'Prof. I. Sule', schedule: 'Wed 14:00', status: 'Registered' },
  { code: 'MTH 201', name: 'Linear Algebra', credits: 3, instructor: 'Dr. R. Bello', schedule: 'Tue 08:00', status: 'Registered' },
  { code: 'GST 101', name: 'Communication Skills', credits: 2, instructor: 'Mrs. C. Nwosu', schedule: 'Thu 12:00', status: 'Registered' },
  { code: 'CSC 309', name: 'Software Engineering', credits: 3, instructor: 'Dr. A. Okonkwo', schedule: 'Fri 16:00', status: 'Registered' },
  { code: 'STA 201', name: 'Statistics', credits: 3, instructor: 'Dr. M. Okafor', schedule: 'Mon 14:00', status: 'Registered' },
];

export const studentExams = [
  { name: 'Data Structures Midterm', course: 'CSC 301', date: 'Aug 20, 2026', time: '10:00 AM', duration: '2 hrs', status: 'Upcoming' },
  { name: 'Database Systems Quiz', course: 'CSC 305', date: 'Aug 22, 2026', time: '02:00 PM', duration: '1 hr', status: 'Upcoming' },
  { name: 'Statistics Test', course: 'STA 201', date: 'Aug 25, 2026', time: '02:00 PM', duration: '1 hr', status: 'Upcoming' },
];

export const studentResults = [
  { course: 'CSC 201', exam: 'Programming Fundamentals', score: 88, total: 100, grade: 'A', status: 'Pass', date: 'Jun 12, 2026', attempt: 1 },
  { course: 'MTH 101', exam: 'Calculus I', score: 72, total: 100, grade: 'B', status: 'Pass', date: 'Jun 15, 2026', attempt: 1 },
  { course: 'PHY 101', exam: 'General Physics', score: 65, total: 100, grade: 'C', status: 'Pass', date: 'Jun 18, 2026', attempt: 2 },
  { course: 'GST 101', exam: 'Communication Skills', score: 91, total: 100, grade: 'A', status: 'Pass', date: 'Jun 20, 2026', attempt: 1 },
  { course: 'CSC 205', exam: 'Computer Architecture', score: 45, total: 100, grade: 'F', status: 'Fail', date: 'Jun 22, 2026', attempt: 1 },
];

export const studentPayments = [
  { id: 'PAY-00482', description: 'CSC 301 Exam Fee', amount: '₦5,000', method: 'Card', status: 'Paid', date: 'Aug 10, 2026' },
  { id: 'PAY-00491', description: 'CSC 305 Exam Fee', amount: '₦5,000', method: 'Card', status: 'Paid', date: 'Aug 10, 2026' },
  { id: 'PAY-00503', description: 'STA 201 Exam Fee', amount: '₦5,000', method: 'Bank Transfer', status: 'Pending', date: 'Aug 14, 2026' },
];

export const studentAnnouncements = [
  { title: 'Midterm exams begin August 20', date: 'Aug 12, 2026', priority: 'high' },
  { title: 'Course registration deadline extended', date: 'Aug 10, 2026', priority: 'medium' },
  { title: 'New study materials uploaded for CSC 301', date: 'Aug 8, 2026', priority: 'low' },
  { title: 'Library hours extended during exam period', date: 'Aug 5, 2026', priority: 'low' },
  { title: 'Student union meeting scheduled', date: 'Aug 3, 2026', priority: 'medium' },
];

export const studentActivity = [
  { action: 'Registered for CSC 309', time: '2 hours ago' },
  { action: 'Submitted exam: CSC 201 Midterm', time: '1 day ago' },
  { action: 'Payment confirmed for CSC 301', time: '2 days ago' },
  { action: 'Downloaded result slip for MTH 101', time: '3 days ago' },
  { action: 'Updated profile photo', time: '5 days ago' },
];

// ── Mock Data: Teacher ──
export const teacherStats = [
  { label: 'Total Classes', value: '5', icon: School, color: 'primary' },
  { label: 'Total Students', value: '142', icon: Users, color: 'accent' },
  { label: 'Subjects Taught', value: '3', icon: BookOpen, color: 'success' },
  { label: 'Pending Marks', value: '8', icon: ClipboardCheck, color: 'warning' },
];

export const teacherClasses = [
  { name: 'JSS 2A — Mathematics', students: 32, schedule: 'Mon 08:00, Wed 10:00', room: 'R12', avgScore: '74%' },
  { name: 'JSS 2B — Mathematics', students: 30, schedule: 'Tue 08:00, Thu 10:00', room: 'R14', avgScore: '71%' },
  { name: 'JSS 3A — Mathematics', students: 28, schedule: 'Mon 10:00, Wed 12:00', room: 'R12', avgScore: '78%' },
  { name: 'Primary 5 — Basic Science', students: 26, schedule: 'Tue 12:00, Fri 10:00', room: 'R8', avgScore: '82%' },
  { name: 'SSS 1 — Physics', students: 26, schedule: 'Thu 14:00, Fri 12:00', room: 'Lab 1', avgScore: '69%' },
];

export const teacherSchedule = [
  { time: '08:00', class: 'JSS 2A Mathematics', room: 'R12' },
  { time: '10:00', class: 'JSS 3A Mathematics', room: 'R12' },
  { time: '12:00', class: 'Primary 5 Basic Science', room: 'R8' },
  { time: '14:00', class: 'SSS 1 Physics', room: 'Lab 1' },
];

// ── Mock Data: Lecturer ──
export const lecturerStats = [
  { label: 'Total Courses', value: '4', icon: BookOpen, color: 'primary' },
  { label: 'Total Students', value: '286', icon: Users, color: 'accent' },
  { label: 'Pending Marks', value: '23', icon: ClipboardCheck, color: 'warning' },
  { label: 'Research Papers', value: '7', icon: FileText, color: 'success' },
];

export const lecturerCourses = [
  { code: 'CSC 301', name: 'Data Structures & Algorithms', students: 64, credits: 3, schedule: 'Mon 10:00, Wed 12:00' },
  { code: 'CSC 305', name: 'Database Systems', students: 72, credits: 3, schedule: 'Tue 10:00, Thu 14:00' },
  { code: 'CSC 401', name: 'Artificial Intelligence', students: 48, credits: 3, schedule: 'Mon 14:00, Wed 16:00' },
  { code: 'CSC 501', name: 'Machine Learning', students: 42, credits: 4, schedule: 'Tue 14:00, Fri 10:00' },
];

// ── Mock Data: School Admin ──
export const schoolAdminStats = [
  { label: 'Total Students', value: '1,400', icon: Users, color: 'primary' },
  { label: 'Total Teachers', value: '48', icon: School, color: 'accent' },
  { label: 'Total Classes', value: '24', icon: BookOpen, color: 'success' },
  { label: 'Pass Rate', value: '87%', icon: Award, color: 'primary' },
];

export const schoolLevelBreakdown = [
  { level: 'Primary 1', students: 320, classes: 4, teachers: 4 },
  { level: 'Primary 2', students: 295, classes: 4, teachers: 4 },
  { level: 'Primary 3', students: 280, classes: 4, teachers: 4 },
  { level: 'Primary 4', students: 265, classes: 4, teachers: 4 },
  { level: 'Primary 5', students: 240, classes: 4, teachers: 4 },
  { level: 'JSS 1', students: 180, classes: 3, teachers: 6 },
  { level: 'JSS 2', students: 165, classes: 3, teachers: 6 },
  { level: 'JSS 3', students: 150, classes: 3, teachers: 6 },
  { level: 'SSS 1', students: 140, classes: 3, teachers: 6 },
  { level: 'SSS 2', students: 130, classes: 3, teachers: 6 },
  { level: 'SSS 3', students: 115, classes: 3, teachers: 6 },
];

// ── Mock Data: Tertiary Education Admin ──
export const tertiaryEducationAdminStats = [
  { label: 'Total Students', value: '36,000', icon: Users, color: 'primary' },
  { label: 'Total Lecturers', value: '420', icon: GraduationCap, color: 'accent' },
  { label: 'Total Programmes', value: '84', icon: BookMarked, color: 'success' },
  { label: 'Total Faculties', value: '12', icon: Building2, color: 'primary' },
];

export const tertiaryEducationFaculties = [
  { name: 'Faculty of Science', departments: 6, students: '8,200', programmes: 18 },
  { name: 'Faculty of Engineering', departments: 5, students: '6,500', programmes: 12 },
  { name: 'Faculty of Arts', departments: 7, students: '4,800', programmes: 14 },
  { name: 'Faculty of Law', departments: 3, students: '2,400', programmes: 6 },
  { name: 'Faculty of Management Sciences', departments: 4, students: '7,600', programmes: 10 },
  { name: 'Faculty of Education', departments: 5, students: '3,200', programmes: 12 },
];

// ── Mock Data: Super Admin ──
export const superAdminStats = [
  { label: 'Total Universities', value: '6', icon: GraduationCap, color: 'primary' },
  { label: 'Total Schools', value: '120+', icon: School, color: 'accent' },
  { label: 'Total Students', value: '45K+', icon: Users, color: 'success' },
  { label: 'Total Staff', value: '2.5K+', icon: ShieldCheck, color: 'primary' },
];

export const superAdminActivity = [
  { action: 'New tertiary-education registered: Covenant Tertiary Education', time: '1 hour ago', type: 'registration' },
  { action: 'Payment processed: ₦450,000', time: '3 hours ago', type: 'payment' },
  { action: 'New school registered: St. Augustine Academy', time: '5 hours ago', type: 'registration' },
  { action: 'System backup completed', time: '8 hours ago', type: 'system' },
  { action: 'New testimonial submitted for review', time: '12 hours ago', type: 'testimonial' },
  { action: 'User role updated: school-admin → tertiary-education-admin', time: '1 day ago', type: 'admin' },
];

export const platformUsage = [
  { label: 'Active Users (Today)', value: '12,847' },
  { label: 'New Registrations (Week)', value: '342' },
  { label: 'Exams Completed (Month)', value: '8,920' },
  { label: 'Revenue (Month)', value: '₦4.2M' },
];

// ── Generic chart data (bar chart) ──
export const enrollmentTrend = [
  { label: 'Jan', value: 320 },
  { label: 'Feb', value: 410 },
  { label: 'Mar', value: 380 },
  { label: 'Apr', value: 520 },
  { label: 'May', value: 480 },
  { label: 'Jun', value: 610 },
  { label: 'Jul', value: 550 },
  { label: 'Aug', value: 680 },
];

export const examPerformanceTrend = [
  { label: 'Term 1', value: 72 },
  { label: 'Term 2', value: 78 },
  { label: 'Term 3', value: 81 },
  { label: 'Term 4', value: 85 },
  { label: 'Term 5', value: 83 },
  { label: 'Term 6', value: 87 },
];

// ── Notification data ──
export const dashboardNotifications = [
  { title: 'New exam scheduled for CSC 301', time: '2h ago', type: 'exam' },
  { title: 'Payment received: ₦5,000', time: '5h ago', type: 'payment' },
  { title: 'Results published for MTH 101', time: '1d ago', type: 'result' },
  { title: 'New announcement from your institution', time: '2d ago', type: 'announcement' },
];
