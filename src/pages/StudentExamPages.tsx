import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Clock, Loader2, Lock, Send } from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link } from '@/lib/router';

type StudentExam = {
  id: string;
  title: string;
  course_id: string | null;
  class_level: string | null;
  duration_minutes: number;
  instructions: string | null;
  pass_mark: number;
  question_count: number;
  attempt_limit: number;
  status: string;
  courses?: { name: string | null; subject_name: string | null; code: string | null } | null;
};

type Question = {
  id: string;
  question_text: string;
  options: string[];
  marks: number;
};

type Attempt = {
  id: string;
  attempt_number: number;
  status: string;
};

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}

export function StudentExamsPage({ role = 'student' }: { role?: 'student' | 'school-student' | 'tertiary-education-student' }) {
  const { user } = useAuth();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) { setError('Please sign in to view your exams.'); setLoading(false); return; }
      const { data: registrations, error: registrationError } = await supabase.from('user_courses').select('course_id').eq('user_id', user.id);
      if (registrationError) { setError(registrationError.message); setLoading(false); return; }
      const courseIds = (registrations || []).map((row) => row.course_id as string);
      if (courseIds.length === 0) { setExams([]); setLoading(false); return; }
      const { data, error: examError } = await supabase
        .from('exams')
        .select('id,title,course_id,class_level,duration_minutes,instructions,pass_mark,question_count,attempt_limit,status,courses(name,subject_name,code)')
        .in('course_id', courseIds)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (!active) return;
      if (examError) setError(examError.message);
      setExams((data || []).map((row) => ({ ...row, courses: Array.isArray(row.courses) ? row.courses[0] || null : row.courses })) as StudentExam[]);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [user]);

  const rolePath = role === 'school-student' ? '/school-student/cbt' : role === 'tertiary-education-student' ? '/tertiary-education-student/cbt' : '/student/exams';
  const examPath = role === 'school-student' ? '/school-student/exam' : role === 'tertiary-education-student' ? '/tertiary-education-student/exam' : '/student/exam';

  return (
    <DashboardLayout role={role}>
      <DashPageHeader title="Available Examinations" subtitle="Only exams for your registered courses are shown." />
      <ErrorMessage message={error} />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : exams.length === 0 ? (
        <DashCard><div className="py-12 text-center"><Lock className="mx-auto h-12 w-12 text-ink-300" /><p className="mt-3 text-sm text-ink-500">No published exams are available for your registered courses.</p><Link to={rolePath === '/student/exams' ? '/student/courses' : role === 'school-student' ? '/school-student/subjects' : '/tertiary-education-student/courses'} className="btn-outline mt-5">View Registered Courses</Link></div></DashCard>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {exams.map((exam) => (
            <DashCard key={exam.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{exam.courses?.code || exam.courses?.subject_name || 'Registered Course'}</p>
                  <h2 className="mt-1 text-lg font-bold text-ink-900">{exam.title}</h2>
                  <p className="mt-1 text-sm text-ink-500">{exam.courses?.name || exam.courses?.subject_name || 'Course exam'}{exam.class_level ? ` · ${exam.class_level}` : ''}</p>
                </div>
                <span className="badge-success">Available</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-ink-50 p-3"><Clock className="mx-auto h-4 w-4 text-primary-500" /><p className="mt-1 text-sm font-bold text-ink-900">{exam.duration_minutes}m</p><p className="text-2xs text-ink-400">Duration</p></div>
                <div className="rounded-xl bg-ink-50 p-3"><p className="text-lg font-bold text-ink-900">{exam.question_count}</p><p className="text-2xs text-ink-400">Questions</p></div>
                <div className="rounded-xl bg-ink-50 p-3"><p className="text-lg font-bold text-ink-900">{exam.attempt_limit}</p><p className="text-2xs text-ink-400">Attempts</p></div>
              </div>
              <Link to={`${examPath}/${exam.id}`} className="btn-primary mt-5 w-full">View Instructions <span>→</span></Link>
            </DashCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function StudentExamTakingPage({ examId, role = 'student' }: { examId: string; role?: 'student' | 'school-student' | 'tertiary-education-student' }) {
  const { user } = useAuth();
  const [exam, setExam] = useState<StudentExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ score: number; is_pass: boolean; attempt_number: number } | null>(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const listPath = role === 'school-student' ? '/school-student/cbt' : role === 'tertiary-education-student' ? '/tertiary-education-student/cbt' : '/student/exams';

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: examData, error: examError } = await supabase.from('exams').select('id,title,course_id,class_level,duration_minutes,instructions,pass_mark,question_count,attempt_limit,status,courses(name,subject_name,code)').eq('id', examId).maybeSingle();
      if (!active) return;
      if (examError || !examData) { setError(examError?.message || 'This exam is not available.'); setLoading(false); return; }
      const { data: questionData, error: questionError } = await supabase.from('exam_questions').select('id,question_text,options,marks').eq('exam_id', examId).order('created_at');
      if (questionError) { setError(questionError.message); setLoading(false); return; }
      setExam({ ...examData, courses: Array.isArray(examData.courses) ? examData.courses[0] || null : examData.courses } as StudentExam);
      setQuestions((questionData || []).map((q) => ({ ...q, options: Array.isArray(q.options) ? q.options as string[] : [] })) as Question[]);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [examId]);

  useEffect(() => {
    if (!started || submitted || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, submitted, remaining]);

  useEffect(() => {
    if (started && remaining === 0 && attempt && !submitted && !submitting) void submitExam();
  }, [remaining, started, attempt, submitted, submitting]);

  const startExam = async () => {
    if (!user || !exam) return;
    setStarting(true);
    setError('');
    const { data: nextNumber, error: numberError } = await supabase.rpc('get_next_attempt_number', { p_exam_id: exam.id });
    if (numberError) { setError(numberError.message); setStarting(false); return; }
    const attemptNumber = Number(nextNumber);
    if (attemptNumber > exam.attempt_limit) { setError('You have used all available attempts for this exam.'); setStarting(false); return; }
    const { data, error: attemptError } = await supabase.from('exam_attempts').insert({ exam_id: exam.id, attempt_number: attemptNumber }).select('id,attempt_number,status').single();
    if (attemptError || !data) { setError(attemptError?.message || 'Unable to start this exam.'); setStarting(false); return; }
    setAttempt(data as Attempt);
    setRemaining(exam.duration_minutes * 60);
    setStarted(true);
    setStarting(false);
  };

  const submitExam = async () => {
    if (!attempt || submitting || submitted) return;
    setSubmitting(true);
    const payload = questions.map((q) => ({ question_id: q.id, selected_option_index: answers[q.id] ?? null }));
    const { data, error: submitError } = await supabase.rpc('submit_exam_attempt', { p_attempt_id: attempt.id, p_answers: payload });
    if (submitError || !data) { setError(submitError?.message || 'Unable to submit exam.'); setSubmitting(false); return; }
    setSubmitted({ score: data.score || 0, is_pass: Boolean(data.is_pass), attempt_number: data.attempt_number });
    setSubmitting(false);
  };

  const timeLabel = useMemo(() => `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`, [remaining]);
  const answered = Object.values(answers).filter((value) => value !== null && value !== undefined).length;

  if (loading) return <DashboardLayout role={role}><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div></DashboardLayout>;
  if (!exam) return <DashboardLayout role={role}><ErrorMessage message={error} /></DashboardLayout>;

  if (submitted) return (
    <DashboardLayout role={role}>
      <DashCard><div className="flex flex-col items-center py-14 text-center"><span className={`flex h-16 w-16 items-center justify-center rounded-full ${submitted.is_pass ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}><Check className="h-8 w-8" /></span><h1 className="mt-5 text-2xl font-bold text-ink-900">Exam Submitted</h1><p className="mt-2 text-5xl font-extrabold text-primary-600">{submitted.score}%</p><p className={`mt-2 font-semibold ${submitted.is_pass ? 'text-success-600' : 'text-error-600'}`}>{submitted.is_pass ? 'Passed' : 'Not passed'} · Attempt {submitted.attempt_number}</p><Link to={listPath} className="btn-primary mt-7">Back to Examinations</Link></div></DashCard>
    </DashboardLayout>
  );

  if (!started) return (
    <DashboardLayout role={role}>
      <div className="mb-4"><a href={`#${listPath}`} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-primary-600"><ArrowLeft className="h-4 w-4" /> Back to Exams</a></div>
      <DashCard><div className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Exam Instructions</p><h1 className="mt-2 text-3xl font-bold text-ink-900">{exam.title}</h1><div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-ink-50 p-4 text-center"><Clock className="mx-auto h-5 w-5 text-primary-500" /><p className="mt-1 font-bold text-ink-900">{exam.duration_minutes} minutes</p></div><div className="rounded-xl bg-ink-50 p-4 text-center"><p className="text-xl font-bold text-ink-900">{exam.question_count}</p><p className="text-xs text-ink-500">Questions</p></div><div className="rounded-xl bg-ink-50 p-4 text-center"><p className="text-xl font-bold text-ink-900">{exam.attempt_limit}</p><p className="text-xs text-ink-500">Maximum attempts</p></div></div><div className="mt-6 rounded-xl border border-ink-100 p-5"><h2 className="font-bold text-ink-900">Instructions</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">{exam.instructions || 'Answer all questions. Your exam will be submitted automatically when the timer ends.'}</p><p className="mt-4 text-sm font-semibold text-warning-700">Pass mark: {exam.pass_mark}%</p></div><ErrorMessage message={error} /><button onClick={() => void startExam()} disabled={starting} className="btn-primary mt-6 w-full">{starting ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</> : <>Start Exam <Send className="h-4 w-4" /></>}</button></div></DashCard>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role={role}>
      <DashPageHeader title={exam.title} subtitle={`${answered} of ${questions.length} answered`}><span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${remaining < 60 ? 'bg-error-50 text-error-700' : 'bg-primary-50 text-primary-700'}`}><Clock className="h-4 w-4" /> {timeLabel}</span></DashPageHeader>
      <ErrorMessage message={error} />
      <div className="mx-auto max-w-3xl space-y-4">
        {questions.map((question, index) => (
          <DashCard key={question.id}>
            <p className="text-sm font-bold leading-relaxed text-ink-900">{index + 1}. {question.question_text}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => <button key={optionIndex} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${answers[question.id] === optionIndex ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-ink-100 text-ink-600 hover:border-primary-200'}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}
            </div>
          </DashCard>
        ))}
        <button onClick={() => void submitExam()} disabled={submitting} className="btn-primary w-full">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Exam <Send className="h-4 w-4" /></>}</button>
      </div>
    </DashboardLayout>
  );
}
