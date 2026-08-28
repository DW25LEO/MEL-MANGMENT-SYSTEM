import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, ChevronDown, ClipboardCheck,
  Clock, Edit2, Loader2, Plus, Save, Trash2, X, ListChecks,
} from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader, StatusBadge } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { AdminGuard } from '@/pages/SuperAdminPages';

type Course = { id: string; code: string; name: string; subject_name: string | null; school_name: string | null; class_level: string | null };
type Term = { id: string; name: string; start_date: string | null; end_date: string | null; is_active: boolean };
type ExamType = { id: string; name: string; description: string | null; is_active: boolean };
type School = { id: string; name: string; type: string };
type Exam = {
  id: string;
  title: string;
  course_id: string | null;
  term_id: string | null;
  exam_type_id: string | null;
  school_id: string | null;
  class_level: string | null;
  duration_minutes: number;
  instructions: string | null;
  pass_mark: number;
  question_count: number;
  attempt_limit: number;
  status: string;
  created_at: string;
};
type Question = {
  id: string;
  exam_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  marks: number;
};

function Message({ error, success }: { error: string; success: string }) {
  if (error) return <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" />{error}</div>;
  if (success) return <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" />{success}</div>;
  return null;
}

const statusColors: Record<string, string> = {
  draft: 'badge-ink',
  published: 'badge-success',
  archived: 'badge-warning',
};

// ═══════════════════════════════════════════════════════════════
// EXAM LIST PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [message, setMessage] = useState({ error: '', success: '' });

  const load = async () => {
    const [{ data: examData, error: examError }, { data: courseData }, { data: termData }, { data: typeData }, { data: schoolData }] = await Promise.all([
      supabase.from('exams').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('id,code,name,subject_name,school_name,class_level').order('name'),
      supabase.from('terms').select('*').order('name'),
      supabase.from('exam_types').select('*').order('name'),
      supabase.from('schools').select('id,name,type').order('name'),
    ]);
    if (examError) setMessage({ error: examError.message, success: '' });
    setExams((examData || []) as Exam[]);
    setCourses((courseData || []) as Course[]);
    setTerms((termData || []) as Term[]);
    setExamTypes((typeData || []) as ExamType[]);
    setSchools((schoolData || []) as School[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const changeStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('exams').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else { setMessage({ error: '', success: `Exam ${status}.` }); void load(); }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Delete this exam and all its questions? This cannot be undone.')) return;
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else { setMessage({ error: '', success: 'Exam deleted.' }); void load(); }
  };

  const filtered = filter === 'all' ? exams : exams.filter((e) => e.status === filter);
  const courseName = (id: string | null) => courses.find((c) => c.id === id)?.name || courses.find((c) => c.id === id)?.subject_name || '—';
  const termName = (id: string | null) => terms.find((t) => t.id === id)?.name || '—';
  const typeName = (id: string | null) => examTypes.find((t) => t.id === id)?.name || '—';

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Examinations" subtitle="Create, publish, and manage exams">
          <button onClick={() => { setEditingExam(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Create Exam</button>
        </DashPageHeader>
        <Message {...message} />

        {showForm && (
          <ExamForm
            exam={editingExam}
            courses={courses}
            terms={terms}
            examTypes={examTypes}
            schools={schools}
            onCancel={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); void load(); }}
          />
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {['all', 'draft', 'published', 'archived'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-primary text-xs' : 'btn-outline text-xs'}>
              {s === 'all' ? 'All Exams' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
        ) : filtered.length === 0 ? (
          <DashCard><div className="py-12 text-center"><ClipboardCheck className="mx-auto h-12 w-12 text-ink-300" /><p className="mt-3 text-sm text-ink-500">No exams found. Create your first exam.</p></div></DashCard>
        ) : (
          <DashCard title={`Exams (${filtered.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-xs uppercase text-ink-400">
                    <th className="p-3">Title</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Term</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Pass Mark</th>
                    <th className="p-3">Attempts</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((exam) => (
                    <tr key={exam.id} className="hover:bg-ink-50">
                      <td className="p-3 font-semibold text-ink-900">{exam.title}</td>
                      <td className="p-3 text-ink-600">{courseName(exam.course_id)}</td>
                      <td className="p-3 text-ink-600">{termName(exam.term_id)}</td>
                      <td className="p-3 text-ink-600">{typeName(exam.exam_type_id)}</td>
                      <td className="p-3 text-ink-600">{exam.duration_minutes} min</td>
                      <td className="p-3 text-ink-600">{exam.question_count}</td>
                      <td className="p-3 text-ink-600">{exam.pass_mark}%</td>
                      <td className="p-3 text-ink-600">{exam.attempt_limit}</td>
                      <td className="p-3"><span className={statusColors[exam.status] || 'badge-ink'}>{exam.status}</span></td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          <button onClick={() => window.location.hash = `#/super-admin/exams/${exam.id}/questions`} className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600" title="Manage Questions"><ListChecks className="h-4 w-4" /></button>
                          <button onClick={() => { setEditingExam(exam); setShowForm(true); }} className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600" title="Edit"><Edit2 className="h-4 w-4" /></button>
                          {exam.status === 'draft' && (
                            <button onClick={() => changeStatus(exam.id, 'published')} className="rounded-lg p-1.5 text-success-600 hover:bg-success-50" title="Publish"><Check className="h-4 w-4" /></button>
                          )}
                          {exam.status === 'published' && (
                            <button onClick={() => changeStatus(exam.id, 'draft')} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100" title="Unpublish"><X className="h-4 w-4" /></button>
                          )}
                          {exam.status !== 'archived' && (
                            <button onClick={() => changeStatus(exam.id, 'archived')} className="rounded-lg p-1.5 text-warning-600 hover:bg-warning-50" title="Archive"><ChevronDown className="h-4 w-4" /></button>
                          )}
                          <button onClick={() => deleteExam(exam.id)} className="rounded-lg p-1.5 text-error-600 hover:bg-error-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashCard>
        )}
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXAM CREATE / EDIT FORM
// ═══════════════════════════════════════════════════════════════
function ExamForm({
  exam, courses, terms, examTypes, schools, onCancel, onSaved,
}: {
  exam: Exam | null;
  courses: Course[];
  terms: Term[];
  examTypes: ExamType[];
  schools: School[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: exam?.title || '',
    course_id: exam?.course_id || '',
    term_id: exam?.term_id || '',
    exam_type_id: exam?.exam_type_id || '',
    school_id: exam?.school_id || '',
    class_level: exam?.class_level || '',
    duration_minutes: exam?.duration_minutes || 60,
    instructions: exam?.instructions || '',
    pass_mark: exam?.pass_mark || 50,
    attempt_limit: exam?.attempt_limit || 2,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); setSaving(false); return; }
    if (form.duration_minutes < 1) { setError('Duration must be at least 1 minute.'); setSaving(false); return; }
    if (form.pass_mark < 0 || form.pass_mark > 100) { setError('Pass mark must be between 0 and 100.'); setSaving(false); return; }
    if (form.attempt_limit < 1) { setError('Attempt limit must be at least 1.'); setSaving(false); return; }

    const payload = {
      title: form.title.trim(),
      course_id: form.course_id || null,
      term_id: form.term_id || null,
      exam_type_id: form.exam_type_id || null,
      school_id: form.school_id || null,
      class_level: form.class_level || null,
      duration_minutes: form.duration_minutes,
      instructions: form.instructions || null,
      pass_mark: form.pass_mark,
      attempt_limit: form.attempt_limit,
      updated_at: new Date().toISOString(),
    };

    const result = exam
      ? await supabase.from('exams').update(payload).eq('id', exam.id).select('*').single()
      : await supabase.from('exams').insert({ ...payload, status: 'draft' }).select('*').single();

    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved();
  };

  return (
    <DashCard title={exam ? 'Edit Exam' : 'Create New Exam'} className="mb-6">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Exam Title</label>
          <input required className="input" placeholder="e.g. Data Structures Midterm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Course</label>
            <select className="input" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
              <option value="">— Select course —</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}{c.subject_name ? ` (${c.subject_name})` : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Term</label>
            <select className="input" value={form.term_id} onChange={(e) => setForm({ ...form, term_id: e.target.value })}>
              <option value="">— Select term —</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Exam Type</label>
            <select className="input" value={form.exam_type_id} onChange={(e) => setForm({ ...form, exam_type_id: e.target.value })}>
              <option value="">— Select type —</option>
              {examTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">School</label>
            <select className="input" value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })}>
              <option value="">— Select school —</option>
              {schools.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Class / Level</label>
            <input className="input" placeholder="e.g. JSS 3, SSS 2, 300 Level" value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Duration (minutes)</label>
            <input type="number" min={1} required className="input" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Pass Mark (%)</label>
            <input type="number" min={0} max={100} required className="input" value={form.pass_mark} onChange={(e) => setForm({ ...form, pass_mark: parseInt(e.target.value) || 50 })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Attempt Limit</label>
            <input type="number" min={1} required className="input" value={form.attempt_limit} onChange={(e) => setForm({ ...form, attempt_limit: parseInt(e.target.value) || 2 })} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Instructions</label>
          <textarea className="input" rows={3} placeholder="Instructions shown to students before starting the exam" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        </div>
        {error && <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" /> {error}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> {exam ? 'Update Exam' : 'Create Exam'}</>}</button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        </div>
      </form>
    </DashCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXAM QUESTIONS PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminExamQuestionsPage({ examId }: { examId: string }) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [message, setMessage] = useState({ error: '', success: '' });

  const load = async () => {
    const [{ data: examData }, { data: qData, error: qError }] = await Promise.all([
      supabase.from('exams').select('*').eq('id', examId).maybeSingle(),
      supabase.from('exam_questions').select('*').eq('exam_id', examId).order('created_at'),
    ]);
    if (qError) setMessage({ error: qError.message, success: '' });
    setExam((examData || null) as Exam | null);
    setQuestions((qData || []) as Question[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [examId]);

  const deleteQuestion = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const { error } = await supabase.from('exam_questions').delete().eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else { setMessage({ error: '', success: 'Question deleted.' }); void load(); }
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <div className="mb-4">
          <a href="#/super-admin/exams" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" /> Back to Exams
          </a>
        </div>
        <DashPageHeader title={exam?.title || 'Exam Questions'} subtitle={exam ? `${exam.question_count} questions · ${exam.duration_minutes} min · Pass mark ${exam.pass_mark}%` : 'Loading exam...'}>
          <button onClick={() => { setEditingQ(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Add Question</button>
        </DashPageHeader>
        <Message {...message} />

        {showForm && (
          <QuestionForm
            examId={examId}
            question={editingQ}
            onCancel={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); void load(); }}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
        ) : questions.length === 0 ? (
          <DashCard><div className="py-12 text-center"><ListChecks className="mx-auto h-12 w-12 text-ink-300" /><p className="mt-3 text-sm text-ink-500">No questions yet. Add your first question.</p></div></DashCard>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <DashCard key={q.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink-900">Q{i + 1}. {q.question_text}</p>
                    <div className="mt-3 space-y-1.5">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${idx === q.correct_option_index ? 'bg-success-50 text-success-700 font-semibold' : 'text-ink-600'}`}>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink-200 text-xs">{String.fromCharCode(65 + idx)}</span>
                          {opt}
                          {idx === q.correct_option_index && <Check className="h-3.5 w-3.5 text-success-600" />}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-ink-400">Marks: {q.marks}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingQ(q); setShowForm(true); }} className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteQuestion(q.id)} className="rounded-lg p-1.5 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </DashCard>
            ))}
          </div>
        )}
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION FORM (add/edit)
// ═══════════════════════════════════════════════════════════════
function QuestionForm({
  examId, question, onCancel, onSaved,
}: {
  examId: string;
  question: Question | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [questionText, setQuestionText] = useState(question?.question_text || '');
  const [options, setOptions] = useState<string[]>(question?.options?.length ? question.options : ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(question?.correct_option_index ?? 0);
  const [marks, setMarks] = useState(question?.marks || 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateOption = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };
  const addOption = () => { if (options.length < 6) setOptions([...options, '']); };
  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== idx);
    setOptions(next);
    if (correctIndex >= next.length) setCorrectIndex(next.length - 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!questionText.trim()) { setError('Question text is required.'); setSaving(false); return; }
    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) { setError('At least 2 options are required.'); setSaving(false); return; }
    if (correctIndex >= filled.length) { setError('Correct option index is invalid.'); setSaving(false); return; }

    const payload = {
      exam_id: examId,
      question_text: questionText.trim(),
      options: filled,
      correct_option_index: correctIndex,
      marks,
    };

    const result = question
      ? await supabase.from('exam_questions').update(payload).eq('id', question.id).select('*').single()
      : await supabase.from('exam_questions').insert(payload).select('*').single();

    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved();
  };

  return (
    <DashCard title={question ? 'Edit Question' : 'Add Question'} className="mb-6">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Question Text</label>
          <textarea required className="input" rows={2} placeholder="Enter the question" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Options (select the correct one)</label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button type="button" onClick={() => setCorrectIndex(idx)} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${idx === correctIndex ? 'border-success-500 bg-success-50 text-success-700' : 'border-ink-200 text-ink-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </button>
                <input className="input" placeholder={`Option ${String.fromCharCode(65 + idx)}`} value={opt} onChange={(e) => updateOption(idx, e.target.value)} />
                {options.length > 2 && <button type="button" onClick={() => removeOption(idx)} className="rounded-lg p-1.5 text-error-400 hover:bg-error-50"><X className="h-4 w-4" /></button>}
              </div>
            ))}
          </div>
          {options.length < 6 && <button type="button" onClick={addOption} className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"><Plus className="inline h-3.5 w-3.5" /> Add option</button>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Marks</label>
          <input type="number" min={1} required className="input w-32" value={marks} onChange={(e) => setMarks(parseInt(e.target.value) || 1)} />
        </div>
        {error && <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" /> {error}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> {question ? 'Update Question' : 'Add Question'}</>}</button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        </div>
      </form>
    </DashCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// TERMS MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminTermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });

  const load = async () => {
    const { data, error } = await supabase.from('terms').select('*').order('name');
    if (error) setMessage({ error: error.message, success: '' });
    setTerms((data || []) as Term[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('terms').insert({
      name: form.name.trim(),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    });
    if (error) setMessage({ error: error.message, success: '' });
    else { setForm({ name: '', start_date: '', end_date: '' }); setShowForm(false); setMessage({ error: '', success: 'Term added.' }); void load(); }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('terms').update({ is_active: !current }).eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else void load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this term?')) return;
    const { error } = await supabase.from('terms').delete().eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else void load();
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Academic Terms" subtitle="Manage terms that group courses and exams">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="h-4 w-4" /> Add Term</button>
        </DashPageHeader>
        <Message {...message} />
        {showForm && (
          <DashCard title="Add Term" className="mb-6">
            <form onSubmit={add} className="grid gap-4 sm:grid-cols-3">
              <input required className="input" placeholder="Term name (e.g. First Term)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="date" className="input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <input type="date" className="input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              <button type="submit" disabled={saving} className="btn-primary sm:col-span-3 sm:w-fit">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Term'}</button>
            </form>
          </DashCard>
        )}
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : (
          <DashCard title={`Terms (${terms.length})`}>
            <div className="space-y-2">
              {terms.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{t.name}</p>
                    <p className="text-xs text-ink-400">{t.start_date || '—'} to {t.end_date || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(t.id, t.is_active)} className={t.is_active ? 'badge-success' : 'badge-ink'}>{t.is_active ? 'Active' : 'Inactive'}</button>
                    <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        )}
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXAM TYPES MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminExamTypesPage() {
  const [types, setTypes] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });

  const load = async () => {
    const { data, error } = await supabase.from('exam_types').select('*').order('name');
    if (error) setMessage({ error: error.message, success: '' });
    setTypes((data || []) as ExamType[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('exam_types').insert({ name: form.name.trim(), description: form.description || null });
    if (error) setMessage({ error: error.message, success: '' });
    else { setForm({ name: '', description: '' }); setShowForm(false); setMessage({ error: '', success: 'Exam type added.' }); void load(); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this exam type?')) return;
    const { error } = await supabase.from('exam_types').delete().eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else void load();
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Exam Types" subtitle="Configure types like Midterm, Final, Quiz, CBT Test">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="h-4 w-4" /> Add Type</button>
        </DashPageHeader>
        <Message {...message} />
        {showForm && (
          <DashCard title="Add Exam Type" className="mb-6">
            <form onSubmit={add} className="space-y-4">
              <input required className="input" placeholder="Type name (e.g. Midterm)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="input" rows={2} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Type'}</button>
            </form>
          </DashCard>
        )}
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : (
          <DashCard title={`Exam Types (${types.length})`}>
            <div className="space-y-2">
              {types.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{t.name}</p>
                    <p className="text-xs text-ink-400">{t.description || 'No description'}</p>
                  </div>
                  <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </DashCard>
        )}
      </DashboardLayout>
    </AdminGuard>
  );
}
