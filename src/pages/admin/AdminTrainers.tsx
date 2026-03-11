import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', gym_id: '' });

  const fetchData = async () => {
    const [t, g] = await Promise.all([
      supabase.from('trainers').select('*, gyms(name)').order('created_at', { ascending: false }),
      supabase.from('gyms').select('id, name').eq('status', 'active'),
    ]);
    setTrainers(t.data || []);
    setGyms(g.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('trainers').insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      gym_id: form.gym_id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Trainer created!');
    setOpen(false);
    setForm({ name: '', email: '', phone: '', gym_id: '' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Trainers</h1>
            <p className="text-muted-foreground">All trainers across gyms</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />Add Trainer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Trainer</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Gym</Label>
                  <Select value={form.gym_id} onValueChange={v => setForm({ ...form, gym_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select gym" /></SelectTrigger>
                    <SelectContent>
                      {gyms.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Email (optional)</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Phone (optional)</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Create Trainer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
          ]}
          data={trainers}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminTrainers;
