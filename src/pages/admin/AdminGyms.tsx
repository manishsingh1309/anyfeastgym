import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminGyms: React.FC = () => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', branch: '', address: '', city: '' });

  const fetchGyms = async () => {
    const { data } = await supabase.from('gyms').select('*').order('created_at', { ascending: false });
    setGyms(data || []);
  };

  useEffect(() => { fetchGyms(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('gyms').insert(form);
    if (error) { toast.error(error.message); return; }
    toast.success('Gym created!');
    setOpen(false);
    setForm({ name: '', branch: '', address: '', city: '' });
    fetchGyms();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Gyms</h1>
            <p className="text-muted-foreground">Manage all gym partners</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />Add Gym</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Gym</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div><Label>Gym Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><Label>Branch (optional)</Label><Input value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                <div><Label>City</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Create Gym</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'branch', label: 'Branch' },
            { key: 'city', label: 'City' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'created_at', label: 'Created', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={gyms}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminGyms;
