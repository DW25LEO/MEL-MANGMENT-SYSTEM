import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap, School, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  CheckCircle2, AlertCircle, Loader2, Phone, MapPin, BookOpen,
  ShieldCheck, KeyRound,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { roleBasePaths, type DashboardRole } from '@/lib/dashboard-data';

type Mode = 'login' | 'register';
type RegisterType = 'school' | 'tertiary' | null;
type LoginStep = 'credentials' | 'otp';

type Institution = { id: string; name: string; type: string };
type Course = { id: string; code: string; name: string; institution_id: string; level: string; credits: number };
type School = { id: string; name: string; type: string };

export function LoginPage() {
  const { session } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [registerType, setRegisterType] = useState<RegisterType>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  // Data
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // ── Fetch institutions ──
  useEffect(() => {
    void Promise.all([
      supabase.from('institutions').select('id, name, type').eq('is_active', true).order('name'),
      supabase.from('schools').select('id, name, type').order('name'),
    ]).then(([institutionResult, schoolResult]) => {
      if (institutionResult.data) setInstitutions(institutionResult.data as Institution[]);
      if (schoolResult.data) setSchools(schoolResult.data as School[]);
    });
  }, []);

  // ── Fetch courses when tertiary education selected ──
  useEffect(() => {
    if (registerType === 'tertiary' && selectedInstitution) {
      supabase
        .from('courses')
        .select('id, code, name, institution_id')
        .eq('institution_id', selectedInstitution)
        .eq('is_active', true)
        .order('code')
        .then(({ data }) => {
          if (data) setCourses(data as Course[]);
        });
    } else {
      setCourses([]);
    }
  }, [registerType, selectedInstitution]);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    setRegisterType(null);
    setLoginStep('credentials');
    setOtpSent(false);
    resetState();
  };

  const filteredInstitutions: Institution[] = registerType === 'school'
    ? schools.map((school) => ({ id: school.id, name: school.name, type: 'school', location: '', contact_email: '', contact_phone: '', description: '', is_active: true }))
    : registerType === 'tertiary'
      ? institutions.filter((institution) => institution.type === 'university')
      : [];

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((c) => c !== courseId)
        : [...prev, courseId]
    );
  };

  // ── Login: Step 1 — credentials ──
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Try Supabase auth sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailOrId.includes('@') ? emailOrId : `${emailOrId}@mel-student.edu`,
        password,
      });

      if (signInError) throw signInError;

      // Credentials valid — send OTP
      const userEmail = emailOrId.includes('@') ? emailOrId : `${emailOrId}@mel-student.edu`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email: userEmail, action: 'send-otp' }),
        }
      );
      const otpData = await res.json();

      if (!otpData.success) throw new Error(otpData.error || 'Failed to send code');

      setOtpSent(true);
      setLoginStep('otp');
      setSuccess(`Verification code sent to ${userEmail}. Check your inbox (or use code: ${otpData.code}).`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      if (message.includes('Invalid login credentials')) {
        setError('Incorrect email/ID or password.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Login: Step 2 — verify OTP ──
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    const code = otpCode.join('');
    if (code.length !== 4) {
      setError('Please enter all 4 digits.');
      return;
    }

    setLoading(true);

    try {
      const userEmail = emailOrId.includes('@') ? emailOrId : `${emailOrId}@mel-student.edu`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email: userEmail, action: 'verify-otp', code }),
        }
      );
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Invalid code');

      setSuccess('Verified! Redirecting to your dashboard...');

      // Determine role from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const userRole = (userData.user?.user_metadata?.role || 'student') as DashboardRole;

      setTimeout(() => {
        navigate(roleBasePaths[userRole]);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!registerType) {
      setError('Please select Primary/Secondary School or Tertiary Education.');
      return;
    }
    if (!fullName || !email || !password || !phone || !location || !selectedInstitution) {
      setError('Please fill in all required fields.');
      return;
    }
    if (registerType === 'tertiary' && selectedCourses.length === 0) {
      setError('Please select at least one course.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const role = registerType === 'school' ? 'school-student' : 'tertiary-education-student';
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone,
            location,
            institution_id: selectedInstitution,
            school_id: registerType === 'school' ? selectedInstitution : undefined,
            selected_courses: registerType === 'tertiary' ? selectedCourses : undefined,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setSuccess('Account created! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate(roleBasePaths[role as DashboardRole]);
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      if (message.includes('User already registered')) {
        setError('An account with this email already exists. Try logging in.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSuccess(null);
  };

  // ── OTP input handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    // Auto-focus next
    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  // ── Already signed in ──
  if (session) {
    const userRole = (session.user?.user_metadata?.role || 'student') as DashboardRole;
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-mesh px-4 py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="relative w-full max-w-md">
          <div className="mb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20">
                <GraduationCap className="h-7 w-7" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight text-white">I-LearnAce</span>
                <span className="text-2xs font-medium text-primary-200">Learning Platform</span>
              </span>
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-primary-950/40 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-ink-900">You're signed in</h1>
            <p className="mt-2 text-sm text-ink-500">
              Welcome back{session.user?.email ? `, ${session.user.email}` : ''}!
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to={roleBasePaths[userRole]} className="btn-primary w-full">
                Go to My Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="btn-outline w-full">Back to Website</Link>
              <button onClick={handleSignOut} className="btn-ghost w-full">Sign Out</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-mesh px-4 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-96 rounded-full bg-primary-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20">
              <GraduationCap className="h-7 w-7" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-white">MEL</span>
              <span className="text-2xs font-medium text-primary-200">Learning Platform</span>
            </span>
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl shadow-primary-950/40 sm:p-8">
          {/* Mode tabs */}
          <div className="mb-6 flex rounded-xl bg-ink-100 p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-white text-primary-700 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700 animate-fade-in">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700 animate-fade-in">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {/* ═══ LOGIN FLOW ═══ */}
          {mode === 'login' && (
            <>
              {loginStep === 'credentials' && (
                <>
                  <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
                  <p className="mt-1 text-sm text-ink-500">Sign in with your email or ID number</p>

                  <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email or ID Number</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                          type="text"
                          value={emailOrId}
                          onChange={(e) => setEmailOrId(e.target.value)}
                          required
                          placeholder="you@example.com or ILA-STD-00482"
                          className="input pl-11"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="input px-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-ink-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500" />
                        Remember me
                      </label>
                      <a href="#/login" className="font-semibold text-primary-600 hover:text-primary-700">
                        Forgot password?
                      </a>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {loginStep === 'otp' && (
                <>
                  <h1 className="text-2xl font-bold text-ink-900">Verify your identity</h1>
                  <p className="mt-1 text-sm text-ink-500">
                    We sent a 4-digit code to your email. Enter it below.
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
                    <KeyRound className="h-4 w-4 shrink-0" />
                    Enter the 4-digit verification code
                  </div>

                  <form onSubmit={handleOtpVerify} className="mt-5 space-y-4">
                    <div className="flex justify-center gap-3">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-14 w-14 rounded-xl border-2 border-ink-200 bg-white text-center text-2xl font-bold text-ink-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                        />
                      ))}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Continue
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep('credentials');
                        setOtpCode(['', '', '', '']);
                        setOtpSent(false);
                        setSuccess(null);
                      }}
                      className="w-full text-center text-sm text-ink-500 hover:text-ink-700"
                    >
                      Back to login
                    </button>
                  </form>
                </>
              )}
            </>
          )}

          {/* ═══ REGISTER FLOW ═══ */}
          {mode === 'register' && (
            <>
              <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
              <p className="mt-1 text-sm text-ink-500">Choose your institution type to get started</p>

              {/* Institution type selector */}
              {!registerType && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterType('school')}
                    className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink-200 p-6 transition-all hover:border-primary-400 hover:bg-primary-50/50"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                      <School className="h-7 w-7" />
                    </span>
                    <span className="text-sm font-bold text-ink-900">Primary / Secondary School</span>
                    <span className="text-xs text-ink-400 text-center">For primary and secondary school students</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterType('tertiary')}
                    className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink-200 p-6 transition-all hover:border-primary-400 hover:bg-primary-50/50"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                      <GraduationCap className="h-7 w-7" />
                    </span>
                    <span className="text-sm font-bold text-ink-900">Tertiary Education</span>
                    <span className="text-xs text-ink-400 text-center">For tertiary education students</span>
                  </button>
                </div>
              )}

              {/* Registration form */}
              {registerType && (
                <form onSubmit={handleRegister} className="mt-5 space-y-4">
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterType(null);
                      setSelectedInstitution('');
                      setSelectedCourses([]);
                    }}
                    className="text-xs font-semibold text-ink-500 hover:text-ink-700"
                  >
                    ← Back to institution type
                  </button>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="input px-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+234 800 000 0000"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        placeholder="City, State"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      {registerType === 'school' ? 'Select Your School' : 'Select Your Tertiary Education'}
                    </label>
                    <select
                      value={selectedInstitution}
                      onChange={(e) => setSelectedInstitution(e.target.value)}
                      required
                      className="input"
                    >
                      <option value="">Choose an institution...</option>
                      {filteredInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course selection for tertiary education students */}
                  {registerType === 'tertiary' && selectedInstitution && courses.length > 0 && (
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                        Select Your Courses
                      </label>
                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-ink-200 p-3 scrollbar-hide">
                        {courses.map((course) => (
                          <label
                            key={course.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-primary-50/50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.id)}
                              onChange={() => toggleCourse(course.id)}
                              className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-ink-900">{course.code} — {course.name}</p>
                              <p className="text-xs text-ink-400">{course.level} · {course.credits} credits</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-ink-400">{selectedCourses.length} course(s) selected</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Switch link */}
          <p className="mt-5 text-center text-sm text-ink-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-primary-200/70">
          By continuing, you agree to I-LearnAce's Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
