import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Check, X, Loader2, AlertCircle,
  Globe2, GraduationCap, School, Users, Lock, HardDriveDownload,
  ClipboardCheck, Megaphone, Settings, ShieldCheck, Download,
  Building2, MapPin, Mail, Phone, FileText, Palette, Moon, Sun,
  UserPlus, Database, BookOpen,
} from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader, StatCard, StatusBadge } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { useSiteSettings } from '@/lib/site-settings';

type Institution = { id: string; name: string; type: string; location: string; contact_email: string; contact_phone: string; description: string; is_active: boolean };

// ── Admin auth guard hook ──
function useAdminAuth() {
  const { navigate } = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (!active) return;
      if (!['admin', 'super-admin'].includes(profile?.role || '')) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }
      setAuthed(true);
      setChecking(false);
    };
    void check();
    return () => { active = false; };
  }, [navigate]);

  return { authed, checking };
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { authed, checking } = useAdminAuth();
  if (checking) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;
  if (!authed) return null;
  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// 1. PLATFORM MANAGEMENT
// ═══════════════════════════════════════════════════════════════
export function SuperAdminPlatformPage() {
  const [content, setContent] = useState({
    siteName: 'I-LearnAce',
    tagline: 'Learning Platform',
    heroTitle: 'Empowering education through technology',
    heroSubtitle: 'A unified education technology platform for universities, tertiary institutions, primary and secondary schools, students, and educators.',
    primaryColor: '#2563eb',
    accentColor: '#f59e0b',
    contactEmail: 'hello@i-learnace.com',
    contactPhone: '+234 800 000 0000',
    contactAddress: 'Lagos, Nigeria',
    logoUrl: '',
    footerText: 'A unified education technology platform for modern learning.',
    aboutText: '',
    examText: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { settings, saveSettings } = useSiteSettings();

  useEffect(() => {
    setContent((current) => ({
      ...current,
      logoUrl: settings.logo_url,
      primaryColor: settings.primary_color,
      footerText: settings.footer_text,
      aboutText: settings.about_text,
      examText: settings.exam_text,
      heroTitle: settings.homepage_images.heroTitle || current.heroTitle,
      heroSubtitle: settings.homepage_images.heroSubtitle || current.heroSubtitle,
    }));
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    let logoUrl = content.logoUrl;
    if (logoFile) {
      if (!logoFile.type.startsWith('image/')) { setError('Logo must be an image file.'); setSaving(false); return; }
      if (logoFile.size > 2 * 1024 * 1024) { setError('Logo must be smaller than 2 MB.'); setSaving(false); return; }
      const path = `logos/${crypto.randomUUID()}-${logoFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const upload = await supabase.storage.from('ilearnace-assets').upload(path, logoFile, { upsert: false, contentType: logoFile.type });
      if (upload.error) { setError(upload.error.message); setSaving(false); return; }
      logoUrl = supabase.storage.from('ilearnace-assets').getPublicUrl(upload.data.path).data.publicUrl;
    }
    const result = await saveSettings({
      logo_url: logoUrl,
      primary_color: content.primaryColor,
      footer_text: content.footerText,
      homepage_images: { heroTitle: content.heroTitle, heroSubtitle: content.heroSubtitle, images: [] },
      about_text: content.aboutText,
      exam_text: content.examText,
    });
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    setLogoFile(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Platform Management" subtitle="Edit website text, colors, and contact info" />
        <div className="mx-auto max-w-2xl">
          <DashCard title="Site Content">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Logo Image</label>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="input" />
                <input type="url" value={content.logoUrl} onChange={(e) => setContent({ ...content, logoUrl: e.target.value })} placeholder="Or use an existing image URL" className="input mt-2" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Site Name</label>
                  <input type="text" value={content.siteName} onChange={(e) => setContent({ ...content, siteName: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Tagline</label>
                  <input type="text" value={content.tagline} onChange={(e) => setContent({ ...content, tagline: e.target.value })} className="input" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Hero Title</label>
                <input type="text" value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Hero Subtitle</label>
                <textarea value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} rows={3} className="input" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={content.primaryColor} onChange={(e) => setContent({ ...content, primaryColor: e.target.value })} className="h-10 w-16 rounded-lg border border-ink-200" />
                    <input type="text" value={content.primaryColor} onChange={(e) => setContent({ ...content, primaryColor: e.target.value })} className="input" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={content.accentColor} onChange={(e) => setContent({ ...content, accentColor: e.target.value })} className="h-10 w-16 rounded-lg border border-ink-200" />
                    <input type="text" value={content.accentColor} onChange={(e) => setContent({ ...content, accentColor: e.target.value })} className="input" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Footer Text</label>
                <textarea value={content.footerText} onChange={(e) => setContent({ ...content, footerText: e.target.value })} rows={2} className="input" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">About I-LearnAce Text</label>
                  <textarea value={content.aboutText} onChange={(e) => setContent({ ...content, aboutText: e.target.value })} rows={3} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Examination Page Text</label>
                  <textarea value={content.examText} onChange={(e) => setContent({ ...content, examText: e.target.value })} rows={3} className="input" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Contact Email</label>
                  <input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Contact Phone</label>
                  <input type="tel" value={content.contactPhone} onChange={(e) => setContent({ ...content, contactPhone: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Address</label>
                  <input type="text" value={content.contactAddress} onChange={(e) => setContent({ ...content, contactAddress: e.target.value })} className="input" />
                </div>
              </div>
              {saved && <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" /> Settings saved!</div>}
              {error && <div className="flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" /> {error}</div>}
              <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <>Save Changes</>}</button>
            </form>
          </DashCard>
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. TERTIARY EDUCATION PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminUniversitiesPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', contact_email: '', contact_phone: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    supabase.from('institutions').select('*').eq('type', 'tertiary').order('name').then(({ data }) => {
      if (data) setInstitutions(data as Institution[]);
      setLoading(false);
    });
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('institutions').insert({ ...form, type: 'tertiary' });
    setForm({ name: '', location: '', contact_email: '', contact_phone: '', description: '' });
    setShowForm(false);
    setSaving(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('institutions').delete().eq('id', id);
    fetch();
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Tertiary Education" subtitle="Manage all registered tertiary institutions">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="h-4 w-4" /> Add Tertiary Education</button>
        </DashPageHeader>
        {showForm && (
          <DashCard title="Add New Tertiary Education" className="mb-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="Tertiary Education name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" />
                <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
                <input type="email" placeholder="Contact email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="input" />
                <input type="tel" placeholder="Contact phone" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="input" />
              </div>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input" />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Tertiary Education'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </DashCard>
        )}
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : (
          <DashCard title={`All Tertiary Institutions (${institutions.length})`}>
            <div className="space-y-2">
              {institutions.map((inst) => (
                <div key={inst.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><GraduationCap className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{inst.name}</p>
                      <p className="text-xs text-ink-400">{inst.location} · {inst.contact_email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(inst.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-error-50 hover:text-error-600"><Trash2 className="h-4 w-4" /></button>
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
// 3. SCHOOLS PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<{ id: string; name: string; type: string; website_link: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'secondary', website_link: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    supabase.from('schools').select('id,name,type,website_link').order('name').then(({ data }) => {
      if (data) setSchools(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('schools').insert({ name: form.name.trim(), type: form.type, website_link: form.website_link.trim() || null });
    setForm({ name: '', type: 'secondary', website_link: '' });
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('schools').delete().eq('id', id);
    fetchData();
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Primary & Secondary Schools" subtitle="Manage all registered schools">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="h-4 w-4" /> Add School</button>
        </DashPageHeader>
        {showForm && (
          <DashCard title="Add New School" className="mb-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="School name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input"><option value="primary">Primary</option><option value="secondary">Secondary</option></select>
                <input type="url" placeholder="School website (optional)" value={form.website_link} onChange={(e) => setForm({ ...form, website_link: e.target.value })} className="input" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add School'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </DashCard>
        )}
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : (
          <DashCard title={`All Schools (${schools.length})`}>
            <div className="space-y-2">
              {schools.map((school) => (
                <div key={school.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><School className="h-5 w-5" /></span><div><p className="text-sm font-bold text-ink-900">{school.name}</p><p className="text-xs capitalize text-ink-400">{school.type} school{school.website_link ? ` · ${school.website_link}` : ''}</p></div></div>
                  <button onClick={() => handleDelete(school.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-error-50 hover:text-error-600"><Trash2 className="h-4 w-4" /></button>
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
// 4. PERMISSIONS PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminPermissionsPage() {
  const roles = [
    { name: 'Super Admin', description: 'Full platform access', users: 1, permissions: ['All permissions'] },
    { name: 'Tertiary Education Admin', description: 'Manage a university', users: 6, permissions: ['Manage courses', 'View students', 'Manage exams', 'Publish results'] },
    { name: 'School Admin', description: 'Manage a school', users: 48, permissions: ['Manage subjects', 'View students', 'Manage exams', 'Publish results'] },
    { name: 'Teacher', description: 'Teach classes', users: 120, permissions: ['Take attendance', 'Enter scores', 'Create question bank'] },
    { name: 'Lecturer', description: 'Teach courses', users: 420, permissions: ['Upload materials', 'Create exams', 'Mark exams'] },
    { name: 'Student', description: 'Take exams', users: 36000, permissions: ['Register courses', 'Take exams', 'View results', 'Make payments'] },
    
  ];

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Permissions" subtitle="Manage user roles and access levels" />
        <div className="space-y-4">
          {roles.map((r) => (
            <DashCard key={r.name}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Lock className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{r.name}</p>
                    <p className="text-xs text-ink-400">{r.description} · {r.users} users</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.permissions.map((p) => (
                  <span key={p} className="badge badge-primary">{p}</span>
                ))}
              </div>
            </DashCard>
          ))}
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. CREATE SCHOOL PORTAL
// ═══════════════════════════════════════════════════════════════
export function SuperAdminCreatePortalPage() {
  const [form, setForm] = useState({ schoolName: '', portalName: '', adminEmail: '', level: 'primary', term: 'First Term' });
  const [created, setCreated] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const [{ error: institutionError }, { error: schoolError }] = await Promise.all([
      supabase.from('institutions').insert({ name: form.schoolName, type: 'school', description: `Portal: ${form.portalName}` }),
      supabase.from('schools').insert({ name: form.schoolName, type: form.level === 'primary' ? 'primary' : 'secondary' }),
    ]);
    if (institutionError || schoolError) { setSaving(false); return; }
    setSaving(false);
    setCreated(true);
    setTimeout(() => setCreated(false), 3000);
    setForm({ schoolName: '', portalName: '', adminEmail: '', level: 'primary', term: 'First Term' });
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Create School Portal" subtitle="Create a custom portal for a specific school" />
        <div className="mx-auto max-w-lg">
          <DashCard title="New School Portal">
            {created && <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" /> Portal created successfully!</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">School Name</label>
                <input type="text" value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} required className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Portal Name</label>
                <input type="text" value={form.portalName} onChange={(e) => setForm({ ...form, portalName: e.target.value })} required className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Admin Email</label>
                <input type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="both">Primary & Secondary</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Current Term</label>
                  <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} className="input">
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : <>Create Portal <Building2 className="h-4 w-4" /></>}</button>
            </form>
          </DashCard>
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. BACKUP PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminBackupPage() {
  const [backing, setBacking] = useState(false);
  const [backups, setBackups] = useState([
    { name: 'Full database backup', date: 'Aug 14, 2026 3:00 AM', size: '24.5 MB', type: 'auto' },
    { name: 'Schools data backup', date: 'Aug 13, 2026 3:00 AM', size: '8.2 MB', type: 'auto' },
    { name: 'Manual backup', date: 'Aug 12, 2026 2:15 PM', size: '24.3 MB', type: 'manual' },
  ]);

  const handleBackup = async () => {
    setBacking(true);
    // Simulate backup
    await new Promise((r) => setTimeout(r, 1500));
    setBackups([
      { name: 'Manual backup', date: new Date().toLocaleString(), size: '24.6 MB', type: 'manual' },
      ...backups,
    ]);
    setBacking(false);
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Backup" subtitle="Backup school databases, classes, schemes, and notes">
          <button onClick={handleBackup} disabled={backing} className="btn-primary">{backing ? <><Loader2 className="h-4 w-4 animate-spin" /> Backing up...</> : <><HardDriveDownload className="h-4 w-4" /> Create Backup</>}</button>
        </DashPageHeader>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashCard title="Backup History">
              <div className="space-y-2">
                {backups.map((b, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Database className="h-4 w-4" /></span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{b.name}</p>
                        <p className="text-xs text-ink-400">{b.date} · {b.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${b.type === 'auto' ? 'badge-primary' : 'badge-accent'}`}>{b.type}</span>
                      <button className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </DashCard>
          </div>
          <div className="space-y-6">
            <DashCard title="Backup Settings">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-xs text-ink-500">Auto backup</span><span className="text-sm font-bold text-success-600">Enabled</span></div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-xs text-ink-500">Frequency</span><span className="text-sm font-bold text-ink-900">Daily 3 AM</span></div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-xs text-ink-500">Retention</span><span className="text-sm font-bold text-ink-900">30 days</span></div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 p-3"><span className="text-xs text-ink-500">Storage used</span><span className="text-sm font-bold text-ink-900">1.2 GB</span></div>
              </div>
            </DashCard>
          </div>
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. ALL USERS PAGE
// ═══════════════════════════════════════════════════════════════
export function SuperAdminUsersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const users = [
    { id: 'usr-001', name: 'Grace Eze', email: 'grace@unn.edu.ng', role: 'Tertiary Education Student', institution: 'Tertiary Education of Nigeria, Nsukka', status: 'Active' },
    { id: 'usr-002', name: 'Emeka Adeyemi', email: 'emeka@baptisthigh.edu.ng', role: 'School Student', institution: 'Baptist High School', status: 'Active' },
    { id: 'usr-003', name: 'Dr. Okonkwo', email: 'okonkwo@unilag.edu.ng', role: 'Lecturer', institution: 'Tertiary Education of Lagos', status: 'Active' },
    { id: 'usr-004', name: 'Mrs. Adeyemi', email: 'adeyemi@gmail.com', role: 'Teacher', institution: 'King\'s College', status: 'Active' },
    { id: 'usr-005', name: 'Chioma Nwosu', email: 'chioma@queenscollege.edu.ng', role: 'Teacher', institution: "Queen's College", status: 'Active' },
    { id: 'usr-006', name: 'John Doe', email: 'john@kingscollege.edu.ng', role: 'School Student', institution: "King's College", status: 'Inactive' },
    { id: 'usr-007', name: 'Aisha Bello', email: 'aisha@unilag.edu.ng', role: 'Tertiary Education Student', institution: 'Tertiary Education of Lagos', status: 'Active' },
    { id: 'usr-008', name: 'Samuel Okafor', email: 'samuel@lagosanglican.edu.ng', role: 'School Student', institution: 'Lagos Anglican School', status: 'Active' },
  ];

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || u.role.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="All Users" subtitle="View and manage all registered users" />
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input pl-11" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-xs">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="lecturer">Lecturers</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <DashCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Institution</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/50">
                    <td className="py-3 pr-4 font-semibold text-ink-900">{u.name}</td>
                    <td className="py-3 pr-4 text-ink-600">{u.email}</td>
                    <td className="py-3 pr-4 text-ink-600">{u.role}</td>
                    <td className="py-3 pr-4 text-ink-600">{u.institution}</td>
                    <td className="py-3 pr-4"><StatusBadge status={u.status} /></td>
                    <td className="py-3"><button className="text-xs font-semibold text-primary-600 hover:text-primary-700">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashCard>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. EXAM/TEST SETTINGS
// ═══════════════════════════════════════════════════════════════
export function SuperAdminExamSettingsPage() {
  const [settings, setSettings] = useState([
    { id: 1, subject: 'Mathematics', type: 'school', duration: 60, questions: 20, passingScore: 50, active: true },
    { id: 2, subject: 'English Language', type: 'school', duration: 45, questions: 15, passingScore: 50, active: true },
    { id: 3, subject: 'CSC 301 — Data Structures', type: 'tertiary', duration: 120, questions: 40, passingScore: 40, active: true },
    { id: 4, subject: 'CSC 305 — Database Systems', type: 'tertiary', duration: 90, questions: 30, passingScore: 40, active: true },
  ]);

  const toggleActive = (id: number) => {
    setSettings(settings.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Exam / Test Settings" subtitle="Configure tests and exams per subject or course" />
        <DashCard title="Exam Configurations">
          <div className="space-y-2">
            {settings.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.type === 'school' ? 'bg-accent-50 text-accent-600' : 'bg-primary-50 text-primary-600'}`}>
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{s.subject}</p>
                    <p className="text-xs text-ink-400">{s.duration} min · {s.questions} questions · Pass: {s.passingScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${s.type === 'school' ? 'badge-accent' : 'badge-primary'}`}>{s.type}</span>
                  <button onClick={() => toggleActive(s.id)} className={`relative h-6 w-11 rounded-full transition-colors ${s.active ? 'bg-success-500' : 'bg-ink-200'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${s.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9. NEWS MANAGEMENT
// ═══════════════════════════════════════════════════════════════
export function SuperAdminNewsPage() {
  const [news, setNews] = useState([
    { id: 1, title: 'I-LearnAce launches new CBT testing platform', status: 'Published', date: 'Aug 10, 2026' },
    { id: 2, title: 'New tertiary institutions join the I-LearnAce network', status: 'Published', date: 'Aug 5, 2026' },
    { id: 3, title: 'Student portal now available', status: 'Draft', date: 'Aug 12, 2026' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setNews([{ id: Date.now(), title: form.title, status: 'Draft', date: new Date().toLocaleDateString() }, ...news]);
    setForm({ title: '', content: '' });
    setShowForm(false);
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="News Management" subtitle="Create, edit, and delete news and announcements">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="h-4 w-4" /> Add News</button>
        </DashPageHeader>
        {showForm && (
          <DashCard title="Create News Article" className="mb-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="News title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input" />
              <textarea placeholder="News content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="input" />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Publish</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </DashCard>
        )}
        <DashCard title={`All News (${news.length})`}>
          <div className="space-y-2">
            {news.map((n) => (
              <div key={n.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Megaphone className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                    <p className="text-xs text-ink-400">{n.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={n.status} />
                  <button className="rounded-lg p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => setNews(news.filter((x) => x.id !== n.id))} className="rounded-lg p-1.5 text-ink-400 hover:bg-error-50 hover:text-error-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </DashboardLayout>
    </AdminGuard>
  );
}

// ═══════════════════════════════════════════════════════════════
// 10. SETTINGS PAGE (dark/light mode + add super admin)
// ═══════════════════════════════════════════════════════════════
export function SuperAdminSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', fullName: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Use RPC to create admin user with hashed password
    await supabase.rpc('create_admin_user', {
      p_email: adminForm.email,
      p_password: adminForm.password,
      p_full_name: adminForm.fullName,
    });
    setSaving(false);
    setSuccess(true);
    setShowAddAdmin(false);
    setAdminForm({ email: '', password: '', fullName: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/';
  };

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Settings" subtitle="Manage platform settings and admin users" />
        <div className="mx-auto max-w-lg space-y-6">
          {success && <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" /> Admin user created successfully!</div>}

          <DashCard title="Appearance">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100 text-ink-600">{darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">Dark Mode</p>
                  <p className="text-xs text-ink-400">Toggle dark/light theme</p>
                </div>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-ink-200'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </DashCard>

          <DashCard title="Super Admin Users">
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-white"><ShieldCheck className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">dev.evo@gmail.com</p>
                    <p className="text-xs text-ink-400">Super Admin · Active</p>
                  </div>
                </div>
                <StatusBadge status="Active" />
              </div>
            </div>
            {showAddAdmin ? (
              <form onSubmit={handleAddAdmin} className="space-y-4 rounded-xl bg-ink-50 p-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Full Name</label>
                  <input type="text" value={adminForm.fullName} onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })} required className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
                  <input type="email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">Password</label>
                  <input type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required minLength={6} className="input" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Admin'}</button>
                  <button type="button" onClick={() => setShowAddAdmin(false)} className="btn-outline">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowAddAdmin(true)} className="btn-outline w-full"><UserPlus className="h-4 w-4" /> Add New Super Admin</button>
            )}
          </DashCard>

          <DashCard title="Account">
            <button onClick={handleSignOut} className="btn-outline w-full text-error-600 hover:bg-error-50">Sign Out of Admin Panel</button>
          </DashCard>
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}
