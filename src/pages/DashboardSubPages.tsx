import { useState, type ReactNode } from 'react';
import { Plus, Search, Download, Filter, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { Link } from '@/lib/router';
import { DashboardLayout, DashCard, DashPageHeader, StatCard, StatusBadge, EmptyState } from '@/components/Dashboard';
import type { DashboardRole } from '@/lib/dashboard-data';
import { roleNavMap } from '@/lib/dashboard-data';

// A generic "coming soon" sub-page for nav items that don't have a dedicated view yet
export function DashboardSubPage({
  role,
  path,
}: {
  role: DashboardRole;
  path: string;
}) {
  const nav = roleNavMap[role];
  const current = nav.find((n) => n.to === path);
  const title = current?.label ?? 'Dashboard';
  const Icon = current?.icon;

  return (
    <DashboardLayout role={role}>
      <DashPageHeader title={title} subtitle="This section is part of your portal. Full functionality is being rolled out.">
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </DashPageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashCard title={title}>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {Icon && <Icon className="h-12 w-12 text-ink-300" />}
              <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-500">
                This module is part of the I-LearnAce platform. Full CRUD operations, analytics, and management
                features for {title.toLowerCase()} will be available here.
              </p>
              <div className="mt-6 flex gap-2">
                <button className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Create {title.replace(/s$/, '')}
                </button>
                <button className="btn-outline">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </DashCard>
        </div>

        <div className="space-y-6">
          <DashCard title="Quick Stats">
            <div className="space-y-3">
              {['Total Records', 'Active', 'Pending', 'Completed'].map((label, i) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">{label}</span>
                  <span className="text-sm font-bold text-ink-900">{['128', '96', '18', '14'][i]}</span>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Recent Items">
            <div className="space-y-2">
              {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <span className="text-xs font-medium text-ink-700">{item}</span>
                  <StatusBadge status="Active" />
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ── Student Course Registration page (functional) ──
export function StudentCoursesPage() {
  const [search, setSearch] = useState('');
  const allCourses = [
    { code: 'CSC 301', name: 'Data Structures & Algorithms', credits: 3, instructor: 'Dr. A. Okonkwo', schedule: 'Mon 10:00', slots: 12, registered: true },
    { code: 'CSC 305', name: 'Database Systems', credits: 3, instructor: 'Prof. I. Sule', schedule: 'Wed 14:00', slots: 8, registered: true },
    { code: 'MTH 201', name: 'Linear Algebra', credits: 3, instructor: 'Dr. R. Bello', schedule: 'Tue 08:00', slots: 15, registered: true },
    { code: 'GST 101', name: 'Communication Skills', credits: 2, instructor: 'Mrs. C. Nwosu', schedule: 'Thu 12:00', slots: 20, registered: true },
    { code: 'CSC 309', name: 'Software Engineering', credits: 3, instructor: 'Dr. A. Okonkwo', schedule: 'Fri 16:00', slots: 5, registered: true },
    { code: 'STA 201', name: 'Statistics', credits: 3, instructor: 'Dr. M. Okafor', schedule: 'Mon 14:00', slots: 10, registered: true },
    { code: 'CSC 311', name: 'Operating Systems', credits: 3, instructor: 'Dr. K. Adeyemi', schedule: 'Tue 10:00', slots: 6, registered: false },
    { code: 'CSC 313', name: 'Computer Networks', credits: 3, instructor: 'Prof. N. Eze', schedule: 'Wed 10:00', slots: 14, registered: false },
    { code: 'MTH 203', name: 'Discrete Mathematics', credits: 3, instructor: 'Dr. R. Bello', schedule: 'Thu 08:00', slots: 9, registered: false },
    { code: 'GST 103', name: 'Philosophy & Logic', credits: 2, instructor: 'Mr. T. Bakare', schedule: 'Fri 10:00', slots: 25, registered: false },
  ];

  const filtered = allCourses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="student">
      <DashPageHeader title="Course Registration" subtitle="2026/2027 — First Semester">
        <button className="btn-primary">
          <Download className="h-4 w-4" />
          Print Registration Slip
        </button>
      </DashPageHeader>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses by code or name..."
          className="input pl-11"
        />
      </div>

      <DashCard title="Available Courses">
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.code} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.registered ? 'bg-success-50 text-success-600' : 'bg-primary-50 text-primary-600'}`}>
                  {c.registered ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.code} — {c.name}</p>
                  <p className="text-xs text-ink-400">{c.instructor} · {c.schedule} · {c.credits} credits · {c.slots} slots left</p>
                </div>
              </div>
              {c.registered ? (
                <button className="btn-ghost text-error-600 hover:bg-error-50 text-xs">
                  <X className="h-3.5 w-3.5" />
                  Drop
                </button>
              ) : (
                <button className="btn-primary text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Register
                </button>
              )}
            </div>
          ))}
        </div>
      </DashCard>
    </DashboardLayout>
  );
}

// ── Student Results page (functional) ──
export function StudentResultsPage() {
  const results = [
    { course: 'CSC 201', exam: 'Programming Fundamentals', score: 88, total: 100, grade: 'A', status: 'Pass', date: 'Jun 12, 2026', attempt: 1 },
    { course: 'MTH 101', exam: 'Calculus I', score: 72, total: 100, grade: 'B', status: 'Pass', date: 'Jun 15, 2026', attempt: 1 },
    { course: 'PHY 101', exam: 'General Physics', score: 65, total: 100, grade: 'C', status: 'Pass', date: 'Jun 18, 2026', attempt: 2 },
    { course: 'GST 101', exam: 'Communication Skills', score: 91, total: 100, grade: 'A', status: 'Pass', date: 'Jun 20, 2026', attempt: 1 },
    { course: 'CSC 205', exam: 'Computer Architecture', score: 45, total: 100, grade: 'F', status: 'Fail', date: 'Jun 22, 2026', attempt: 1 },
    { course: 'MTH 103', exam: 'Calculus II', score: 78, total: 100, grade: 'B', status: 'Pass', date: 'Jul 5, 2026', attempt: 1 },
  ];

  const avg = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

  return (
    <DashboardLayout role="student">
      <DashPageHeader title="My Results" subtitle="2026/2027 — First Semester">
        <button className="btn-outline">
          <Download className="h-4 w-4" />
          Download Transcript
        </button>
      </DashPageHeader>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Overall CGPA" value="4.2" icon={Check} color="primary" />
        <StatCard label="Average Score" value={`${avg}%`} icon={Check} color="success" />
        <StatCard label="Courses Passed" value="5" icon={Check} color="success" />
        <StatCard label="Courses Failed" value="1" icon={X} color="error" />
      </div>

      <DashCard title="Exam Results">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Exam</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Attempt</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  <td className="py-3 pr-4 font-semibold text-ink-900">{r.course}</td>
                  <td className="py-3 pr-4 text-ink-600">{r.exam}</td>
                  <td className="py-3 pr-4 font-bold text-ink-900">{r.score}/{r.total}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${r.grade === 'A' ? 'badge-success' : r.grade === 'B' ? 'badge-primary' : r.grade === 'C' ? 'badge-accent' : 'badge-error'}`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3 pr-4 text-xs text-ink-500">{r.date}</td>
                  <td className="py-3 pr-4 text-xs text-ink-500">#{r.attempt}</td>
                  <td className="py-3">
                    <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View Slip</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </DashboardLayout>
  );
}

// ── Student Payments page (functional) ──
export function StudentPaymentsPage() {
  const payments = [
    { id: 'PAY-00482', description: 'CSC 301 Exam Fee', amount: '₦5,000', method: 'Card', status: 'Paid', date: 'Aug 10, 2026' },
    { id: 'PAY-00491', description: 'CSC 305 Exam Fee', amount: '₦5,000', method: 'Card', status: 'Paid', date: 'Aug 10, 2026' },
    { id: 'PAY-00503', description: 'STA 201 Exam Fee', amount: '₦5,000', method: 'Bank Transfer', status: 'Pending', date: 'Aug 14, 2026' },
    { id: 'PAY-00475', description: 'MTH 201 Exam Fee', amount: '₦5,000', method: 'Card', status: 'Paid', date: 'Aug 5, 2026' },
    { id: 'PAY-00468', description: 'GST 101 Exam Fee', amount: '₦3,000', method: 'Card', status: 'Paid', date: 'Aug 1, 2026' },
  ];

  return (
    <DashboardLayout role="student">
      <DashPageHeader title="Payment History" subtitle="View and manage your exam payments">
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Make Payment
        </button>
      </DashPageHeader>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Paid" value="₦18,000" icon={Check} color="success" />
        <StatCard label="Outstanding" value="₦5,000" icon={X} color="warning" />
        <StatCard label="Transactions" value="5" icon={Check} color="primary" />
        <StatCard label="This Month" value="₦15,000" icon={Check} color="primary" />
      </div>

      <DashCard title="All Transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Receipt ID</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Method</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50/50">
                  <td className="py-3 pr-4 font-semibold text-ink-900">{p.id}</td>
                  <td className="py-3 pr-4 text-ink-600">{p.description}</td>
                  <td className="py-3 pr-4 font-bold text-ink-900">{p.amount}</td>
                  <td className="py-3 pr-4 text-ink-600">{p.method}</td>
                  <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3 pr-4 text-xs text-ink-500">{p.date}</td>
                  <td className="py-3">
                    <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </DashboardLayout>
  );
}

// ── School Admin Students page (functional) ──
export function SchoolAdminStudentsPage() {
  const students = [
    { id: 'ILA-STD-001', name: 'Emeka Adeyemi', level: 'Primary 4', class: 'P4A', status: 'Active', parent: 'Mrs. F. Adeyemi' },
    { id: 'ILA-STD-002', name: 'Ngozi Adeyemi', level: 'Primary 2', class: 'P2B', status: 'Active', parent: 'Mrs. F. Adeyemi' },
    { id: 'ILA-STD-003', name: 'Tunde Okafor', level: 'JSS 1', class: 'J1A', status: 'Active', parent: 'Mr. O. Okafor' },
    { id: 'ILA-STD-004', name: 'Aisha Bello', level: 'SSS 2', class: 'S2C', status: 'Active', parent: 'Mrs. H. Bello' },
    { id: 'ILA-STD-005', name: 'David Eze', level: 'Primary 5', class: 'P5A', status: 'Inactive', parent: 'Mr. C. Eze' },
    { id: 'ILA-STD-006', name: 'Fatima Sule', level: 'JSS 3', class: 'J3B', status: 'Active', parent: 'Mrs. A. Sule' },
    { id: 'ILA-STD-007', name: 'John Adeyemi', level: 'SSS 1', class: 'S1A', status: 'Active', parent: 'Mr. J. Adeyemi' },
    { id: 'ILA-STD-008', name: 'Mary Bakare', level: 'Primary 3', class: 'P3A', status: 'Active', parent: 'Mrs. C. Bakare' },
  ];

  return (
    <DashboardLayout role="school-admin">
      <DashPageHeader title="Students" subtitle="Manage all students across levels">
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </DashPageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type="text" placeholder="Search students..." className="input pl-11" />
        </div>
        <select className="input max-w-xs">
          <option>All Levels</option>
          <option>Primary 1-5</option>
          <option>JSS 1-3</option>
          <option>SSS 1-3</option>
        </select>
      </div>

      <DashCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Student ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Level</th>
                <th className="pb-3 pr-4">Class</th>
                <th className="pb-3 pr-4">Parent</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-ink-50/50">
                  <td className="py-3 pr-4 font-semibold text-ink-900">{s.id}</td>
                  <td className="py-3 pr-4 text-ink-700">{s.name}</td>
                  <td className="py-3 pr-4 text-ink-600">{s.level}</td>
                  <td className="py-3 pr-4 text-ink-600">{s.class}</td>
                  <td className="py-3 pr-4 text-ink-600">{s.parent}</td>
                  <td className="py-3 pr-4"><StatusBadge status={s.status} /></td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                      <button className="rounded-lg p-1.5 text-ink-400 hover:bg-error-50 hover:text-error-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </DashboardLayout>
  );
}

