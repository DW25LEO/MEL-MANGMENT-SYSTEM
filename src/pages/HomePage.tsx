import {
  ArrowRight,
  GraduationCap,
  School,
  ClipboardCheck,
  ShieldCheck,
  Users,
  CreditCard,
  CheckCircle2,
  Star,
  Quote,
  Sparkles,
  BookOpen,
  BarChart3,
  Bell,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { Section, SectionHeading } from '@/components/Page';
import { features, stats, roles, testimonials, heroImages } from '@/lib/content';
import { useSiteSettings } from '@/lib/site-settings';

export function HomePage() {
  const { settings } = useSiteSettings();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-mesh pt-32 pb-24 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 h-72 w-96 rounded-full bg-primary-500/30 blur-3xl" />

        <div className="container-page relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="badge border border-white/15 bg-white/10 text-primary-100 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                Unified Education Technology
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
                {settings.homepage_images.heroTitle || 'One platform for every learner, every institution.'}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-100/90">
                {settings.homepage_images.heroSubtitle || 'I-LearnAce connects tertiary institutions, primary and secondary schools, students, and educators. Manage courses, sit examinations, verify results, and handle payments — all in one place.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="btn-accent">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="btn border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                  Learn About I-LearnAce
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-100/80">
                {['No setup fees', 'Cloud-hosted', '24/7 access'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="relative">
                <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-primary-950/40">
                  <img
                    src={heroImages.campus}
                    alt="Students walking on a tertiary education campus"
                    className="h-[420px] w-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Floating card 1 */}
                <div className="absolute -left-4 top-8 w-48 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-float">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100 text-success-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-ink-500">Exam Submitted</p>
                      <p className="text-sm font-bold text-ink-900">Score: 87%</p>
                    </div>
                  </div>
                </div>

                {/* Floating card 2 */}
                <div className="absolute -right-4 bottom-10 w-52 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-float animate-delay-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-ink-500">Active Students</p>
                      <p className="text-sm font-bold text-ink-900">45,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm animate-fade-in-up animate-delay-${(i + 1) * 100}`}
              >
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-100/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full text-ink-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0,32 C320,64 720,0 1440,32 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* FEATURES */}
      <Section>
        <SectionHeading
          center
          eyebrow="What I-LearnAce does"
          title="Everything your institution needs, in one system"
          subtitle="From tertiary education faculties to primary school classrooms, I-LearnAce brings every part of education management under a single, connected platform."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card-hover group p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* OUR SERVICES */}
      <Section className="bg-white">
        <SectionHeading
          center
          eyebrow="Our Services"
          title="Practical support for every learning journey"
          subtitle="From exam preparation to everyday classroom resources, I-LearnAce gives institutions and learners the tools to move forward."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: GraduationCap, title: 'Tertiary Exam Prep', text: 'Prepare learners with structured course materials, practice tests, and verified examination workflows.' },
            { icon: School, title: 'Primary School Resources', text: 'Give primary classrooms organised subjects, schemes of work, notes, and progress visibility.' },
            { icon: BookOpen, title: 'Secondary School Tutoring', text: 'Support secondary learners with accessible study resources and guided academic planning.' },
            { icon: ClipboardCheck, title: 'Online Examinations', text: 'Create secure tests, manage attempts, and release trustworthy results from one platform.' },
            { icon: Users, title: 'Institution Management', text: 'Connect administrators, educators, students, and institutions in a single shared workspace.' },
            { icon: ShieldCheck, title: 'Results Verification', text: 'Make academic records easy to confirm with secure, transparent verification.' },
          ].map((service, i) => (
            <div key={service.title} className={`card-hover group p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <service.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{service.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ROLES / WHO IS I-LEARNACE FOR */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Built for everyone"
          title="One platform. Every role. Connected."
          subtitle="Students, teachers, lecturers, and administrators each get a tailored portal with exactly the tools they need."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className={`group relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-200 animate-fade-in-up animate-delay-${(i % 4) * 100}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg shadow-primary-600/20">
                <role.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-900">{role.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{role.description}</p>
              <ul className="mt-4 space-y-1.5">
                {role.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs font-medium text-ink-600">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS / HOW IT WORKS */}
      <Section className="bg-ink-50">
        <SectionHeading
          center
          eyebrow="How it works"
          title="From registration to results in four steps"
          subtitle="A clear, connected journey for every student — from joining an institution to receiving a verified result slip."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', icon: Users, title: 'Register & Link', text: 'Students register and link to their institution. Admins approve accounts.' },
            { step: '02', icon: BookOpen, title: 'Register Courses', text: 'Students register for courses or subjects assigned by lecturers and teachers.' },
            { step: '03', icon: CreditCard, title: 'Pay & Sit Exams', text: 'Purchase exam credits, sit timed online exams, and submit answers securely.' },
            { step: '04', icon: ShieldCheck, title: 'Get Verified Results', text: 'Results are released, downloadable as slips, and verifiable by employers.' },
          ].map((item, i) => (
            <div key={item.step} className={`relative animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              {i < 3 && (
                <div className="absolute top-7 left-16 hidden h-px w-full bg-gradient-to-r from-primary-300 to-transparent lg:block" />
              )}
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-lg shadow-primary-600/10 ring-1 ring-ink-200/70">
                  <item.icon className="h-6 w-6" />
                </span>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-2xs font-bold text-ink-950">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-ink-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SPLIT: EXAM CREDIT SYSTEM */}
      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-ink-200 shadow-xl">
              <img src={heroImages.exam} alt="Student taking an online exam" className="h-[400px] w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 rounded-2xl border border-ink-200 bg-white p-5 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Exam Credits</p>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-600">Attempts remaining</span>
                  <span className="font-bold text-success-600">2 of 3</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-success-400 to-success-600" />
                </div>
                <p className="text-xs text-ink-400">Credits expire Dec 31, 2026</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="section-eyebrow">Exam Credit System</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl text-balance">
              Pay for attempts. Track every credit. Never lose count.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              I-LearnAce's exam credit system lets students purchase exam attempts, see how many they have left, and re-pay when credits expire — all tracked transparently in their portal.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Set exam fees and attempts per payment',
                'Active credits, used attempts, and remaining balance at a glance',
                'Automatic expiry tracking with re-payment reminders',
                'Full attempt history and payment receipts',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/examinations" className="btn-primary">
                Explore Examinations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-ink-50">
        <SectionHeading
          center
          eyebrow="Testimonials"
          title="Trusted by educators and students"
          subtitle="Real stories from the institutions and people who use I-LearnAce every day."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <figure
              key={t.name}
              className={`card-hover flex flex-col p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}
            >
              <Quote className="h-8 w-8 text-primary-200" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
                "{t.quote}"
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                  {t.initials}
                </span>
                <div>
                  <figcaption className="text-sm font-bold text-ink-900">{t.name}</figcaption>
                  <p className="text-xs text-ink-500">{t.role} · {t.institution}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-mesh py-20 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-10 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Bring your institution into the future of education
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100/90">
            Join 120+ universities and schools already managing their academics on I-LearnAce.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-accent">
              Create an Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
