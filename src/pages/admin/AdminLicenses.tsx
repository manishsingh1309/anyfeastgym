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

const AdminLicenses: React.FC = () => {
  const [pools, setPools] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ gym_id: '', plan_name: '', quantity: '', expires_at: '' });

  const fetchData = async () => {
    const [p, g] = await Promise.all([
      supabase.from('license_pools').select('*, gyms(name)').order('created_at', { ascending: false }),
      supabase.from('gyms').select('id, name').eq('status', 'active'),
    ]);
    setPools(p.data || []);
    setGyms(g.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('license_pools').insert({
      ...form,
      quantity: parseInt(form.quantity),
      expires_at: form.expires_at || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('License pool created!');
    setOpen(false);
    fetchData();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">License Pools</h1>
            <p className="text-muted-foreground">Manage license allocations per gym</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />New Pool</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create License Pool</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Gym</Label>
                  <Select value={form.gym_id} onValueChange={v => setForm({...form, gym_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select gym" /></SelectTrigger>
                    <SelectContent>
                      {gyms.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Plan Name</Label><Input value={form.plan_name} onChange={e => setForm({...form, plan_name: e.target.value})} required placeholder="e.g. 1 Month Trial" /></div>
                <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required min="1" /></div>
                <div><Label>Expires At (optional)</Label><Input type="datetime-local" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} /></div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Create Pool</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'plan_name', label: 'Plan' },
            { key: 'quantity', label: 'Total' },
            { key: 'redeemed', label: 'Redeemed' },
            { key: 'remaining', label: 'Remaining', render: (_, row) => (row.quantity || 0) - (row.redeemed || 0) },
            { key: 'expires_at', label: 'Expires', render: (v) => v ? new Date(v).toLocaleDateString() : 'Never' },
          ]}
          data={pools}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminLicenses;
