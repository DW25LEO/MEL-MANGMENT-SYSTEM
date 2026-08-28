import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact the I-LearnAce team"
        subtitle="Have a question about joining the I-LearnAce network, need technical support, or want a demo? We're here to help."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email', value: 'hello@i-learnace.com', sub: 'We reply within 24 hours' },
              { icon: Phone, title: 'Phone', value: '+234 800 000 0000', sub: 'Mon–Fri, 8am–6pm WAT' },
              { icon: MapPin, title: 'Office', value: 'Lagos, Nigeria', sub: '15 Marina Road, Lagos Island' },
              { icon: Clock, title: 'Support Hours', value: '24/7 Online', sub: 'Portal support always available' },
            ].map((item, i) => (
              <div key={item.title} className={`card p-5 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{item.title}</p>
                    <p className="text-sm font-bold text-ink-900">{item.value}</p>
                    <p className="text-xs text-ink-500">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-7">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center animate-scale-in">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-ink-900">Message sent!</h3>
                  <p className="mt-2 max-w-sm text-sm text-ink-500">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <MessageSquare className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-ink-900">Send us a message</h2>
                      <p className="text-sm text-ink-500">Fill out the form below and we'll be in touch</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">Full Name</label>
                        <input type="text" required placeholder="Your name" className="input" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
                        <input type="email" required placeholder="you@example.com" className="input" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">Institution (optional)</label>
                        <input type="text" placeholder="Your school or tertiary institution" className="input" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">Subject</label>
                        <select className="input">
                          <option>General Inquiry</option>
                          <option>Join the I-LearnAce Network</option>
                          <option>Technical Support</option>
                          <option>Demo Request</option>
                          <option>Partnership</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink-700">Message</label>
                      <textarea required rows={5} placeholder="How can we help?" className="input resize-none" />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Map placeholder */}
      <Section className="bg-white pt-0">
        <SectionHeading center eyebrow="Visit Us" title="Find us in Lagos" />
        <div className="mt-8 overflow-hidden rounded-3xl border border-ink-200 shadow-lg">
          <div className="relative h-80 bg-gradient-to-br from-primary-100 via-primary-50 to-ink-100">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl">
                <MapPin className="h-7 w-7" />
              </span>
              <p className="mt-3 text-sm font-bold text-ink-900">I-LearnAce Headquarters</p>
              <p className="text-sm text-ink-500">15 Marina Road, Lagos Island, Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
