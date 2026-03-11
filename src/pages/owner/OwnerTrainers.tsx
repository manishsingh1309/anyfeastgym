import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerTrainers: React.FC = () => {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [gymId, setGymId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const fetchData = async () => {
    if (!user) return;
    const { data: gym } = await supabase.from('gyms').select('id').eq('owner_user_id', user.id).limit(1).single();
    if (!gym) return;
    setGymId(gym.id);
    const { data } = await supabase.from('trainers').select('*').eq('gym_id', gym.id).order('created_at', { ascending: false });
    setTrainers(data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('trainers').insert({ ...form, gym_id: gymId });
    if (error) { toast.error(error.message); return; }
    toast.success('Trainer added!');
    setOpen(false);
    setForm({ name: '', phone: '', email: '' });
    fetchData();
  };

  const toggleStatus = async (trainer: any) => {
    const newStatus = trainer.status === 'active' ? 'inactive' : 'active';
    await supabase.from('trainers').update({ status: newStatus }).eq('id', trainer.id);
    toast.success(`Trainer ${newStatus === 'active' ? 'activated' : 'disabled'}`);
    fetchData();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Trainers</h1>
            <p className="text-muted-foreground">Manage your gym trainers</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />Add Trainer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Trainer</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Add Trainer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'actions', label: '', render: (_, row) => (
              <Button size="sm" variant="ghost" onClick={() => toggleStatus(row)} className="text-destructive hover:text-destructive">
                <UserMinus className="h-4 w-4 mr-1" />{row.status === 'active' ? 'Disable' : 'Enable'}
              </Button>
            )},
          ]}
          data={trainers}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerTrainers;
