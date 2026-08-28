import { useCallback, useEffect, useState } from 'react';
import {
  BookOpen, ClipboardCheck, Award, BarChart3, Users, School, CreditCard,
  CheckSquare, FileText, Megaphone, CalendarDays, ArrowRight, TrendingUp,
  Activity, Bell, Building2, GraduationCap, ShieldCheck, Globe2,
  MessageSquare, DollarSign, UserCheck, Clock,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import {
  DashboardLayout, StatCard, DashCard, DashPageHeader,
  BarChart, LineChart, ProgressBar, StatusBadge, EmptyState,
} from '@/components/Dashboard';
import type { DashboardRole } from '@/lib/dashboard-data';
import {
  studentStats, studentCourses, studentExams, studentResults, studentPayments,
  studentAnnouncements, studentActivity,
  teacherStats, teacherClasses, teacherSchedule,
  lecturerStats, lecturerCourses,
  schoolAdminStats, schoolLevelBreakdown,
  tertiaryEducationAdminStats, tertiaryEducationFaculties,
  superAdminActivity, platformUsage,
  enrollmentTrend, examPerformanceTrend, dashboardNotifications,
} from '@/lib/dashboard-data';

// ═══════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <DashPageHeader title="Welcome back, Grace!" subtitle="Tertiary Education of Nigeria, Nsukka · 300L · Computer Science">
        <Link to="/student/courses" className="btn-primary">Register Courses</Link>
        <Link to="/student/payments" className="btn-outline">Make Payment</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {studentStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="Registered Courses" action={<Link to="/student/courses" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</Link>}>
            <div className="space-y-2">
              {studentCourses.map((c) => (
                <div key={c.code} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{c.code} — {c.name}</p>
                      <p className="text-xs text-ink-400">{c.instructor} · {c.schedule} · {c.credits} credits</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Recent Results" action={<Link to="/student/results" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</Link>}>
            <div className="space-y-2">
              {studentResults.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{r.course}</p>
                    <p className="text-xs text-ink-400">{r.exam} · {r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-ink-900">{r.score}/{r.total}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Upcoming Exams">
            <div className="space-y-3">
              {studentExams.map((e, i) => (
                <div key={i} className="rounded-xl bg-primary-50/50 p-3">
                  <p className="text-sm font-semibold text-ink-900">{e.name}</p>
                  <p className="text-xs text-ink-500">{e.course} · {e.date} at {e.time}</p>
                  <p className="mt-1 text-xs text-ink-400">Duration: {e.duration}</p>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Announcements">
            <div className="space-y-2">
              {studentAnnouncements.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.priority === 'high' ? 'bg-error-500' : a.priority === 'medium' ? 'bg-accent-500' : 'bg-success-500'}`} />
                  <div>
                    <p className="text-xs font-medium text-ink-700">{a.title}</p>
                    <p className="text-2xs text-ink-400">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Recent Activity">
            <div className="space-y-2">
              {studentActivity.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <div>
                    <p className="text-xs text-ink-700">{a.action}</p>
                    <p className="text-2xs text-ink-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEACHER DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function TeacherDashboard() {
  return (
    <DashboardLayout role="teacher">
      <DashPageHeader title="Welcome back, Chioma!" subtitle="Queen's College · Mathematics & Basic Science">
        <Link to="/teacher/attendance" className="btn-primary">Take Attendance</Link>
        <Link to="/teacher/question-bank" className="btn-outline">Question Bank</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {teacherStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="My Classes" action={<Link to="/teacher/classes" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</Link>}>
            <div className="space-y-2">
              {teacherClasses.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <School className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                      <p className="text-xs text-ink-400">{c.students} students · {c.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink-900">{c.avgScore}</p>
                    <p className="text-2xs text-ink-400">Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Class Performance Trend">
            <LineChart data={examPerformanceTrend} />
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Today's Schedule">
            <div className="space-y-2">
              {teacherSchedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                  <span className="text-xs font-bold text-primary-600">{s.time}</span>
                  <div>
                    <p className="text-xs font-semibold text-ink-900">{s.class}</p>
                    <p className="text-2xs text-ink-400">{s.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Pending Marks">
            <div className="rounded-xl bg-warning-50 p-4 text-center">
              <p className="text-3xl font-extrabold text-warning-600">8</p>
              <p className="text-xs text-ink-500">Submissions awaiting marking</p>
              <Link to="/teacher/scores" className="btn-outline mt-3 w-full justify-center text-xs">Enter Marks</Link>
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// LECTURER DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function LecturerDashboard() {
  return (
    <DashboardLayout role="lecturer">
      <DashPageHeader title="Welcome back, Dr. Okonkwo!" subtitle="Faculty of Engineering · Department of Computer Science">
        <Link to="/lecturer/create-exam" className="btn-primary">Create Exam</Link>
        <Link to="/lecturer/materials" className="btn-outline">Upload Materials</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {lecturerStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="My Courses" action={<Link to="/lecturer/courses" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</Link>}>
            <div className="space-y-2">
              {lecturerCourses.map((c) => (
                <div key={c.code} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{c.code} — {c.name}</p>
                      <p className="text-xs text-ink-400">{c.students} students · {c.credits} credits · {c.schedule}</p>
                    </div>
                  </div>
                  <Link to="/lecturer/courses" className="text-primary-600 hover:text-primary-700">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Enrollment Trend">
            <BarChart data={enrollmentTrend} />
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Pending Marks">
            <div className="rounded-xl bg-warning-50 p-4 text-center">
              <p className="text-3xl font-extrabold text-warning-600">23</p>
              <p className="text-xs text-ink-500">Exams awaiting marking</p>
              <Link to="/lecturer/mark-exams" className="btn-outline mt-3 w-full justify-center text-xs">Mark Exams</Link>
            </div>
          </DashCard>

          <DashCard title="Notifications">
            <div className="space-y-2">
              {dashboardNotifications.map((n, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-xs font-medium text-ink-700">{n.title}</p>
                    <p className="text-2xs text-ink-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function SchoolAdminDashboard() {
  return (
    <DashboardLayout role="school-admin">
      <DashPageHeader title="Baptist High School" subtitle="Admin Dashboard · 2026/2027 Session">
        <Link to="/school-admin/students" className="btn-primary">Add Student</Link>
        <Link to="/school-admin/exams" className="btn-outline">Create Exam</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {schoolAdminStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="Level Breakdown" action={<Link to="/school-admin/primary" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Manage levels</Link>}>
            <div className="space-y-2">
              {schoolLevelBreakdown.map((l) => (
                <div key={l.level} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                      {l.level.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{l.level}</p>
                      <p className="text-xs text-ink-400">{l.students} students · {l.classes} classes · {l.teachers} teachers</p>
                    </div>
                  </div>
                  <Link to="/school-admin/classes" className="text-primary-600 hover:text-primary-700">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Pass Rate by Term">
            <BarChart data={examPerformanceTrend} />
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Payment Summary">
            <div className="space-y-3">
              <div className="rounded-xl bg-success-50 p-3">
                <p className="text-xs text-ink-500">Collected (This Term)</p>
                <p className="text-lg font-bold text-success-600">₦820,000</p>
              </div>
              <div className="rounded-xl bg-warning-50 p-3">
                <p className="text-xs text-ink-500">Outstanding</p>
                <p className="text-lg font-bold text-warning-600">₦180,000</p>
              </div>
              <ProgressBar value={82} color="success" />
              <p className="text-2xs text-ink-400">82% collection rate</p>
            </div>
          </DashCard>

          <DashCard title="Recent Activity">
            <div className="space-y-2">
              {dashboardNotifications.slice(0, 4).map((n, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <div>
                    <p className="text-xs text-ink-700">{n.title}</p>
                    <p className="text-2xs text-ink-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationAdminDashboard() {
  return (
    <DashboardLayout role="tertiary-education-admin">
      <DashPageHeader title="Tertiary Education of Lagos" subtitle="Admin Dashboard · 2026/2027 Academic Year">
        <Link to="/tertiary-education-admin/students" className="btn-primary">Add Student</Link>
        <Link to="/tertiary-education-admin/faculties" className="btn-outline">Manage Faculties</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tertiaryEducationAdminStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="Faculties" action={<Link to="/tertiary-education-admin/faculties" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</Link>}>
            <div className="space-y-2">
              {tertiaryEducationFaculties.map((f) => (
                <div key={f.name} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{f.name}</p>
                      <p className="text-xs text-ink-400">{f.departments} departments · {f.programmes} programmes · {f.students} students</p>
                    </div>
                  </div>
                  <Link to="/tertiary-education-admin/departments" className="text-primary-600 hover:text-primary-700">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Enrollment Trend">
            <BarChart data={enrollmentTrend} />
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Financial Summary">
            <div className="space-y-3">
              <div className="rounded-xl bg-success-50 p-3">
                <p className="text-xs text-ink-500">Fee Collections (Month)</p>
                <p className="text-lg font-bold text-success-600">₦42.5M</p>
              </div>
              <div className="rounded-xl bg-warning-50 p-3">
                <p className="text-xs text-ink-500">Outstanding</p>
                <p className="text-lg font-bold text-warning-600">₦8.3M</p>
              </div>
              <ProgressBar value={84} color="success" />
              <p className="text-2xs text-ink-400">84% collection rate</p>
            </div>
          </DashCard>

          <DashCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Student', to: '/tertiary-education-admin/students', icon: Users },
                { label: 'Create Faculty', to: '/tertiary-education-admin/faculties', icon: Building2 },
                { label: 'Transcript', to: '/tertiary-education-admin/transcripts', icon: FileText },
                { label: 'Announce', to: '/tertiary-education-admin/announcements', icon: Megaphone },
              ].map((a) => (
                <Link key={a.label} to={a.to} className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-100 p-3 text-center hover:border-primary-200 hover:bg-primary-50/50">
                  <a.icon className="h-5 w-5 text-primary-500" />
                  <span className="text-2xs font-medium text-ink-600">{a.label}</span>
                </Link>
              ))}
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUPER ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function SuperAdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '—', icon: Users, color: 'primary' },
    { label: 'Total Courses', value: '—', icon: BookOpen, color: 'accent' },
    { label: 'Total Schools', value: '—', icon: School, color: 'success' },
    { label: 'Total Sub-Admins', value: '—', icon: ShieldCheck, color: 'primary' },
  ]);
  const [statsError, setStatsError] = useState(false);

  const loadStats = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_super_admin_stats');
    if (error || !data?.[0]) {
      setStatsError(true);
      return;
    }

    const row = data[0];
    const format = (value: number) => new Intl.NumberFormat().format(value);
    setStats([
      { label: 'Total Users', value: format(Number(row.total_users)), icon: Users, color: 'primary' },
      { label: 'Total Courses', value: format(Number(row.total_courses)), icon: BookOpen, color: 'accent' },
      { label: 'Total Schools', value: format(Number(row.total_schools)), icon: School, color: 'success' },
      { label: 'Total Sub-Admins', value: format(Number(row.total_sub_admins)), icon: ShieldCheck, color: 'primary' },
    ]);
    setStatsError(false);
  }, []);

  useEffect(() => {
    void loadStats();
    const refresh = () => void loadStats();
    window.addEventListener('focus', refresh);
    const interval = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener('focus', refresh);
      window.clearInterval(interval);
    };
  }, [loadStats]);

  return (
    <DashboardLayout role="super-admin">
      <DashPageHeader title="Platform Overview" subtitle="I-LearnAce Learning Platform · Super Admin">
        <Link to="/super-admin/reports" className="btn-primary">Generate Report</Link>
        <Link to="/super-admin/settings" className="btn-outline">System Settings</Link>
      </DashPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color as any} />
        ))}
      </div>
      {statsError && (
        <p className="mt-3 text-sm text-error-600">Live platform totals are temporarily unavailable.</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="Platform Usage">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {platformUsage.map((p) => (
                <div key={p.label} className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="text-lg font-extrabold text-ink-900">{p.value}</p>
                  <p className="text-2xs text-ink-500">{p.label}</p>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Enrollment Trend (Platform-wide)">
            <BarChart data={enrollmentTrend} />
          </DashCard>

          <DashCard title="Recent System Activity">
            <div className="space-y-2">
              {superAdminActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    a.type === 'registration' ? 'bg-primary-50 text-primary-600' :
                    a.type === 'payment' ? 'bg-success-50 text-success-600' :
                    a.type === 'system' ? 'bg-ink-100 text-ink-600' :
                    a.type === 'testimonial' ? 'bg-accent-50 text-accent-600' :
                    'bg-warning-50 text-warning-600'
                  }`}>
                    {a.type === 'registration' ? <UserCheck className="h-4 w-4" /> :
                     a.type === 'payment' ? <DollarSign className="h-4 w-4" /> :
                     a.type === 'system' ? <ShieldCheck className="h-4 w-4" /> :
                     a.type === 'testimonial' ? <MessageSquare className="h-4 w-4" /> :
                     <Clock className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="text-sm text-ink-700">{a.action}</p>
                    <p className="text-2xs text-ink-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="System Health">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Uptime</span>
                <span className="text-sm font-bold text-success-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Response Time</span>
                <span className="text-sm font-bold text-ink-900">124ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Error Rate</span>
                <span className="text-sm font-bold text-success-600">0.01%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Active Sessions</span>
                <span className="text-sm font-bold text-ink-900">3,842</span>
              </div>
            </div>
          </DashCard>

          <DashCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Manage Users', to: '/super-admin/roles', icon: ShieldCheck },
                { label: 'Settings', to: '/super-admin/settings', icon: Globe2 },
                { label: 'Backup', to: '/super-admin/backup', icon: ShieldCheck },
                { label: 'Reports', to: '/super-admin/reports', icon: BarChart3 },
              ].map((a) => (
                <Link key={a.label} to={a.to} className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-100 p-3 text-center hover:border-primary-200 hover:bg-primary-50/50">
                  <a.icon className="h-5 w-5 text-primary-500" />
                  <span className="text-2xs font-medium text-ink-600">{a.label}</span>
                </Link>
              ))}
            </div>
          </DashCard>

          <DashCard title="Revenue (Month)">
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white">
              <p className="text-xs text-primary-100">Total Revenue</p>
              <p className="text-2xl font-extrabold">₦4.2M</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary-200">
                <TrendingUp className="h-3.5 w-3.5" />
                +12% from last month
              </div>
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
