import { useState, useEffect } from 'react';
import {
  BookOpen, BookMarked, ClipboardCheck, CreditCard, Award, Settings,
  School, MapPin, Mail, Phone, Check, X, Loader2, AlertCircle,
  FileText, Download, ArrowRight, Clock, Lock, User,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { DashboardLayout, DashCard, DashPageHeader, StatCard, StatusBadge } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

type Institution = { id: string; name: string; type: string; location: string; contact_email: string; contact_phone: string; description: string };
type Subject = { id: string; name: string; level: string; term: string; institution_id: string };
type Course = { id: string; code: string; name: string; credits: number; level: string; semester: string; institution_id: string };

// ═══════════════════════════════════════════════════════════════
// HOOK: fetch user's institution
// ═══════════════════════════════════════════════════════════════
function useInstitution() {
  const { user } = useAuth();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const instId = user.user_metadata?.institution_id;
    if (!instId) { setLoading(false); return; }

    supabase
      .from('institutions')
      .select('*')
      .eq('id', instId)
      .single()
      .then(({ data }) => {
        if (data) setInstitution(data as Institution);
        setLoading(false);
      });
  }, [user]);

  return { institution, loading };
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentDashboard() {
  const { institution, loading } = useInstitution();
  const { user } = useAuth();

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="My Dashboard" subtitle={user?.user_metadata?.full_name || 'Student'}>
        <Link to="/school-student/subjects" className="btn-primary">Select Subjects</Link>
      </DashPageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : institution ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <DashCard title="My School">
              <div className="flex items-start gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                  <School className="h-8 w-8" />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900">{institution.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 text-sm text-ink-500">
                      <MapPin className="h-3.5 w-3.5" /> {institution.location}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500">
                      <Mail className="h-3.5 w-3.5" /> {institution.contact_email}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500">
                      <Phone className="h-3.5 w-3.5" /> {institution.contact_phone}
                    </p>
                  </div>
                  {institution.description && (
                    <p className="mt-3 text-sm text-ink-600">{institution.description}</p>
                  )}
                </div>
              </div>
            </DashCard>

            <DashCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Subjects', to: '/school-student/subjects', icon: BookOpen },
                  { label: 'Learning', to: '/school-student/learning', icon: BookMarked },
                  { label: 'CBT Test', to: '/school-student/cbt', icon: ClipboardCheck },
                  { label: 'Payment', to: '/school-student/payment', icon: CreditCard },
                  { label: 'Results', to: '/school-student/results', icon: Award },
                  { label: 'Settings', to: '/school-student/settings', icon: Settings },
                ].map((a) => (
                  <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 p-4 hover:border-primary-200 hover:bg-primary-50/50">
                    <a.icon className="h-6 w-6 text-primary-500" />
                    <span className="text-xs font-medium text-ink-600">{a.label}</span>
                  </Link>
                ))}
              </div>
            </DashCard>
          </div>

          <div className="space-y-6">
            <DashCard title="My Stats">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Selected Subjects</span>
                  <span className="text-sm font-bold text-ink-900">4</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Tests Taken</span>
                  <span className="text-sm font-bold text-ink-900">6</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Payment Uses Left</span>
                  <span className="text-sm font-bold text-warning-600">1</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Average Score</span>
                  <span className="text-sm font-bold text-success-600">78%</span>
                </div>
              </div>
            </DashCard>

            <DashCard title="Announcements">
              <div className="space-y-2">
                {[
                  { title: 'Term 1 exams start next week', time: '2h ago' },
                  { title: 'New notes uploaded for Mathematics', time: '1d ago' },
                  { title: 'Payment reminder: ₦2,000 for 2 tests', time: '3d ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                    <div>
                      <p className="text-xs font-medium text-ink-700">{a.title}</p>
                      <p className="text-2xs text-ink-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashCard>
          </div>
        </div>
      ) : (
        <DashCard>
          <div className="py-12 text-center">
            <School className="mx-auto h-12 w-12 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No school linked to your account yet.</p>
          </div>
        </DashCard>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - SUBJECTS PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentSubjectsPage() {
  const { user } = useAuth();
  const { institution } = useInstitution();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!institution) { setLoading(false); return; }
    supabase
      .from('subjects')
      .select('*')
      .eq('institution_id', institution.id)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setSubjects(data as Subject[]);
        setLoading(false);
      });
  }, [institution]);

  const toggleSubject = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="My Subjects" subtitle="Select the subjects you want to study" />
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <DashCard title={`Available Subjects (${subjects.length})`}>
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 p-4 hover:bg-primary-50/50">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggleSubject(s.id)}
                  className="h-5 w-5 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{s.name}</p>
                  <p className="text-xs text-ink-400">{s.level} · {s.term}</p>
                </div>
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-50 p-4">
              <p className="text-sm font-medium text-primary-700">{selected.length} subject(s) selected</p>
              <Link to="/school-student/learning" className="btn-primary text-xs">
                Continue to Learning
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </DashCard>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - LEARNING PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentLearningPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const schemes = [
    { week: 1, topic: 'Numbers and Numeration', notes: 'Introduction to number systems, place values, and counting.' },
    { week: 2, topic: 'Addition and Subtraction', notes: 'Basic operations with whole numbers.' },
    { week: 3, topic: 'Multiplication', notes: 'Times tables and multi-digit multiplication.' },
    { week: 4, topic: 'Division', notes: 'Long division and remainders.' },
    { week: 5, topic: 'Fractions', notes: 'Introduction to fractions, equivalent fractions.' },
    { week: 6, topic: 'Decimals', notes: 'Converting between fractions and decimals.' },
  ];

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="Learning" subtitle="View scheme of work and notes for your subjects" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <DashCard title="My Subjects">
            <div className="space-y-2">
              {['Mathematics', 'English Language', 'Basic Science', 'Social Studies'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                    selectedSubject === subj ? 'bg-primary-50 text-primary-700' : 'hover:bg-ink-50'
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-ink-400" />
                  <span className="text-sm font-medium">{subj}</span>
                </button>
              ))}
            </div>
          </DashCard>
        </div>
        <div className="lg:col-span-2">
          {selectedSubject ? (
            <DashCard title={`${selectedSubject} — Scheme of Work`}>
              <div className="space-y-3">
                {schemes.map((s) => (
                  <div key={s.week} className="rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-ink-900">Week {s.week}: {s.topic}</p>
                        <p className="mt-1 text-xs text-ink-500">{s.notes}</p>
                      </div>
                      <button className="btn-ghost text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashCard>
          ) : (
            <DashCard>
              <div className="py-12 text-center">
                <BookMarked className="mx-auto h-12 w-12 text-ink-300" />
                <p className="mt-3 text-sm text-ink-500">Select a subject to view its scheme of work</p>
              </div>
            </DashCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - CBT TEST PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentCbtPage() {
  const [paymentMade, setPaymentMade] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  const tests = [
    { id: 1, subject: 'Mathematics', title: 'Term 1 Mid-term Test', questions: 20, duration: '30 min' },
    { id: 2, subject: 'English Language', title: 'Grammar Quiz', questions: 15, duration: '20 min' },
    { id: 3, subject: 'Basic Science', title: 'Science Concepts Test', questions: 25, duration: '40 min' },
  ];

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="CBT Test / Exam" subtitle="Take computer-based tests for your subjects" />
      {!paymentMade ? (
        <DashCard>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="h-12 w-12 text-warning-500" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">Payment Required</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
              You need to make a payment of ₦2,000 to access CBT tests. This gives you two test attempts.
            </p>
            <Link to="/school-student/payment" className="btn-primary mt-6">
              Make Payment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </DashCard>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-success-50 p-4">
            <p className="text-sm font-medium text-success-700">Payment active — {usesRemaining} test attempt(s) remaining</p>
          </div>
          <DashCard title="Available Tests">
            <div className="space-y-3">
              {tests.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{t.title}</p>
                    <p className="text-xs text-ink-400">{t.subject} · {t.questions} questions · {t.duration}</p>
                  </div>
                  <button
                    onClick={() => setTestStarted(true)}
                    disabled={usesRemaining === 0}
                    className="btn-primary text-xs disabled:opacity-50"
                  >
                    Start Test
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - PAYMENT PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentPaymentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('payments').insert({
        user_email: user?.email || '',
        amount: 2000,
        status: 'completed',
        uses_remaining: 2,
        payment_method: 'card',
        reference: `ILA-${Date.now()}`,
      });
      if (insertError) throw insertError;
      setPaid(true);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="Payment" subtitle="Pay for CBT test access" />
      <div className="mx-auto max-w-lg">
        <DashCard>
          {paid ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="h-12 w-12 text-success-500" />
              <h3 className="mt-4 text-lg font-bold text-ink-900">Payment Successful!</h3>
              <p className="mt-2 text-sm text-ink-500">You now have 2 test attempts available.</p>
              <Link to="/school-student/cbt" className="btn-primary mt-6">
                Go to CBT Tests
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white">
                <p className="text-sm text-primary-100">CBT Test Access</p>
                <p className="mt-2 text-4xl font-extrabold">₦2,000</p>
                <p className="mt-2 text-sm text-primary-200">Two-time use (2 test/exam attempts)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-sm text-ink-500">Test attempts</span>
                  <span className="text-sm font-bold text-ink-900">2</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-sm text-ink-500">Validity</span>
                  <span className="text-sm font-bold text-ink-900">30 days</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-sm text-ink-500">Payment method</span>
                  <span className="text-sm font-bold text-ink-900">Card / Transfer</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <button onClick={handlePayment} disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₦2,000
                    <CreditCard className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </DashCard>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - RESULTS PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentResultsPage() {
  const results = [
    { subject: 'Mathematics', test: 'Term 1 Mid-term', score: 85, total: 100, grade: 'A', status: 'Pass', date: 'Aug 10, 2026' },
    { subject: 'English Language', test: 'Grammar Quiz', score: 72, total: 100, grade: 'B', status: 'Pass', date: 'Aug 12, 2026' },
    { subject: 'Basic Science', test: 'Science Concepts', score: 68, total: 100, grade: 'C', status: 'Pass', date: 'Aug 14, 2026' },
    { subject: 'Social Studies', test: 'Term 1 Test', score: 45, total: 100, grade: 'F', status: 'Fail', date: 'Aug 15, 2026' },
  ];

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="My Results" subtitle="View your test and exam results" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tests Taken" value="4" icon={ClipboardCheck} color="primary" />
        <StatCard label="Average Score" value="68%" icon={Award} color="accent" />
        <StatCard label="Passed" value="3" icon={Check} color="success" />
        <StatCard label="Failed" value="1" icon={X} color="error" />
      </div>
      <DashCard title="All Results">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4">Test</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  <td className="py-3 pr-4 font-semibold text-ink-900">{r.subject}</td>
                  <td className="py-3 pr-4 text-ink-600">{r.test}</td>
                  <td className="py-3 pr-4 font-bold text-ink-900">{r.score}/{r.total}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${r.grade === 'A' ? 'badge-success' : r.grade === 'B' ? 'badge-primary' : r.grade === 'C' ? 'badge-accent' : 'badge-error'}`}>{r.grade}</span>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3 pr-4 text-xs text-ink-500">{r.date}</td>
                  <td className="py-3">
                    <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View</button>
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

// ═══════════════════════════════════════════════════════════════
// SCHOOL STUDENT - SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════
export function SchoolStudentSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [location, setLocation] = useState(user?.user_metadata?.location || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await supabase.auth.updateUser({
        data: { full_name: fullName, phone, location },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="school-student">
      <DashPageHeader title="Settings" subtitle="Manage your profile and account" />
      <div className="mx-auto max-w-lg">
        <DashCard title="Profile Information">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input pl-11" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
              <input type="email" value={user?.email || ''} disabled className="input bg-ink-50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
            </div>
            {saved && (
              <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700">
                <Check className="h-4 w-4" /> Profile updated successfully!
              </div>
            )}
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <>Save Changes</>}
            </button>
          </form>
        </DashCard>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentDashboard() {
  const { institution, loading } = useInstitution();
  const { user } = useAuth();

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="My Dashboard" subtitle={user?.user_metadata?.full_name || 'Student'}>
        <Link to="/tertiary-education-student/courses" className="btn-primary">Select Courses</Link>
      </DashPageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : institution ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <DashCard title="My Tertiary Education">
              <div className="flex items-start gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <School className="h-8 w-8" />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900">{institution.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" /> {institution.location}</p>
                    <p className="flex items-center gap-2 text-sm text-ink-500"><Mail className="h-3.5 w-3.5" /> {institution.contact_email}</p>
                    <p className="flex items-center gap-2 text-sm text-ink-500"><Phone className="h-3.5 w-3.5" /> {institution.contact_phone}</p>
                  </div>
                  {institution.description && <p className="mt-3 text-sm text-ink-600">{institution.description}</p>}
                </div>
              </div>
            </DashCard>

            <DashCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Courses', to: '/tertiary-education-student/courses', icon: BookOpen },
                  { label: 'Learning', to: '/tertiary-education-student/learning', icon: BookMarked },
                  { label: 'CBT Test', to: '/tertiary-education-student/cbt', icon: ClipboardCheck },
                  { label: 'Payment', to: '/tertiary-education-student/payment', icon: CreditCard },
                  { label: 'Results', to: '/tertiary-education-student/results', icon: Award },
                  { label: 'Settings', to: '/tertiary-education-student/settings', icon: Settings },
                ].map((a) => (
                  <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 p-4 hover:border-primary-200 hover:bg-primary-50/50">
                    <a.icon className="h-6 w-6 text-primary-500" />
                    <span className="text-xs font-medium text-ink-600">{a.label}</span>
                  </Link>
                ))}
              </div>
            </DashCard>
          </div>

          <div className="space-y-6">
            <DashCard title="My Stats">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Selected Courses</span>
                  <span className="text-sm font-bold text-ink-900">3</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Tests Taken</span>
                  <span className="text-sm font-bold text-ink-900">8</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Payment Uses Left</span>
                  <span className="text-sm font-bold text-warning-600">2</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <span className="text-xs text-ink-500">Current CGPA</span>
                  <span className="text-sm font-bold text-success-600">4.2</span>
                </div>
              </div>
            </DashCard>
          </div>
        </div>
      ) : (
        <DashCard>
          <div className="py-12 text-center">
            <School className="mx-auto h-12 w-12 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No tertiary institution linked to your account yet.</p>
          </div>
        </DashCard>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - COURSES PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentCoursesPage() {
  const { user } = useAuth();
  const { institution } = useInstitution();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!institution) { setLoading(false); return; }
    supabase
      .from('courses')
      .select('*')
      .eq('institution_id', institution.id)
      .eq('is_active', true)
      .order('code')
      .then(({ data }) => {
        if (data) setCourses(data as Course[]);
        setLoading(false);
      });
  }, [institution]);

  const toggleCourse = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="My Courses" subtitle="Select the courses you want to study" />
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
      ) : (
        <DashCard title={`Available Courses (${courses.length})`}>
          <div className="space-y-2">
            {courses.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 p-3 hover:bg-primary-50/50">
                <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleCourse(c.id)} className="h-5 w-5 rounded border-ink-300 text-primary-600 focus:ring-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.code} — {c.name}</p>
                  <p className="text-xs text-ink-400">{c.level} · {c.semester} semester · {c.credits} credits</p>
                </div>
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-50 p-4">
              <p className="text-sm font-medium text-primary-700">{selected.length} course(s) selected</p>
              <Link to="/tertiary-education-student/learning" className="btn-primary text-xs">Continue to Learning <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          )}
        </DashCard>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - LEARNING PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentLearningPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const schemes = [
    { week: 1, topic: 'Introduction & Overview', notes: 'Course introduction, syllabus review, and foundational concepts.' },
    { week: 2, topic: 'Core Principles', notes: 'Fundamental theories and principles of the subject area.' },
    { week: 3, topic: 'Practical Applications', notes: 'Real-world applications and case studies.' },
    { week: 4, topic: 'Advanced Topics I', notes: 'Advanced concepts and deeper exploration.' },
    { week: 5, topic: 'Advanced Topics II', notes: 'Continued advanced topics with problem sets.' },
    { week: 6, topic: 'Review & Mid-term Prep', notes: 'Comprehensive review and mid-term examination preparation.' },
  ];

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="Learning" subtitle="View scheme of work and notes for your courses" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <DashCard title="My Courses">
            <div className="space-y-2">
              {['CSC 301 — Data Structures', 'CSC 305 — Database Systems', 'MTH 201 — Linear Algebra'].map((c) => (
                <button key={c} onClick={() => setSelectedCourse(c)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selectedCourse === c ? 'bg-primary-50 text-primary-700' : 'hover:bg-ink-50'}`}>
                  <BookOpen className="h-4 w-4 text-ink-400" />
                  <span className="text-sm font-medium">{c}</span>
                </button>
              ))}
            </div>
          </DashCard>
        </div>
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <DashCard title={`${selectedCourse} — Scheme of Work`}>
              <div className="space-y-3">
                {schemes.map((s) => (
                  <div key={s.week} className="rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-ink-900">Week {s.week}: {s.topic}</p>
                        <p className="mt-1 text-xs text-ink-500">{s.notes}</p>
                      </div>
                      <button className="btn-ghost text-xs"><Download className="h-3.5 w-3.5" /> Notes</button>
                    </div>
                  </div>
                ))}
              </div>
            </DashCard>
          ) : (
            <DashCard>
              <div className="py-12 text-center">
                <BookMarked className="mx-auto h-12 w-12 text-ink-300" />
                <p className="mt-3 text-sm text-ink-500">Select a course to view its scheme of work</p>
              </div>
            </DashCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - CBT TEST PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentCbtPage() {
  const [paid, setPaid] = useState(false);
  const [usesRemaining] = useState(2);

  const tests = [
    { id: 1, course: 'CSC 301', title: 'Data Structures Midterm', questions: 40, duration: '60 min' },
    { id: 2, course: 'CSC 305', title: 'Database Systems Quiz', questions: 30, duration: '45 min' },
    { id: 3, course: 'MTH 201', title: 'Linear Algebra Test', questions: 25, duration: '40 min' },
  ];

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="CBT Test / Exam" subtitle="Take computer-based tests for your courses" />
      {!paid ? (
        <DashCard>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="h-12 w-12 text-warning-500" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">Payment Required</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-500">You need to make a payment of ₦2,000 to access CBT tests. This gives you two test attempts.</p>
            <Link to="/tertiary-education-student/payment" className="btn-primary mt-6">Make Payment <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </DashCard>
      ) : (
        <DashCard title="Available Tests">
          <div className="space-y-3">
            {tests.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div>
                  <p className="text-sm font-bold text-ink-900">{t.title}</p>
                  <p className="text-xs text-ink-400">{t.course} · {t.questions} questions · {t.duration}</p>
                </div>
                <button disabled={usesRemaining === 0} className="btn-primary text-xs disabled:opacity-50">Start Test <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </DashCard>
      )}
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - PAYMENT PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentPaymentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('payments').insert({
        user_email: user?.email || '',
        amount: 2000,
        status: 'completed',
        uses_remaining: 2,
        payment_method: 'card',
        reference: `ILA-${Date.now()}`,
      });
      if (insertError) throw insertError;
      setPaid(true);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="Payment" subtitle="Pay for CBT test access" />
      <div className="mx-auto max-w-lg">
        <DashCard>
          {paid ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="h-12 w-12 text-success-500" />
              <h3 className="mt-4 text-lg font-bold text-ink-900">Payment Successful!</h3>
              <p className="mt-2 text-sm text-ink-500">You now have 2 test attempts available.</p>
              <Link to="/tertiary-education-student/cbt" className="btn-primary mt-6">Go to CBT Tests <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white">
                <p className="text-sm text-primary-100">CBT Test Access</p>
                <p className="mt-2 text-4xl font-extrabold">₦2,000</p>
                <p className="mt-2 text-sm text-primary-200">Two-time use (2 test/exam attempts)</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-sm text-ink-500">Test attempts</span><span className="text-sm font-bold text-ink-900">2</span></div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-sm text-ink-500">Validity</span><span className="text-sm font-bold text-ink-900">30 days</span></div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-sm text-ink-500">Payment method</span><span className="text-sm font-bold text-ink-900">Card / Transfer</span></div>
              </div>
              {error && <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" /> {error}</div>}
              <button onClick={handlePayment} disabled={loading} className="btn-primary w-full">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <>Pay ₦2,000 <CreditCard className="h-4 w-4" /></>}
              </button>
            </div>
          )}
        </DashCard>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - RESULTS PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentResultsPage() {
  const results = [
    { course: 'CSC 201', test: 'Programming Fundamentals', score: 88, total: 100, grade: 'A', status: 'Pass', date: 'Jun 12, 2026' },
    { course: 'MTH 101', test: 'Calculus I', score: 72, total: 100, grade: 'B', status: 'Pass', date: 'Jun 15, 2026' },
    { course: 'GST 101', test: 'Communication Skills', score: 91, total: 100, grade: 'A', status: 'Pass', date: 'Jun 20, 2026' },
    { course: 'CSC 205', test: 'Computer Architecture', score: 45, total: 100, grade: 'F', status: 'Fail', date: 'Jun 22, 2026' },
  ];

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="My Results" subtitle="View your test and exam results" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tests Taken" value="4" icon={ClipboardCheck} color="primary" />
        <StatCard label="Average Score" value="74%" icon={Award} color="accent" />
        <StatCard label="Passed" value="3" icon={Check} color="success" />
        <StatCard label="Failed" value="1" icon={X} color="error" />
      </div>
      <DashCard title="All Results">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Test</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  <td className="py-3 pr-4 font-semibold text-ink-900">{r.course}</td>
                  <td className="py-3 pr-4 text-ink-600">{r.test}</td>
                  <td className="py-3 pr-4 font-bold text-ink-900">{r.score}/{r.total}</td>
                  <td className="py-3 pr-4"><span className={`badge ${r.grade === 'A' ? 'badge-success' : r.grade === 'B' ? 'badge-primary' : r.grade === 'C' ? 'badge-accent' : 'badge-error'}`}>{r.grade}</span></td>
                  <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3 pr-4 text-xs text-ink-500">{r.date}</td>
                  <td className="py-3"><button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSITY STUDENT - SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════
export function TertiaryEducationStudentSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [location, setLocation] = useState(user?.user_metadata?.location || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await supabase.auth.updateUser({ data: { full_name: fullName, phone, location } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="tertiary-education-student">
      <DashPageHeader title="Settings" subtitle="Manage your profile and account" />
      <div className="mx-auto max-w-lg">
        <DashCard title="Profile Information">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input pl-11" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
              <input type="email" value={user?.email || ''} disabled className="input bg-ink-50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
            </div>
            {saved && <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" /> Profile updated successfully!</div>}
            <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <>Save Changes</>}</button>
          </form>
        </DashCard>
      </div>
    </DashboardLayout>
  );
}
