import { useEffect, useState } from 'react';
import { Building2, GraduationCap, BookOpen, Users, CalendarDays, Award, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { Section, SectionHeading } from '@/components/Page';
import { supabase } from '@/lib/supabase';

export function TertiaryLearningPage() {
  const [institutions, setInstitutions] = useState<{ id: string; name: string; description: string | null }[]>([]);
  useEffect(() => { supabase.from('tertiary_institutions').select('id,name,description').order('name').then(({ data }) => setInstitutions(data || [])); }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-mesh py-20 text-white">
        <div className="container-page relative">
          <p className="section-eyebrow text-primary-200">Tertiary Learning</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            A broader tertiary education technology platform
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-100/90">
            I-LearnAce supports tertiary institutions, polytechnics, colleges of education, and other tertiary institutions.
            Faculties, departments, programmes, courses, lecturers, students, academic sessions, semesters,
            examinations, and results — all connected through one centralized platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tertiary" className="btn-accent">
              Explore Tertiary Education
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/courses" className="btn border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              View Courses & Programmes
            </Link>
          </div>
        </div>
      </section>

      <Section className="bg-ink-50">
        <div className="container-page">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">Partner Tertiary Institutions</h2>
          <p className="mt-2 text-ink-500">Institutions added by Super Admins appear here automatically.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((u) => (
              <div key={u.id} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600">{u.name.slice(0, 2).toUpperCase()}</span>
                  <div><h3 className="text-sm font-bold text-ink-900">{u.name}</h3><p className="text-xs text-ink-400">Tertiary Institution</p></div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">{u.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-ink-50 p-2"><p className="text-sm font-bold text-ink-900">—</p><p className="text-2xs text-ink-400">Faculties</p></div>
                  <div className="rounded-lg bg-ink-50 p-2"><p className="text-sm font-bold text-ink-900">—</p><p className="text-2xs text-ink-400">Programmes</p></div>
                  <div className="rounded-lg bg-ink-50 p-2"><p className="text-sm font-bold text-ink-900">—</p><p className="text-2xs text-ink-400">Students</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Building2, title: 'Faculties & Departments', text: 'Structure your institution into faculties and departments with full hierarchy.' },
            { icon: BookOpen, title: 'Programmes & Courses', text: 'Manage undergraduate and postgraduate programmes with course offerings per semester.' },
            { icon: Users, title: 'Lecturers & Students', text: 'Onboard lecturers and students, link them to departments and courses.' },
            { icon: CalendarDays, title: 'Academic Sessions', text: 'Define academic sessions and semesters with automated scheduling.' },
            { icon: Award, title: 'Examinations & Results', text: 'Build question banks, schedule exams, and publish verified results.' },
            { icon: GraduationCap, title: 'Multi-Institution Support', text: 'Each institution keeps its data separate with proper boundaries enforced.' },
          ].map((f) => (
            <div key={f.title} className="card-hover group p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">Ready to bring your institution online?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-100/90">
            Join the I-LearnAce network and manage your entire academic lifecycle in one place.
          </p>
          <Link to="/login" className="btn-accent mt-6">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
