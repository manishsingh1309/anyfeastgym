import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Ticket, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ members: 0, coupons: 0, commission: 0, expiringSoon: 0 });
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: trainer } = await supabase.from('trainers').select('id, gym_id').eq('user_id', user.id).limit(1).single();
      if (!trainer) return;
      const [subs, coupons, events] = await Promise.all([
        supabase.from('subscriptions').select('*, profiles!subscriptions_member_id_fkey(full_name, email)').eq('trainer_id', trainer.id),
        supabase.from('coupons').select('*', { count: 'exact' }).eq('trainer_id', trainer.id),
        supabase.from('commission_events').select('amount').eq('trainer_id', trainer.id),
      ]);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expiring = subs.data?.filter(s => s.status === 'active' && new Date(s.end_at) <= weekFromNow).length || 0;

      setStats({
        members: subs.data?.length || 0,
        coupons: coupons.count || 0,
        commission: events.data?.reduce((s, e) => s + (e.amount || 0), 0) || 0,
        expiringSoon: expiring,
      });
      setMembers(subs.data || []);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Trainer Dashboard</h1>
        <p className="text-muted-foreground mb-6">Your members and performance overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="My Members" value={stats.members} icon={Users} variant="crimson" />
          <StatCard title="Coupons Created" value={stats.coupons} icon={Ticket} variant="orange" />
          <StatCard title="Total Commission" value={`₹${stats.commission.toLocaleString()}`} icon={DollarSign} variant="yellow" />
          <StatCard title="Expiring Soon" value={stats.expiringSoon} subtitle="Within 7 days" icon={Award} />
        </div>
        <h2 className="text-xl font-display font-bold mb-4">My Members</h2>
        <DataTable
          columns={[
            { key: 'profiles', label: 'Name', render: (v) => v?.full_name || '—' },
            { key: 'plan_name', label: 'Plan' },
            { key: 'start_at', label: 'Start', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'end_at', label: 'End', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'renewal_count', label: 'Renewals' },
          ]}
          data={members}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;
