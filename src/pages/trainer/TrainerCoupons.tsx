import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const TrainerCoupons: React.FC = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [trainerId, setTrainerId] = useState('');
  const [gymId, setGymId] = useState('');
  const [pools, setPools] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    coupon_type: 'single_use',
    max_redemptions: '1',
    pool_id: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_email: '',
  });

  const fetchData = async () => {
    if (!user) return;
    const { data: trainer } = await supabase.from('trainers').select('id, gym_id').eq('user_id', user.id).limit(1).single();
    if (!trainer) return;
    setTrainerId(trainer.id);
    setGymId(trainer.gym_id);
    const [c, p] = await Promise.all([
      supabase.from('coupons').select('*').eq('trainer_id', trainer.id).order('created_at', { ascending: false }),
      supabase.from('license_pools').select('*').eq('gym_id', trainer.gym_id),
    ]);
    setCoupons(c.data || []);
    setPools(p.data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.recipient_phone && !form.recipient_email) {
      toast.error('Please provide either a phone number or email address');
      return;
    }

    if (!form.recipient_name.trim()) {
      toast.error('Please provide the recipient name');
      return;
    }

    const code = generateCode();
    const { error } = await supabase.from('coupons').insert({
      code,
      gym_id: gymId,
      trainer_id: trainerId,
      coupon_type: form.coupon_type,
      max_redemptions: parseInt(form.max_redemptions),
      pool_id: form.pool_id || null,
      recipient_name: form.recipient_name.trim(),
      recipient_phone: form.recipient_phone.trim() || null,
      recipient_email: form.recipient_email.trim() || null,
    } as any);
    if (error) { toast.error(error.message); return; }

    // Send coupon notification
    try {
      await supabase.functions.invoke('send-coupon-notification', {
        body: {
          code,
          recipient_name: form.recipient_name.trim(),
          recipient_phone: form.recipient_phone.trim() || null,
          recipient_email: form.recipient_email.trim() || null,
        },
      });
    } catch {
      // Notification failed but coupon was created
      console.warn('Failed to send coupon notification');
    }

    toast.success(`Coupon ${code} created and sent!`);
    setOpen(false);
    setForm({ coupon_type: 'single_use', max_redemptions: '1', pool_id: '', recipient_name: '', recipient_phone: '', recipient_email: '' });
    fetchData();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">My Coupons</h1>
            <p className="text-muted-foreground">Generate and manage coupon codes</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Plus className="mr-2 h-4 w-4" />Generate Coupon</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Generate Coupon</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Recipient Name *</Label>
                  <Input value={form.recipient_name} onChange={e => setForm({...form, recipient_name: e.target.value})} placeholder="Enter name" required />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input type="tel" value={form.recipient_phone} onChange={e => setForm({...form, recipient_phone: e.target.value})} placeholder="+91 9876543210" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" value={form.recipient_email} onChange={e => setForm({...form, recipient_email: e.target.value})} placeholder="user@example.com" />
                </div>
                <p className="text-xs text-muted-foreground">* Either phone or email is required to send the coupon</p>
                <div>
                  <Label>Type</Label>
                  <Select value={form.coupon_type} onValueChange={v => setForm({...form, coupon_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_use">Single Use</SelectItem>
                      <SelectItem value="multi_use">Multi Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.coupon_type === 'multi_use' && (
                  <div><Label>Max Redemptions</Label><Input type="number" value={form.max_redemptions} onChange={e => setForm({...form, max_redemptions: e.target.value})} min="1" /></div>
                )}
                <div>
                  <Label>License Pool</Label>
                  <Select value={form.pool_id} onValueChange={v => setForm({...form, pool_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select pool" /></SelectTrigger>
                    <SelectContent>
                      {pools.map(p => <SelectItem key={p.id} value={p.id}>{p.plan_name} ({p.quantity - p.redeemed} left)</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Generate & Send</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={[
            { key: 'code', label: 'Code', render: (v) => (
              <button onClick={() => copyCode(v)} className="flex items-center gap-1 font-mono font-bold text-primary hover:underline">
                {v} <Copy className="h-3 w-3" />
              </button>
            )},
            { key: 'recipient_name', label: 'Recipient', render: (v) => v || '—' },
            { key: 'coupon_type', label: 'Type', render: (v) => v?.replace('_', ' ') },
            { key: 'redemptions', label: 'Used', render: (v, row) => `${v}/${row.max_redemptions}` },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'created_at', label: 'Created', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={coupons}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default TrainerCoupons;
