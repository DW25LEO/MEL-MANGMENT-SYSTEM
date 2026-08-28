import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowRight, Check, Download, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader } from '@/components/Dashboard';
import { PageHeader, Section } from '@/components/Page';
import { Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { AdminGuard } from '@/pages/SuperAdminPages';

function Message({ error, success }: { error: string; success: string }) {
  if (error) return <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" />{error}</div>;
  if (success) return <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" />{success}</div>;
  return null;
}

export function SuperAdminTertiaryEducationPage() {
  const [institutions, setInstitutions] = useState<{ id: string; name: string; description: string | null }[]>([]);
  const [exams, setExams] = useState<{ id: string; institution_id: string; exam_name: string; exam_date: string }[]>([]);
  const [institution, setInstitution] = useState({ name: '', description: '' });
  const [exam, setExam] = useState({ institution_id: '', exam_name: '', exam_date: '' });
  const [message, setMessage] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: institutionData, error: institutionError }, { data: examData, error: examError }] = await Promise.all([
      supabase.from('tertiary_institutions').select('id,name,description').order('name'),
      supabase.from('tertiary_exams').select('id,institution_id,exam_name,exam_date').order('exam_date'),
    ]);
    if (institutionError || examError) setMessage({ error: institutionError?.message || examError?.message || 'Unable to load tertiary education data.', success: '' });
    setInstitutions(institutionData || []);
    setExams(examData || []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const addInstitution = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('tertiary_institutions').insert(institution);
    if (error) setMessage({ error: error.message, success: '' });
    else { setInstitution({ name: '', description: '' }); setMessage({ error: '', success: 'Tertiary institution added.' }); void load(); }
  };
  const addExam = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('tertiary_exams').insert(exam);
    if (error) setMessage({ error: error.message, success: '' });
    else { setExam({ institution_id: '', exam_name: '', exam_date: '' }); setMessage({ error: '', success: 'Exam added.' }); void load(); }
  };
  const removeInstitution = async (id: string) => { const { error } = await supabase.from('tertiary_institutions').delete().eq('id', id); if (error) setMessage({ error: error.message, success: '' }); else void load(); };

  return <AdminGuard><DashboardLayout role="super-admin"><DashPageHeader title="Tertiary Education" subtitle="Manage institutions and their examinations" />
    <Message {...message} />
    <div className="grid gap-6 lg:grid-cols-2">
      <DashCard title="Add Tertiary Institution"><form onSubmit={addInstitution} className="space-y-4"><input required className="input" placeholder="Institution name" value={institution.name} onChange={(e) => setInstitution({ ...institution, name: e.target.value })} /><textarea required className="input" rows={4} placeholder="Description" value={institution.description} onChange={(e) => setInstitution({ ...institution, description: e.target.value })} /><button className="btn-primary"><Plus className="h-4 w-4" /> Add Institution</button></form></DashCard>
      <DashCard title="Add Exam / Test"><form onSubmit={addExam} className="space-y-4"><select required className="input" value={exam.institution_id} onChange={(e) => setExam({ ...exam, institution_id: e.target.value })}><option value="">Select institution</option>{institutions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input required className="input" placeholder="Exam name" value={exam.exam_name} onChange={(e) => setExam({ ...exam, exam_name: e.target.value })} /><input required type="date" className="input" value={exam.exam_date} onChange={(e) => setExam({ ...exam, exam_date: e.target.value })} /><button className="btn-primary"><Plus className="h-4 w-4" /> Add Exam</button></form></DashCard>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><DashCard title={`Institutions (${institutions.length})`}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <div className="space-y-2">{institutions.map((item) => <div key={item.id} className="flex items-start justify-between rounded-xl border border-ink-100 p-4"><div><p className="font-semibold text-ink-900">{item.name}</p><p className="mt-1 text-sm text-ink-500">{item.description}</p></div><button onClick={() => void removeInstitution(item.id)} className="text-error-600"><Trash2 className="h-4 w-4" /></button></div>)}</div>}</DashCard><DashCard title={`Exams (${exams.length})`}><div className="space-y-2">{exams.map((item) => <div key={item.id} className="rounded-xl border border-ink-100 p-4"><p className="font-semibold text-ink-900">{item.exam_name}</p><p className="text-sm text-ink-500">{institutions.find((x) => x.id === item.institution_id)?.name || 'Institution'} · {item.exam_date}</p></div>)}</div></DashCard></div>
  </DashboardLayout></AdminGuard>;
}

export function SuperAdminPrimarySecondaryPage() {
  const [schools, setSchools] = useState<{ id: string; name: string; type: string; website_link: string | null }[]>([]);
  const [form, setForm] = useState({ name: '', type: 'primary', website_link: '' });
  const [message, setMessage] = useState({ error: '', success: '' });
  const load = async () => { const { data, error } = await supabase.from('schools').select('id,name,type,website_link').order('name'); if (error) setMessage({ error: error.message, success: '' }); setSchools(data || []); };
  useEffect(() => { void load(); }, []);
  const add = async (event: FormEvent) => { event.preventDefault(); const { error } = await supabase.from('schools').insert(form); if (error) setMessage({ error: error.message, success: '' }); else { setForm({ name: '', type: 'primary', website_link: '' }); setMessage({ error: '', success: 'School added.' }); void load(); } };
  return <AdminGuard><DashboardLayout role="super-admin"><DashPageHeader title="Primary / Secondary Schools" subtitle="Manage schools and public website links" /><Message {...message} /><DashCard title="Add School"><form onSubmit={add} className="grid gap-4 md:grid-cols-3"><input required className="input" placeholder="School name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="primary">Primary</option><option value="secondary">Secondary</option></select><input type="url" className="input" placeholder="School website link" value={form.website_link} onChange={(e) => setForm({ ...form, website_link: e.target.value })} /><button className="btn-primary md:col-span-3 md:w-fit"><Plus className="h-4 w-4" /> Add School</button></form></DashCard><DashCard title={`Schools (${schools.length})`}><div className="mt-1 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-ink-200 text-xs uppercase text-ink-400"><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Website</th></tr></thead><tbody className="divide-y divide-ink-100">{schools.map((item) => <tr key={item.id}><td className="p-3 font-semibold text-ink-900">{item.name}</td><td className="p-3 capitalize text-ink-600">{item.type}</td><td className="p-3">{item.website_link ? <a className="text-primary-600 hover:underline" href={item.website_link} target="_blank" rel="noreferrer">Visit website</a> : '—'}</td></tr>)}</tbody></table></div></DashCard></DashboardLayout></AdminGuard>;
}

export function SuperAdminSubAdminPages() {
  const [rows, setRows] = useState<{ id: string; school_name: string; login_link: string; created_at: string }[]>([]);
  const [form, setForm] = useState({ school_name: '', login_link: '', password: '' });
  const [message, setMessage] = useState({ error: '', success: '' });
  const load = async () => { const { data, error } = await supabase.from('sub_admins').select('id,school_name,login_link,created_at').order('created_at', { ascending: false }); if (error) setMessage({ error: error.message, success: '' }); setRows(data || []); };
  useEffect(() => { void load(); }, []);
  const add = async (event: FormEvent) => { event.preventDefault(); const { error } = await supabase.rpc('create_sub_admin', { p_school_name: form.school_name, p_login_link: form.login_link, p_password: form.password }); if (error) setMessage({ error: error.message, success: '' }); else { setForm({ school_name: '', login_link: '', password: '' }); setMessage({ error: '', success: 'Sub-admin login page saved.' }); void load(); } };
  return <AdminGuard><DashboardLayout role="super-admin"><DashPageHeader title="Sub Admin Login Pages" subtitle="Create and review school administrator access pages" /><Message {...message} /><DashCard title="Add Sub-Admin Login Page"><form onSubmit={add} className="grid gap-4 md:grid-cols-3"><input required className="input" placeholder="School name" value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} /><input required type="url" className="input" placeholder="Admin page link" value={form.login_link} onChange={(e) => setForm({ ...form, login_link: e.target.value })} /><input required minLength={8} type="password" className="input" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button className="btn-primary md:col-span-3 md:w-fit"><Save className="h-4 w-4" /> Save Login Page</button></form></DashCard><DashCard title="Saved Sub-Admins"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-ink-200 text-xs uppercase text-ink-400"><th className="p-3">School Name</th><th className="p-3">Admin Page Link</th><th className="p-3">Created</th></tr></thead><tbody className="divide-y divide-ink-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-semibold text-ink-900">{row.school_name}</td><td className="p-3"><a className="text-primary-600 hover:underline" href={row.login_link} target="_blank" rel="noreferrer">Open page</a></td><td className="p-3 text-ink-500">{new Date(row.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></DashCard></DashboardLayout></AdminGuard>;
}

export function SuperAdminManageCoursesPage() {
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [form, setForm] = useState({ code: '', name: '', school_name: '', school_id: '', class_level: '', subject_name: '', term_id: '', exam_type_id: '', scheme_of_work: '', notes_pdf_url: '', link_url: '' });
  const [terms, setTerms] = useState<{ id: string; name: string }[]>([]);
  const [examTypes, setExamTypes] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string; type: string }[]>([]);
  const [message, setMessage] = useState({ error: '', success: '' });
  const load = async () => { const [{ data, error }, { data: termData }, { data: typeData }, { data: schoolData }] = await Promise.all([supabase.from('courses').select('id,code,name,school_name,school_id,class_level,subject_name,term_id,exam_type_id,scheme_of_work,notes_pdf_url,link_url,is_published,backup_file_url,created_at').order('created_at', { ascending: false }), supabase.from('terms').select('id,name').eq('is_active', true).order('name'), supabase.from('exam_types').select('id,name').eq('is_active', true).order('name'), supabase.from('schools').select('id,name,type').order('name')]); if (error) setMessage({ error: error.message, success: '' }); setCourses((data || []) as Record<string, unknown>[]); setTerms(termData || []); setExamTypes(typeData || []); setSchools(schoolData || []); };
  useEffect(() => { void load(); }, []);
  const add = async (event: FormEvent) => {
    event.preventDefault();
    let notesPdfUrl = form.notes_pdf_url;
    if (notesFile) {
      if (notesFile.type !== 'application/pdf') { setMessage({ error: 'Notes must be a PDF file.', success: '' }); return; }
      if (notesFile.size > 10 * 1024 * 1024) { setMessage({ error: 'Notes PDF must be smaller than 10 MB.', success: '' }); return; }
      const path = `course-notes/${crypto.randomUUID()}-${notesFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const upload = await supabase.storage.from('ilearnace-assets').upload(path, notesFile, { upsert: false, contentType: notesFile.type });
      if (upload.error) { setMessage({ error: upload.error.message, success: '' }); return; }
      notesPdfUrl = supabase.storage.from('ilearnace-assets').getPublicUrl(upload.data.path).data.publicUrl;
    }
    const { error } = await supabase.from('courses').insert({ ...form, school_id: form.school_id || null, term_id: form.term_id || null, exam_type_id: form.exam_type_id || null, notes_pdf_url: notesPdfUrl || null, is_published: false });
    if (error) setMessage({ error: error.message, success: '' });
    else { setForm({ code: '', name: '', school_name: '', school_id: '', class_level: '', subject_name: '', term_id: '', exam_type_id: '', scheme_of_work: '', notes_pdf_url: '', link_url: '' }); setNotesFile(null); setMessage({ error: '', success: 'Course saved as draft.' }); void load(); }
  };
  const publish = async (id: string, value: boolean) => { const { error } = await supabase.from('courses').update({ is_published: value }).eq('id', id); if (error) setMessage({ error: error.message, success: '' }); else void load(); };
  const backup = async (course: Record<string, unknown>) => { const json = JSON.stringify(course, null, 2); const url = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`; const { error } = await supabase.from('backups').insert({ course_id: course.id, backup_file_url: url }); if (error) setMessage({ error: error.message, success: '' }); else { setMessage({ error: '', success: 'Course backup saved.' }); void load(); } };
  return <AdminGuard><DashboardLayout role="super-admin"><DashPageHeader title="Manage Courses" subtitle="Create, publish, and back up school subjects and courses" /><Message {...message} /><DashCard title="Create Course"><form onSubmit={add} className="space-y-4"><div className="grid gap-4 md:grid-cols-3"><input required className="input" placeholder="Course code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /><input required className="input" placeholder="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required className="input" placeholder="Subject name" value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} /><select required className="input" value={form.school_id} onChange={(e) => { const school = schools.find((item) => item.id === e.target.value); setForm({ ...form, school_id: e.target.value, school_name: school?.name || '' }); }}><option value="">Select school</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name} ({school.type})</option>)}</select><input required className="input" placeholder="Class / Level" value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })} /><select className="input" value={form.term_id} onChange={(e) => setForm({ ...form, term_id: e.target.value })}><option value="">Select term</option>{terms.map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}</select><select className="input" value={form.exam_type_id} onChange={(e) => setForm({ ...form, exam_type_id: e.target.value })}><option value="">Select exam type</option>{examTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div><textarea required className="input" rows={5} placeholder="Scheme of work" value={form.scheme_of_work} onChange={(e) => setForm({ ...form, scheme_of_work: e.target.value })} /><div className="grid gap-4 md:grid-cols-2"><div><input type="file" accept="application/pdf" onChange={(e) => setNotesFile(e.target.files?.[0] || null)} className="input" /><input type="url" className="input mt-2" placeholder="Or use an existing Notes PDF URL" value={form.notes_pdf_url} onChange={(e) => setForm({ ...form, notes_pdf_url: e.target.value })} /></div><input type="url" className="input" placeholder="External link URL" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></div><button className="btn-primary"><Plus className="h-4 w-4" /> Save Draft</button></form></DashCard><DashCard title={`Courses (${courses.length})`}><div className="space-y-3">{courses.map((course) => <div key={String(course.id)} className="rounded-xl border border-ink-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-ink-900">{String(course.subject_name)}</p><p className="text-sm text-ink-500">{String(course.school_name)} · {String(course.class_level)}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => void publish(String(course.id), !course.is_published)} className={course.is_published ? 'btn-outline text-xs' : 'btn-primary text-xs'}>{course.is_published ? 'Unpublish' : 'Publish'}</button><button onClick={() => void backup(course)} className="btn-outline text-xs"><HardDriveIcon /> Backup</button></div></div><p className="mt-3 whitespace-pre-wrap text-sm text-ink-600">{String(course.scheme_of_work)}</p></div>)}</div></DashCard></DashboardLayout></AdminGuard>;
}

function HardDriveIcon() { return <Download className="h-4 w-4" />; }

export function SuperAdminBackupsPage() {
  const [backups, setBackups] = useState<{ id: string; course_id: string; backup_file_url: string; created_at: string }[]>([]);
  useEffect(() => { supabase.from('backups').select('*').order('created_at', { ascending: false }).then(({ data }) => setBackups(data || [])); }, []);
  return <AdminGuard><DashboardLayout role="super-admin"><DashPageHeader title="Backups" subtitle="Download generated course backup files" /><DashCard title={`Saved Backups (${backups.length})`}><div className="space-y-2">{backups.map((backup) => <div key={backup.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4"><div><p className="font-semibold text-ink-900">Course backup</p><p className="text-xs text-ink-500">{new Date(backup.created_at).toLocaleString()}</p></div><a className="btn-outline text-xs" href={backup.backup_file_url} download={`course-backup-${backup.course_id}.json`}><Download className="h-4 w-4" /> Download</a></div>)}</div></DashCard></DashboardLayout></AdminGuard>;
}

export function PublicCoursesPage() {
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState({ error: '', success: '' });
  useEffect(() => { supabase.from('courses').select('id,school_name,class_level,subject_name,scheme_of_work,notes_pdf_url,link_url').eq('is_published', true).order('created_at', { ascending: false }).then(({ data, error }) => { if (error) setMessage({ error: error.message, success: '' }); setCourses((data || []) as Record<string, unknown>[]); }); }, []);
  const enroll = async (id: unknown) => { const { data: userData } = await supabase.auth.getUser(); if (!userData.user) { setMessage({ error: 'Please sign in before selecting a course.', success: '' }); return; } const { error } = await supabase.from('user_courses').insert({ user_id: userData.user.id, course_id: id }); if (error && error.code !== '23505') setMessage({ error: error.message, success: '' }); else setMessage({ error: '', success: 'Course selected and added to your dashboard.' }); };
  return <><PageHeader eyebrow="Academics" title="Courses & Programmes" subtitle="Browse published learning resources from I-LearnAce." /><Section><Message {...message} /><div className="grid gap-6 lg:grid-cols-3">{courses.map((course) => <article key={String(course.id)} className="card-hover p-6"><p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{String(course.school_name)} · {String(course.class_level)}</p><h2 className="mt-2 text-xl font-bold text-ink-900">{String(course.subject_name)}</h2><p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-500">{String(course.scheme_of_work)}</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setSelected(course)} className="btn-outline text-xs">View Details</button><button onClick={() => void enroll(course.id)} className="btn-primary text-xs">Enroll / Select</button></div></article>)}</div>{selected && <div className="mt-8 rounded-2xl border border-ink-200 bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase text-primary-600">{String(selected.class_level)}</p><h2 className="mt-1 text-2xl font-bold text-ink-900">{String(selected.subject_name)}</h2></div><button onClick={() => setSelected(null)} className="text-ink-400">Close</button></div><p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{String(selected.scheme_of_work)}</p><div className="mt-5 flex flex-wrap gap-3">{Boolean(selected.notes_pdf_url) && <a className="btn-outline text-xs" href={String(selected.notes_pdf_url)} target="_blank" rel="noreferrer">Open Notes PDF</a>}{Boolean(selected.link_url) && <a className="btn-outline text-xs" href={String(selected.link_url)} target="_blank" rel="noreferrer">Open External Link</a>}</div></div>}</Section></>;
}
