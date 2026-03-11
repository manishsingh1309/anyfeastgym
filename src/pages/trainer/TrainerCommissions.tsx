import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const TrainerCommissions: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [totals, setTotals] = useState({ total: 0, thisMonth: 0, lastMonth: 0 });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: trainer } = await supabase.from('trainers').select('id').eq('user_id', user.id).limit(1).single();
      if (!trainer) return;
      const { data } = await supabase.from('commission_events').select('*').eq('trainer_id', trainer.id).order('created_at', { ascending: false });
      const allEvents = data || [];
      setEvents(allEvents);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setTotals({
        total: allEvents.reduce((s, e) => s + (e.amount || 0), 0),
        thisMonth: allEvents.filter(e => new Date(e.created_at) >= monthStart).reduce((s, e) => s + (e.amount || 0), 0),
        lastMonth: allEvents.filter(e => new Date(e.created_at) >= lastMonthStart && new Date(e.created_at) < monthStart).reduce((s, e) => s + (e.amount || 0), 0),
      });
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">My Commissions</h1>
        <p className="text-muted-foreground mb-6">Your earnings summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Lifetime" value={`₹${totals.total.toLocaleString()}`} icon={DollarSign} variant="crimson" />
          <StatCard title="This Month" value={`₹${totals.thisMonth.toLocaleString()}`} icon={TrendingUp} variant="orange" />
          <StatCard title="Last Month" value={`₹${totals.lastMonth.toLocaleString()}`} icon={BarChart3} variant="yellow" />
        </div>
        <DataTable
          columns={[
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

export default TrainerCommissions;
