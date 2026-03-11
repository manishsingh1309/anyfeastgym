import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const TrainerMembers: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: trainer } = await supabase.from('trainers').select('id').eq('user_id', user.id).limit(1).single();
      if (!trainer) return;
      const { data } = await supabase.from('subscriptions')
        .select('*, profiles!subscriptions_member_id_fkey(full_name, email, phone)')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });
      setMembers(data || []);
    };
    fetch();
  }, [user]);

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const filtered = members.filter(m => {
    if (filter === 'active') return m.status === 'active';
    if (filter === 'expiring') return m.status === 'active' && new Date(m.end_at) <= weekFromNow;
    if (filter === 'expired') return m.status === 'expired';
    if (filter === 'new') return new Date(m.created_at) >= monthStart;
    return true;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">My Members</h1>
            <p className="text-muted-foreground">Members attributed to you</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring in 7 days</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="new">New this month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={[
            { key: 'profiles', label: 'Name', render: (v) => v?.full_name || '—' },
            { key: 'profiles', label: 'Contact', render: (v) => v?.phone || v?.email || '—' },
            { key: 'plan_name', label: 'Plan' },
            { key: 'start_at', label: 'Start', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'end_at', label: 'End', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'renewal_count', label: 'Renewals' },
          ]}
          data={filtered}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default TrainerMembers;
