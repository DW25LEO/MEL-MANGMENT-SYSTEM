import { Target, Eye, Heart, Award, Users, ShieldCheck, Lightbulb, HandshakeIcon, GraduationCap, CheckCircle2 } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';
import { Link } from '@/lib/router';
import { stats, heroImages } from '@/lib/content';
import { useSiteSettings } from '@/lib/site-settings';

export function AboutPage() {
  const { settings } = useSiteSettings();
  return (
    <>
      <PageHeader
        eyebrow="About I-LearnAce"
        title="Empowering education through technology"
        subtitle={settings.about_text || "I-LearnAce is a unified education technology platform built to connect institutions, educators, and students — making academic administration simple, transparent, and accessible."}
      />

      {/* Mission / Vision / Values */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Target, title: 'Our Mission', text: 'To provide a single, reliable platform that simplifies education management for every type of institution — from primary schools to universities.' },
            { icon: Eye, title: 'Our Vision', text: 'A world where every student and educator has instant access to the academic information they need, anytime, anywhere.' },
            { icon: Heart, title: 'Our Values', text: 'Transparency, accessibility, and trust. We build tools that put data in the hands of the people who need it, securely and fairly.' },
          ].map((card, i) => (
            <div key={card.title} className={`card-hover p-7 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <card.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{card.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Story split */}
      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-ink-200 shadow-xl">
              <img src={heroImages.lecture} alt="Students in a lecture hall" className="h-[420px] w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-6 grid grid-cols-2 gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-2xl">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-primary-600">8+</p>
                <p className="text-xs text-ink-500">Years serving education</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-accent-500">15</p>
                <p className="text-xs text-ink-500">Countries reached</p>
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Built by educators, for educators"
              subtitle="I-LearnAce started as a small project to digitize exam management for a a single tertiary institution. Today, it connects over 120 institutions across primary, secondary, and tertiary education."
            />
            <ul className="mt-6 space-y-3">
              {[
                'Started in 2018 as a tertiary education exam digitization project',
                'Expanded to primary and secondary schools in 2021',
                'Added student portals and results verification in 2023',
                'Now serves 45,000+ active students across the network',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Core values grid */}
      <Section className="bg-ink-50">
        <SectionHeading
          center
          eyebrow="What drives us"
          title="Principles behind every feature"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Security First', text: 'Role-based access, row-level security, and encrypted data protect every account.' },
            { icon: Lightbulb, title: 'Innovation', text: 'We continuously improve the platform with new tools that educators actually need.' },
            { icon: HandshakeIcon, title: 'Partnership', text: 'We work hand-in-hand with institutions to shape features that fit their reality.' },
            { icon: Award, title: 'Excellence', text: 'From UI to uptime, we hold ourselves to a high standard in everything we ship.' },
          ].map((value, i) => (
            <div key={value.title} className={`card-hover p-6 text-center animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <value.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-900">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{value.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-gradient-mesh py-16 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container-page relative">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-100/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Section className="bg-white">
        <div className="rounded-3xl border border-ink-200 bg-ink-50 p-8 text-center sm:p-12">
          <GraduationCap className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-ink-900 sm:text-3xl">Want to learn more?</h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-500">
            Explore the institutions, courses, and examinations that make up the I-LearnAce network.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/tertiary" className="btn-primary">View Tertiary Learning</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </Section>

      {/* Subtle admin link — only on About page */}
      <footer className="border-t border-ink-100 bg-white py-6">
        <div className="container-page text-center">
          <Link to="/admin/login" className="text-xs text-ink-300 hover:text-ink-400">
            Admin
          </Link>
        </div>
      </footer>
    </>
  );
}
