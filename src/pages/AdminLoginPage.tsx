import { useState } from 'react';
import {
  GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight,
  AlertCircle, Loader2, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';

export function AdminLoginPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        setError('Invalid admin credentials.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError || !['admin', 'super-admin'].includes(profile?.role || '')) {
        await supabase.auth.signOut();
        setError('This account is not authorized for the admin portal.');
        return;
      }

      navigate('/super-admin/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-96 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-white">I-LearnAce Admin</span>
              <span className="text-2xs font-medium text-ink-400">Administration Portal</span>
            </span>
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-ink-900 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
          <p className="mt-1 text-sm text-ink-400">Authorized personnel only</p>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-error-500/10 px-4 py-3 text-sm text-error-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-300">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@i-learnace.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-ink-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-11 text-sm text-white placeholder:text-ink-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-500">
            <Link to="/" className="hover:text-ink-300">← Back to website</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
