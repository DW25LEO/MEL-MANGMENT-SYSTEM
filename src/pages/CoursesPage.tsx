import { useState } from 'react';
import { BookOpen, Clock, ArrowRight, GraduationCap, School, Search } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';
import { Link } from '@/lib/router';
import { programmes } from '@/lib/content';

const categories = ['All', 'Sciences', 'Medical', 'Law', 'Management', 'Engineering', 'Arts', 'Education'];

export function CoursesPage() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = programmes.filter((p) => {
    const matchCat = active === 'All' || p.category === active;
    const matchQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Courses & programmes across the network"
        subtitle="From undergraduate degrees to primary and secondary class levels — explore the full range of academic programmes available on I-LearnAce."
      />

      <Section className="pb-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-primary-300 hover:text-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programmes..."
              className="input pl-12"
            />
          </div>
        </div>
      </Section>

      <Section>
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-500">No programmes found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div
                key={p.name}
                className={`card-hover group flex flex-col p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    p.level === 'Primary' || p.level === 'JSS' || p.level === 'SSS'
                      ? 'bg-accent-50 text-accent-600'
                      : 'bg-primary-50 text-primary-600'
                  }`}>
                    {p.level === 'Primary' || p.level === 'JSS' || p.level === 'SSS'
                      ? <School className="h-5 w-5" />
                      : <GraduationCap className="h-5 w-5" />}
                  </span>
                  <span className="badge-ink">{p.category}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{p.description}</p>
                <div className="mt-4 flex items-center gap-4 border-t border-ink-100 pt-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> {p.level}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {p.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Course registration info */}
      <Section className="bg-white">
        <div className="rounded-3xl border border-ink-200 bg-ink-50 p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="How Registration Works"
                title="Course registration, simplified"
                subtitle="Students register for courses or subjects each semester. Lecturers and teachers approve registrations, and everything is tracked in the student portal."
              />
              <ul className="mt-6 space-y-3">
                {[
                  'Browse available courses for your level or programme',
                  'Register with a single click, subject to prerequisites',
                  'Lecturers and teachers approve registrations',
                  'View all registered courses in your dashboard',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                    <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Sample Registration</p>
              <div className="mt-4 space-y-3">
                {[
                  { code: 'CSC 301', name: 'Data Structures & Algorithms', status: 'Approved', statusClass: 'badge-success' },
                  { code: 'CSC 305', name: 'Database Systems', status: 'Approved', statusClass: 'badge-success' },
                  { code: 'MTH 201', name: 'Linear Algebra', status: 'Pending', statusClass: 'badge-accent' },
                  { code: 'GST 101', name: 'Communication Skills', status: 'Approved', statusClass: 'badge-success' },
                ].map((course) => (
                  <div key={course.code} className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-ink-900">{course.code}</p>
                      <p className="text-xs text-ink-500">{course.name}</p>
                    </div>
                    <span className={course.statusClass}>{course.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
