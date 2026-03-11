import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerCommissions: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_user_id', user.id).limit(1).single();
      if (!gym) return;
      const { data } = await supabase.from('commission_events')
        .select('*, trainers(name)')
        .eq('gym_id', gym.id)
        .order('created_at', { ascending: false });
      setEvents(data || []);
      setTotal((data || []).reduce((s, e) => s + (e.amount || 0), 0));
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Commission Summary</h1>
        <p className="text-muted-foreground mb-6">Track trainer commissions</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard title="Total Commissions" value={`₹${total.toLocaleString()}`} icon={DollarSign} variant="crimson" />
          <StatCard title="Events Logged" value={events.length} icon={BarChart3} variant="orange" />
        </div>

        <DataTable
          columns={[
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || '—' },
            { key: 'event_type', label: 'Type', render: (v) => <span className="capitalize">{v}</span> },
            { key: 'amount', label: 'Amount', render: (v) => `₹${v}` },
            { key: 'created_at', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={events}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerCommissions;
