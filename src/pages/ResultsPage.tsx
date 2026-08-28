import { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, FileText, Download, Lock, Award, User } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';

type VerificationState = 'idle' | 'success' | 'not-found' | 'error';

const sampleResult = {
  candidateName: 'Grace Eze',
  candidateRef: 'ILA-2026-UNN-00482',
  institution: 'Nigeria Tertiary Institution, Nsukka',
  programme: 'B.Sc. Computer Science',
  examTitle: 'Data Structures & Algorithms — CSC 301',
  examDate: 'July 15, 2026',
  score: 87,
  totalQuestions: 50,
  percentage: 87,
  grade: 'A',
  status: 'Pass',
  attempt: 1,
};

export function ResultsPage() {
  const [ref, setRef] = useState('');
  const [state, setState] = useState<VerificationState>('idle');
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) {
      setState('error');
      return;
    }
    setLoading(true);
    setState('idle');
    setTimeout(() => {
      setLoading(false);
      if (ref.trim().toUpperCase() === sampleResult.candidateRef) {
        setState('success');
      } else {
        setState('not-found');
      }
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Public Verification"
        title="Verify exam results & certificates"
        subtitle="Employers and institutions can securely verify a candidate's exam results and certificates. Enter the candidate reference to confirm authenticity."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="card p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink-900">Verification Lookup</h2>
                <p className="text-sm text-ink-500">Enter the candidate reference number</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-700">Candidate Reference</label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. ILA-2026-UNN-00482"
                  className="input"
                />
                <p className="mt-1.5 text-xs text-ink-400">
                  Try the sample reference: <button type="button" onClick={() => setRef(sampleResult.candidateRef)} className="font-semibold text-primary-600 hover:underline">{sampleResult.candidateRef}</button>
                </p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Verify Result
                  </>
                )}
              </button>
            </form>

            {state === 'error' && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
                <XCircle className="h-4 w-4" /> Please enter a candidate reference.
              </div>
            )}
            {state === 'not-found' && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
                <XCircle className="h-4 w-4" /> No result found for that reference. Please check and try again.
              </div>
            )}
          </div>

          {/* Result */}
          <div className="card p-7">
            {state === 'success' ? (
              <div className="animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-ink-900">Verified Result</h2>
                      <p className="text-sm text-success-600">Authentic and confirmed</p>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-accent-500" />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{sampleResult.candidateName}</p>
                      <p className="text-xs text-ink-500">{sampleResult.candidateRef}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-ink-100 p-3">
                      <p className="text-xs text-ink-400">Institution</p>
                      <p className="font-semibold text-ink-800">{sampleResult.institution}</p>
                    </div>
                    <div className="rounded-xl border border-ink-100 p-3">
                      <p className="text-xs text-ink-400">Programme</p>
                      <p className="font-semibold text-ink-800">{sampleResult.programme}</p>
                    </div>
                    <div className="rounded-xl border border-ink-100 p-3">
                      <p className="text-xs text-ink-400">Exam</p>
                      <p className="font-semibold text-ink-800">{sampleResult.examTitle}</p>
                    </div>
                    <div className="rounded-xl border border-ink-100 p-3">
                      <p className="text-xs text-ink-400">Exam Date</p>
                      <p className="font-semibold text-ink-800">{sampleResult.examDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Score', value: `${sampleResult.score}/${sampleResult.totalQuestions}` },
                      { label: 'Percentage', value: `${sampleResult.percentage}%` },
                      { label: 'Grade', value: sampleResult.grade },
                      { label: 'Status', value: sampleResult.status },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-primary-50 p-3 text-center">
                        <p className="text-lg font-extrabold text-primary-700">{item.value}</p>
                        <p className="text-2xs text-ink-500">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 border-t border-ink-100 pt-4">
                    <button className="btn-outline flex-1">
                      <FileText className="h-4 w-4" /> View Slip
                    </button>
                    <button className="btn-outline flex-1">
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-ink-400">
                <Lock className="h-12 w-12 text-ink-300" />
                <p className="mt-4 text-sm">Enter a candidate reference and click "Verify" to see the confirmed result here.</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Trust badges */}
      <Section className="bg-white">
        <SectionHeading center eyebrow="Secure & Reliable" title="Why trust I-LearnAce verification?" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Lock, title: 'Encrypted & Secure', text: 'All verification lookups are encrypted and logged for audit purposes.' },
            { icon: ShieldCheck, title: 'Authentic Results', text: 'Results are pulled directly from the institution exam records — no manual data entry.' },
            { icon: CheckCircle2, title: 'Instant Confirmation', text: 'Get immediate confirmation of a candidate score, grade, and pass/fail status.' },
          ].map((item, i) => (
            <div key={item.title} className={`card-hover p-6 text-center animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
