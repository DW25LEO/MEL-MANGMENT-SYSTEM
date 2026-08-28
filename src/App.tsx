import { useRouter } from '@/lib/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { SchoolsPage } from '@/pages/SchoolsPage';
import { TertiaryLearningPage } from '@/pages/TertiaryLearningPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { PublicCoursesPage, SuperAdminBackupsPage, SuperAdminManageCoursesPage, SuperAdminPrimarySecondaryPage, SuperAdminSubAdminPages, SuperAdminTertiaryEducationPage } from '@/pages/SuperAdminManagementPages';
import { ExaminationsPage } from '@/pages/ExaminationsPage';
import { StudentExamsPage, StudentExamTakingPage } from '@/pages/StudentExamPages';
import { StudentResultsPage } from '@/pages/StudentResultsPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import {
  StudentDashboard, TeacherDashboard,
  LecturerDashboard, SchoolAdminDashboard, TertiaryEducationAdminDashboard,
  SuperAdminDashboard,
} from '@/pages/Dashboards';
import {
  DashboardSubPage, StudentCoursesPage,
  StudentPaymentsPage,
  SchoolAdminStudentsPage,
} from '@/pages/DashboardSubPages';
import {
  SchoolStudentDashboard, SchoolStudentSubjectsPage, SchoolStudentLearningPage,
  SchoolStudentPaymentPage,
  SchoolStudentSettingsPage,
  TertiaryEducationStudentDashboard, TertiaryEducationStudentCoursesPage,
  TertiaryEducationStudentLearningPage,
  TertiaryEducationStudentPaymentPage,
  TertiaryEducationStudentSettingsPage,
} from '@/pages/StudentPortalPages';
import {
  SuperAdminPlatformPage, SuperAdminSchoolsPage,
  SuperAdminPermissionsPage, SuperAdminCreatePortalPage, SuperAdminBackupPage,
  SuperAdminUsersPage, SuperAdminExamSettingsPage,
  SuperAdminSettingsPage,
} from '@/pages/SuperAdminPages';
import {
  SuperAdminExamsPage, SuperAdminExamQuestionsPage,
  SuperAdminTermsPage, SuperAdminExamTypesPage,
} from '@/pages/SuperAdminExamPages';
import { SuperAdminPaymentsPage } from '@/pages/SuperAdminPaymentsPage';
import type { DashboardRole } from '@/lib/dashboard-data';
import { roleNavMap } from '@/lib/dashboard-data';

function App() {
  const { route } = useRouter();
  const path = route.path;

  // ── Admin login (standalone, no header/footer) ──
  if (path === '/admin/login') return <AdminLoginPage />;

  // ── Public routes ──
  const publicPage = (() => {
    switch (path) {
      case '/': return <HomePage />;
      case '/about': return <AboutPage />;
      case '/schools': return <SchoolsPage />;
      case '/institutions': return <SchoolsPage />;
      case '/tertiary': return <TertiaryLearningPage />;
      case '/courses': return <PublicCoursesPage />;
      case '/examinations': return <ExaminationsPage />;
      case '/results': return <ResultsPage />;
      case '/contact': return <ContactPage />;
      case '/faq': return <FaqPage />;
      case '/login': return <LoginPage />;
      default: return null;
    }
  })();

  if (publicPage) {
    return (
      <div className="flex min-h-screen flex-col bg-ink-50">
        <Header />
        <main className="flex-1">{publicPage}</main>
        <Footer />
      </div>
    );
  }

  // ── Dashboard routes ──
  const dashPage = resolveDashboardRoute(path);
  if (dashPage) return <div className="min-h-screen bg-ink-50">{dashPage}</div>;

  return <NotFoundPage path={path} />;
}

function resolveDashboardRoute(path: string): React.ReactNode {
  // School Student
  if (path === '/school-student/results') return <StudentResultsPage role="school-student" />;
  if (path === '/school-student/cbt') return <StudentExamsPage role="school-student" />;
  if (path.startsWith('/school-student/exam/')) return <StudentExamTakingPage examId={path.replace('/school-student/exam/', '')} role="school-student" />;
  if (path === '/school-student/dashboard') return <SchoolStudentDashboard />;
  if (path === '/school-student/subjects') return <SchoolStudentSubjectsPage />;
  if (path === '/school-student/learning') return <SchoolStudentLearningPage />;
  if (path === '/school-student/payment') return <SchoolStudentPaymentPage />;
  if (path === '/school-student/settings') return <SchoolStudentSettingsPage />;

  // Tertiary Education Student
  if (path === '/tertiary-education-student/results') return <StudentResultsPage role="tertiary-education-student" />;
  if (path === '/tertiary-education-student/cbt') return <StudentExamsPage role="tertiary-education-student" />;
  if (path.startsWith('/tertiary-education-student/exam/')) return <StudentExamTakingPage examId={path.replace('/tertiary-education-student/exam/', '')} role="tertiary-education-student" />;
  if (path === '/tertiary-education-student/dashboard') return <TertiaryEducationStudentDashboard />;
  if (path === '/tertiary-education-student/courses') return <TertiaryEducationStudentCoursesPage />;
  if (path === '/tertiary-education-student/learning') return <TertiaryEducationStudentLearningPage />;
  if (path === '/tertiary-education-student/payment') return <TertiaryEducationStudentPaymentPage />;
  if (path === '/tertiary-education-student/settings') return <TertiaryEducationStudentSettingsPage />;

  // Super Admin (new pages)
  if (path === '/super-admin/platform') return <SuperAdminPlatformPage />;
  if (path === '/super-admin/tertiary') return <SuperAdminTertiaryEducationPage />;
  if (path === '/super-admin/primary-secondary') return <SuperAdminPrimarySecondaryPage />;
  if (path === '/super-admin/sub-admins') return <SuperAdminSubAdminPages />;
  if (path === '/super-admin/courses') return <SuperAdminManageCoursesPage />;
  if (path === '/super-admin/backups') return <SuperAdminBackupsPage />;
  if (path === '/super-admin/exams') return <SuperAdminExamsPage />;
  if (path.startsWith('/super-admin/exams/') && path.endsWith('/questions')) {
    const examId = path.replace('/super-admin/exams/', '').replace('/questions', '');
    return <SuperAdminExamQuestionsPage examId={examId} />;
  }
  if (path === '/super-admin/terms') return <SuperAdminTermsPage />;
  if (path === '/super-admin/exam-types') return <SuperAdminExamTypesPage />;
  if (path === '/super-admin/payments') return <SuperAdminPaymentsPage />;
  if (path === '/super-admin/schools') return <SuperAdminSchoolsPage />;
  if (path === '/super-admin/permissions') return <SuperAdminPermissionsPage />;
  if (path === '/super-admin/create-portal') return <SuperAdminCreatePortalPage />;
  if (path === '/super-admin/backup') return <SuperAdminBackupPage />;
  if (path === '/super-admin/users') return <SuperAdminUsersPage />;
  if (path === '/super-admin/exam-settings') return <SuperAdminExamSettingsPage />;
  if (path === '/super-admin/settings') return <SuperAdminSettingsPage />;

  // Student (legacy)
  if (path === '/student/exams') return <StudentExamsPage />;
  if (path.startsWith('/student/exam/')) return <StudentExamTakingPage examId={path.replace('/student/exam/', '')} />;
  if (path === '/student/dashboard') return <StudentDashboard />;
  if (path === '/student/courses') return <StudentCoursesPage />;
  if (path === '/student/payments') return <StudentPaymentsPage />;
  if (isStudentSubPath(path)) return <DashboardSubPage role="student" path={path} />;

  // Teacher
  if (path === '/teacher/dashboard') return <TeacherDashboard />;
  if (isTeacherSubPath(path)) return <DashboardSubPage role="teacher" path={path} />;

  // Lecturer
  if (path === '/lecturer/dashboard') return <LecturerDashboard />;
  if (isLecturerSubPath(path)) return <DashboardSubPage role="lecturer" path={path} />;

  // School Admin
  if (path === '/school-admin/dashboard') return <SchoolAdminDashboard />;
  if (path === '/school-admin/students') return <SchoolAdminStudentsPage />;
  if (isSchoolAdminSubPath(path)) return <DashboardSubPage role="school-admin" path={path} />;

  // Tertiary Education Admin
  if (path === '/tertiary-education-admin/dashboard') return <TertiaryEducationAdminDashboard />;
  if (isTertiaryEducationAdminSubPath(path)) return <DashboardSubPage role="tertiary-education-admin" path={path} />;

  // Super Admin (dashboard)
  if (path === '/super-admin/dashboard') return <SuperAdminDashboard />;
  if (isSuperAdminSubPath(path)) return <DashboardSubPage role="super-admin" path={path} />;

  return null;
}

function isStudentSubPath(path: string): boolean {
  return path.startsWith('/student/') && hasNavMatch('student', path);
}
function isTeacherSubPath(path: string): boolean {
  return path.startsWith('/teacher/') && hasNavMatch('teacher', path);
}
function isLecturerSubPath(path: string): boolean {
  return path.startsWith('/lecturer/') && hasNavMatch('lecturer', path);
}
function isSchoolAdminSubPath(path: string): boolean {
  return path.startsWith('/school-admin/') && hasNavMatch('school-admin', path);
}
function isTertiaryEducationAdminSubPath(path: string): boolean {
  return path.startsWith('/tertiary-education-admin/') && hasNavMatch('tertiary-education-admin', path);
}
function isSuperAdminSubPath(path: string): boolean {
  return path.startsWith('/super-admin/') && hasNavMatch('super-admin', path);
}

function hasNavMatch(role: DashboardRole, path: string): boolean {
  return roleNavMap[role].some((n) => n.to === path);
}

function NotFoundPage({ path }: { path: string }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-ink-50">
      <div className="container-page text-center">
        <p className="text-7xl font-extrabold text-primary-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-500">The page "{path}" doesn't exist.</p>
        <a href="#/" className="btn-primary mt-6 inline-flex">Back to Home</a>
      </div>
    </section>
  );
}

export default App;
