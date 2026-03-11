import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminCommissions: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [totals, setTotals] = useState({ total: 0, thisMonth: 0, activations: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('commission_events')
        .select('*, gyms(name), trainers(name)')
        .order('created_at', { ascending: false });
      
      const allEvents = data || [];
      setEvents(allEvents);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setTotals({
        total: allEvents.reduce((s, e) => s + (e.amount || 0), 0),
        thisMonth: allEvents.filter(e => new Date(e.created_at) >= monthStart).reduce((s, e) => s + (e.amount || 0), 0),
        activations: allEvents.filter(e => e.event_type === 'activation').length,
      });
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Commissions</h1>
        <p className="text-muted-foreground mb-6">Commission tracking & ledger</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Commissions" value={`₹${totals.total.toLocaleString()}`} icon={DollarSign} variant="crimson" />
          <StatCard title="This Month" value={`₹${totals.thisMonth.toLocaleString()}`} icon={TrendingUp} variant="orange" />
          <StatCard title="Activations" value={totals.activations} icon={BarChart3} variant="yellow" />
        </div>

        <DataTable
          columns={[
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || '—' },
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
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

export default AdminCommissions;
