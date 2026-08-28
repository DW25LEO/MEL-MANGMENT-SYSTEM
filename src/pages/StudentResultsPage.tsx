import { useEffect, useState } from 'react';
import { AlertCircle, Award, Check, ClipboardCheck, Loader2, X } from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader, StatCard, StatusBadge } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';

type Result = {
  id: string;
  score: number | null;
  total_marks: number | null;
  is_pass: boolean | null;
  attempt_number: number;
  submitted_at: string | null;
  exams?: { title: string; courses?: { name: string | null; subject_name: string | null; code: string | null } | null } | null;
};

export function StudentResultsPage({ role = 'student' }: { role?: 'student' | 'school-student' | 'tertiary-education-student' }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error: queryError } = await supabase
        .from('exam_attempts')
        .select('id,score,total_marks,is_pass,attempt_number,submitted_at,exams(title,courses(name,subject_name,code))')
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });
      if (!active) return;
      if (queryError) setError(queryError.message);
      const normalized = (data || []).map((row) => ({
        ...row,
        exams: Array.isArray(row.exams) ? row.exams[0] || null : row.exams,
      })).map((row) => ({
        ...row,
        exams: row.exams ? { ...row.exams, courses: Array.isArray(row.exams.courses) ? row.exams.courses[0] || null : row.exams.courses } : null,
      })) as Result[];
      setResults(normalized);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  const passed = results.filter((result) => result.is_pass).length;
  const failed = results.length - passed;
  const average = results.length ? Math.round(results.reduce((sum, result) => sum + (result.score || 0), 0) / results.length) : 0;
  return (
    <DashboardLayout role={role}>
      <DashPageHeader title="My Results" subtitle="View your submitted examination results" />
      {error && <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" />{error}</div>}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Exams Taken" value={String(results.length)} icon={ClipboardCheck} color="primary" />
        <StatCard label="Average Score" value={`${average}%`} icon={Award} color="accent" />
        <StatCard label="Passed" value={String(passed)} icon={Check} color="success" />
        <StatCard label="Failed" value={String(failed)} icon={X} color="error" />
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : results.length === 0 ? <DashCard><div className="py-12 text-center"><Award className="mx-auto h-12 w-12 text-ink-300" /><p className="mt-3 text-sm text-ink-500">You have no submitted exam results yet.</p><a href={`#${role === 'student' ? '/student/exams' : role === 'school-student' ? '/school-student/cbt' : '/tertiary-education-student/cbt'}`} className="btn-primary mt-5">View Available Exams</a></div></DashCard> : (
        <DashCard title={`All Results (${results.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-ink-200 text-xs uppercase text-ink-400"><th className="p-3">Exam</th><th className="p-3">Course</th><th className="p-3">Score</th><th className="p-3">Status</th><th className="p-3">Attempt</th><th className="p-3">Date</th></tr></thead>
              <tbody className="divide-y divide-ink-100">
                {results.map((result) => <tr key={result.id} className="hover:bg-ink-50"><td className="p-3 font-semibold text-ink-900">{result.exams?.title || 'Exam'}</td><td className="p-3 text-ink-600">{result.exams?.courses?.code || result.exams?.courses?.name || result.exams?.courses?.subject_name || '—'}</td><td className="p-3 font-bold text-ink-900">{result.score ?? 0}%</td><td className="p-3"><StatusBadge status={result.is_pass ? 'Pass' : 'Fail'} /></td><td className="p-3 text-ink-600">{result.attempt_number}</td><td className="p-3 text-xs text-ink-500">{result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : '—'}</td></tr>)}
              </tbody>
            </table>
          </div>
        </DashCard>
      )}
    </DashboardLayout>
  );
}
