import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { PageHeader, Section, SectionHeading } from '@/components/Page';
import { Link } from '@/lib/router';
import { faqs } from '@/lib/content';

export function FaqPage() {
  const [open, setOpen] = useState<string | null>(faqs[0].question);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchQuery =
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently asked questions"
        subtitle="Find answers to common questions about I-LearnAce — from getting started to exams, results, payments, and account management."
      />

      {/* Search */}
      <Section className="pb-0">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="input pl-12"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-primary-300 hover:text-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ list */}
      <Section>
        <div className="mx-auto max-w-3xl space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-ink-300" />
              <p className="mt-3 text-ink-500">No questions match your search. Try different keywords.</p>
            </div>
          ) : (
            filtered.map((faq) => {
              const isOpen = open === faq.question;
              return (
                <div
                  key={faq.question}
                  className={`card overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary-200' : ''}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : faq.question)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isOpen ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600'
                      }`}>
                        Q
                      </span>
                      <span className="text-sm font-bold text-ink-900">{faq.question}</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-16 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Section>

      {/* Still have questions */}
      <Section className="bg-white">
        <div className="rounded-3xl border border-ink-200 bg-ink-50 p-8 text-center sm:p-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <MessageSquare className="h-6 w-6" />
          </span>
          <SectionHeading center title="Still have questions?" subtitle="Our team is ready to help with anything not covered here." />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <Link to="/login" className="btn-outline">Login / Register</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
