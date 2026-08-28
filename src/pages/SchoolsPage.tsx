import { useEffect, useState } from 'react';
import { Search, MapPin, Users, School, ArrowRight, BookOpen, ClipboardCheck, CalendarDays, FileText } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';
import { Link } from '@/lib/router';
import { schools, heroImages } from '@/lib/content';
import { supabase } from '@/lib/supabase';

const levelGroups = [
  { name: 'Primary', levels: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5'] },
  { name: 'JSS', levels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { name: 'SSS', levels: ['SSS 1', 'SSS 2', 'SSS 3'] },
];

const classFeatures = [
  { icon: BookOpen, label: 'Subjects' },
  { icon: Users, label: 'Teachers' },
  { icon: ClipboardCheck, label: 'Exams' },
  { icon: FileText, label: 'Report Cards' },
  { icon: CalendarDays, label: 'Schedule' },
  { icon: ArrowRight, label: 'Results' },
];

export function SchoolsPage() {
  const [query, setQuery] = useState('');
  const [managedSchools, setManagedSchools] = useState<{ id: string; name: string; type: string; website_link: string | null }[]>([]);
  useEffect(() => { supabase.from('schools').select('id,name,type,website_link').order('name').then(({ data }) => setManagedSchools(data || [])); }, []);
  const allSchools = [...schools.map((school) => ({ ...school, website_link: null })), ...managedSchools.map((school) => ({ name: school.name, short: school.name.slice(0, 2).toUpperCase(), location: school.type === 'primary' ? 'Primary' : 'Secondary', levels: school.type, students: '—', logo: school.name.slice(0, 2).toUpperCase(), website_link: school.website_link }))];
  const filtered = allSchools.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Partner Schools"
        title="Primary & secondary schools on I-LearnAce"
        subtitle="From Primary 1 to SSS 3 — I-LearnAce supports every class level with subjects, teachers, schedules, exams, report cards, and attendance."
      />

      {/* Search */}
      <Section className="pb-0">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by school name or city..."
            className="input pl-12"
          />
        </div>
      </Section>

      {/* Grid */}
      <Section>
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-500">No schools match "{query}". Try a different search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((school, i) => (
              <div
                key={school.short}
                className={`card-hover group flex flex-col p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 text-lg font-extrabold text-white shadow-lg shadow-accent-500/20">
                    {school.logo}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-ink-900">{school.name}</h3>
                    <p className="flex items-center gap-1 text-sm text-ink-500">
                      <MapPin className="h-3.5 w-3.5" /> {school.location}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-t border-ink-100 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Levels</span>
                    <span className="font-semibold text-ink-800">{school.levels}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Students</span>
                    <span className="font-semibold text-ink-800">{school.students}</span>
                  </div>
                </div>

                {school.website_link ? <a href={school.website_link} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700 transition-colors hover:bg-accent-100">Visit school website <ArrowRight className="h-4 w-4" /></a> : <Link to="/courses" className="mt-5 flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700 transition-colors hover:bg-accent-100">
                  View subjects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Class structure */}
      <Section className="bg-white">
        <SectionHeading
          center
          eyebrow="Class Structure"
          title="Every level, fully supported"
          subtitle="I-LearnAce organizes primary and secondary education into three groups — Primary, JSS, and SSS — each with its own classes, subjects, and report cards."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {levelGroups.map((group, i) => (
            <div key={group.name} className={`card-hover p-6 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <School className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-ink-900">{group.name}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.levels.map((level) => (
                  <span key={level} className="badge-ink">{level}</span>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-ink-100 pt-4">
                {classFeatures.map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-1 text-center">
                    <f.icon className="h-4 w-4 text-ink-400" />
                    <span className="text-2xs font-medium text-ink-500">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Split image */}
      <Section className="bg-ink-50">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="School Portal"
              title="A portal designed for schools"
              subtitle="School admins manage classes, teachers, subjects, and students. Teachers handle attendance and exams. Everything is tracked in real time."
            />
            <ul className="mt-6 space-y-3">
              {[
                'Class schedules and attendance tracking',
                'Subject and teacher allocation per class',
                'Online exams with question banks and automatic marking',
                'Report cards generated and downloadable',
                'Student portal with attendance and performance tracking',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-ink-200 shadow-xl">
            <img src={heroImages.schoolStudents} alt="Secondary school students in class" className="h-[400px] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </Section>
    </>
  );
}
