import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminCommissionRules: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    gym_id: '',
    trainer_id: '',
    activation_type: 'fixed',
    activation_amount: '',
    renewal_type: 'fixed',
    renewal_amount: '',
    cap_per_month: '',
  });

  const fetchData = async () => {
    const [r, g, t] = await Promise.all([
      supabase.from('commission_rules').select('*, gyms(name), trainers(name)').order('created_at', { ascending: false }),
      supabase.from('gyms').select('id, name').eq('status', 'active'),
      supabase.from('trainers').select('id, name, gym_id').eq('status', 'active'),
    ]);
    setRules(r.data || []);
    setGyms(g.data || []);
    setTrainers(t.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTrainers = form.gym_id
    ? trainers.filter(t => t.gym_id === form.gym_id)
    : trainers;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('commission_rules').insert({
      gym_id: form.gym_id,
      trainer_id: form.trainer_id || null,
      activation_type: form.activation_type,
      activation_amount: parseFloat(form.activation_amount) || 0,
      renewal_type: form.renewal_type,
      renewal_amount: parseFloat(form.renewal_amount) || 0,
      cap_per_month: form.cap_per_month ? parseFloat(form.cap_per_month) : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Commission rule created!');
    setOpen(false);
    setForm({ gym_id: '', trainer_id: '', activation_type: 'fixed', activation_amount: '', renewal_type: 'fixed', renewal_amount: '', cap_per_month: '' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Commission Rules</h1>
            <p className="text-muted-foreground">Configure trainer commission structures</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />New Rule</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Commission Rule</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Gym</Label>
                  <Select value={form.gym_id} onValueChange={v => setForm({ ...form, gym_id: v, trainer_id: '' })}>
                    <SelectTrigger><SelectValue placeholder="Select gym" /></SelectTrigger>
                    <SelectContent>
                      {gyms.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trainer (optional — leave blank for gym-wide default)</Label>
                  <Select value={form.trainer_id} onValueChange={v => setForm({ ...form, trainer_id: v })}>
                    <SelectTrigger><SelectValue placeholder="All trainers (default)" /></SelectTrigger>
                    <SelectContent>
                      {filteredTrainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Activation Type</Label>
                    <Select value={form.activation_type} onValueChange={v => setForm({ ...form, activation_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed ₹</SelectItem>
                        <SelectItem value="percentage">Percentage %</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Activation Amount</Label><Input type="number" value={form.activation_amount} onChange={e => setForm({ ...form, activation_amount: e.target.value })} required min="0" step="0.01" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Renewal Type</Label>
                    <Select value={form.renewal_type} onValueChange={v => setForm({ ...form, renewal_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed ₹</SelectItem>
                        <SelectItem value="percentage">Percentage %</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Renewal Amount</Label><Input type="number" value={form.renewal_amount} onChange={e => setForm({ ...form, renewal_amount: e.target.value })} required min="0" step="0.01" /></div>
                </div>
                <div><Label>Monthly Cap (optional)</Label><Input type="number" value={form.cap_per_month} onChange={e => setForm({ ...form, cap_per_month: e.target.value })} min="0" step="0.01" placeholder="No cap" /></div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Create Rule</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || 'All (default)' },
            { key: 'activation_type', label: 'Activation', render: (v, row) => `${v === 'percentage' ? '' : '₹'}${row.activation_amount}${v === 'percentage' ? '%' : ''}` },
            { key: 'renewal_type', label: 'Renewal', render: (v, row) => `${v === 'percentage' ? '' : '₹'}${row.renewal_amount}${v === 'percentage' ? '%' : ''}` },
            { key: 'cap_per_month', label: 'Monthly Cap', render: (v) => v ? `₹${v}` : 'No cap' },
            { key: 'created_at', label: 'Created', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={rules}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminCommissionRules;
