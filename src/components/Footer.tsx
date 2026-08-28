import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link } from '@/lib/router';
import { footerSections } from '@/lib/content';
import { useSiteSettings } from '@/lib/site-settings';

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink-950 text-ink-300">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-primary-600/20 blur-3xl" />

      <div className="container-page relative">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Ready to modernize your institution?</h3>
            <p className="mt-2 max-w-xl text-ink-400">
              Join the I-LearnAce network and bring course registration, examinations, results, and payments under one roof.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/contact" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
              Talk to Us
            </Link>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white">I-LearnAce</span>
                <span className="text-2xs font-medium text-ink-400">Learning Platform</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              {settings.footer_text}
            </p>
            <div className="mt-5 flex gap-2">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-300 transition-colors hover:border-primary-500 hover:bg-primary-600 hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white">{section.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="grid gap-4 border-t border-white/10 py-6 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 text-sm text-ink-400">
            <Mail className="h-4 w-4 text-primary-400" />
            hello@i-learnace.com
          </div>
          <div className="flex items-center gap-2.5 text-sm text-ink-400">
            <Phone className="h-4 w-4 text-primary-400" />
            +234 800 000 0000
          </div>
          <div className="flex items-center gap-2.5 text-sm text-ink-400">
            <MapPin className="h-4 w-4 text-primary-400" />
            Lagos, Nigeria
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} I-LearnAce. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#/" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#/" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#/" className="transition-colors hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
