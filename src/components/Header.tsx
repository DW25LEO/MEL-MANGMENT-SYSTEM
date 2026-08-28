import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, LogIn, LogOut, GraduationCap } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { navLinks, primaryNav, utilityNav } from '@/lib/content';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useSiteSettings } from '@/lib/site-settings';

export function Header() {
  const { route } = useRouter();
  const { session } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (to: string) =>
    to === '/' ? route.path === '/' : route.path === to;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink-200/70 bg-white/85 backdrop-blur-lg shadow-sm'
          : 'border-b border-transparent bg-white/0'
      }`}
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
              {settings.logo_url ? <img src={settings.logo_url} alt="I-LearnAce logo" className="h-6 w-6 rounded-md object-cover" /> : <GraduationCap className="h-6 w-6" />}
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-ink-900">I-LearnAce</span>
              <span className="text-2xs font-medium text-ink-500">Learning Platform</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNav.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary-700'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/60'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary-600" />
                )}
              </Link>
            ))}
            {/* More dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100/60 hover:text-ink-900">
                More
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="w-56 rounded-2xl border border-ink-200 bg-white p-2 shadow-xl shadow-ink-900/10">
                  {utilityNav.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                      }`}
                    >
                      <link.icon className="h-4 w-4 text-ink-400" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <button onClick={handleSignOut} className="btn-outline hidden sm:inline-flex">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-outline hidden sm:inline-flex">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link to="/login" className="btn-primary hidden sm:inline-flex">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="container-page py-4">
            <nav className="flex flex-col gap-1 rounded-2xl border border-ink-200 bg-white p-2 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <link.icon className="h-4 w-4 text-ink-400" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-ink-100 pt-3">
                {session ? (
                  <button onClick={handleSignOut} className="btn-outline flex-1 justify-center">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn-outline flex-1 justify-center">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link to="/login" className="btn-primary flex-1 justify-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
