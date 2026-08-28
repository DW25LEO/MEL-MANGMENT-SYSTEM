import {
  ClipboardCheck,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Lock,
  FileText,
  Award,
  ArrowRight,
  ListChecks,
  Timer,
} from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';
import { Link } from '@/lib/router';
import { heroImages } from '@/lib/content';
import { useSiteSettings } from '@/lib/site-settings';

const examSteps = [
  { icon: ClipboardCheck, title: 'Exam Instructions', text: 'Read the instructions, duration, and attempt limits before starting.' },
  { icon: Timer, title: 'Start Exam', text: 'Begin the timed exam. The countdown starts immediately and cannot be paused.' },
  { icon: ListChecks, title: 'Answer Questions', text: 'Answer multiple-choice and written questions. Your answers are saved automatically.' },
  { icon: CheckCircle2, title: 'Submit Exam', text: 'Submit when finished or when time runs out. You will see a confirmation screen.' },
];

const creditSteps = [
  { label: 'Exam Fee', value: '₦5,000', icon: CreditCard },
  { label: 'Attempts Per Payment', value: '3', icon: ListChecks },
  { label: 'Attempts Used', value: '1', icon: CheckCircle2 },
  { label: 'Attempts Remaining', value: '2', icon: AlertCircle },
];

export function ExaminationsPage() {
  const { settings } = useSiteSettings();
  return (
    <>
      <PageHeader
        eyebrow="Online Examinations"
        title="Examinations built for the digital age"
        subtitle={settings.exam_text || "Create exams from question banks, set durations and attempt limits, let students pay and sit exams online, and release results with automatic marking."}
      />

      {/* Exam flow */}
      <Section>
        <SectionHeading
          center
          eyebrow="The Exam Experience"
          title="From instructions to submission"
          subtitle="A clear, guided flow that takes students from reading exam instructions to receiving a confirmation — all tracked and timed."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {examSteps.map((step, i) => (
            <div key={step.title} className={`relative card-hover p-6 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-primary-100">{`0${i + 1}`}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Exam credit system */}
      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-ink-200 shadow-xl">
              <img src={heroImages.exam} alt="Student taking an online exam" className="h-[400px] w-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Exam Credit System"
              title="Pay for attempts. Track every credit."
              subtitle="Each exam has a fee and a number of attempts per payment. Students can see their active credits, attempts used, attempts remaining, and expired credits at any time."
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              {creditSteps.map((item) => (
                <div key={item.label} className="card p-4">
                  <item.icon className="h-5 w-5 text-primary-500" />
                  <p className="mt-2 text-2xl font-extrabold text-ink-900">{item.value}</p>
                  <p className="text-xs text-ink-500">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login" className="btn-primary">
                Pay for an Exam
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/results" className="btn-outline">View Results</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Exam management features */}
      <Section className="bg-ink-50">
        <SectionHeading
          center
          eyebrow="For Educators"
          title="Powerful exam management"
          subtitle="Lecturers and teachers build exams from a shared question bank, schedule them, set attempt limits, and release results — all from their portal."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ListChecks, title: 'Question Bank', text: 'Build and reuse a shared bank of questions across courses and subjects.' },
            { icon: Clock, title: 'Timed Exams', text: 'Set exam durations. The countdown runs per student and cannot be paused.' },
            { icon: ClipboardCheck, title: 'Attempt Limits', text: 'Control how many attempts a student gets per payment cycle.' },
            { icon: Lock, title: 'Secure Submissions', text: 'Answers are saved automatically and locked on submission.' },
            { icon: FileText, title: 'Automatic Marking', text: 'Multiple-choice questions are marked instantly on submission.' },
            { icon: Award, title: 'Release Results', text: 'Release results to students with scores, grades, and downloadable slips.' },
          ].map((feature, i) => (
            <div key={feature.title} className={`card-hover group p-6 animate-fade-in-up animate-delay-${(i % 3) * 100}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-white">
        <div className="rounded-3xl bg-gradient-mesh p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to sit your next exam?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-100/90">
            Log in to your student portal to see available exams, pay for credits, and start.
          </p>
          <Link to="/login" className="btn-accent mt-6 inline-flex">
            Go to Student Portal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
