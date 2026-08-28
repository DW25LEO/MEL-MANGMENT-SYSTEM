import { useEffect, useState } from 'react';
import { AlertCircle, Check, CreditCard, Loader2, RefreshCw, X } from 'lucide-react';
import { DashboardLayout, DashCard, DashPageHeader, StatusBadge } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { AdminGuard } from '@/pages/SuperAdminPages';

type Payment = {
  id: string;
  user_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  uses_remaining: number | null;
  payment_method: string | null;
  reference: string | null;
  created_at: string;
};

export function SuperAdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'all' | Payment['status']>('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ error: '', success: '' });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('payments').select('id,user_email,amount,currency,status,uses_remaining,payment_method,reference,created_at').order('created_at', { ascending: false });
    if (error) setMessage({ error: error.message, success: '' });
    setPayments((data || []) as Payment[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: Payment['status']) => {
    const { error } = await supabase.from('payments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) setMessage({ error: error.message, success: '' });
    else { setMessage({ error: '', success: `Payment marked ${status}.` }); void load(); }
  };

  const filtered = filter === 'all' ? payments : payments.filter((payment) => payment.status === filter);
  const completed = payments.filter((payment) => payment.status === 'completed');
  const totalCompleted = completed.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <AdminGuard>
      <DashboardLayout role="super-admin">
        <DashPageHeader title="Payment Management" subtitle="Review payment records and access status">
          <button onClick={() => void load()} className="btn-outline"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </DashPageHeader>
        {message.error && <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700"><AlertCircle className="h-4 w-4" />{message.error}</div>}
        {message.success && <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700"><Check className="h-4 w-4" />{message.success}</div>}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <DashCard><p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Total Payments</p><p className="mt-2 text-2xl font-extrabold text-ink-900">{payments.length}</p></DashCard>
          <DashCard><p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Completed</p><p className="mt-2 text-2xl font-extrabold text-success-600">{completed.length}</p></DashCard>
          <DashCard><p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Completed Value</p><p className="mt-2 text-2xl font-extrabold text-primary-600">₦{totalCompleted.toLocaleString()}</p></DashCard>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['all', 'pending', 'completed', 'failed'] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={filter === status ? 'btn-primary text-xs' : 'btn-outline text-xs'}>{status === 'all' ? 'All Payments' : status.charAt(0).toUpperCase() + status.slice(1)}</button>)}
        </div>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div> : filtered.length === 0 ? <DashCard><div className="py-12 text-center"><CreditCard className="mx-auto h-12 w-12 text-ink-300" /><p className="mt-3 text-sm text-ink-500">No payment records found.</p></div></DashCard> : (
          <DashCard title={`Payment Records (${filtered.length})`}>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-ink-200 text-xs uppercase text-ink-400"><th className="p-3">Student</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Reference</th><th className="p-3">Uses</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y divide-ink-100">{filtered.map((payment) => <tr key={payment.id} className="hover:bg-ink-50"><td className="p-3 font-medium text-ink-900">{payment.user_email}</td><td className="p-3 font-semibold text-ink-900">{payment.currency} {Number(payment.amount).toLocaleString()}</td><td className="p-3 text-ink-600">{payment.payment_method || '—'}</td><td className="p-3 text-xs text-ink-500">{payment.reference || '—'}</td><td className="p-3 text-ink-600">{payment.uses_remaining ?? '—'}</td><td className="p-3"><StatusBadge status={payment.status} /></td><td className="p-3 text-xs text-ink-500">{new Date(payment.created_at).toLocaleDateString()}</td><td className="p-3"><div className="flex gap-1">{payment.status !== 'completed' && <button onClick={() => void updateStatus(payment.id, 'completed')} className="rounded-lg p-1.5 text-success-600 hover:bg-success-50" title="Mark completed"><Check className="h-4 w-4" /></button>}{payment.status !== 'failed' && <button onClick={() => void updateStatus(payment.id, 'failed')} className="rounded-lg p-1.5 text-error-600 hover:bg-error-50" title="Mark failed"><X className="h-4 w-4" /></button>}</div></td></tr>)}</tbody></table></div>
          </DashCard>
        )}
      </DashboardLayout>
    </AdminGuard>
  );
}
