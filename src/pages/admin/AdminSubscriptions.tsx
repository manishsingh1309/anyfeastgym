import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const AdminSubscriptions: React.FC = () => {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('subscriptions').select('*, gyms(name), trainers(name), profiles!subscriptions_member_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setSubs(data || []));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Subscriptions</h1>
        <p className="text-muted-foreground mb-6">All member subscriptions</p>
        <DataTable
          columns={[
            { key: 'profiles', label: 'Member', render: (v) => v?.full_name || v?.email || '—' },
            { key: 'plan_name', label: 'Plan' },
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || '—' },
            { key: 'start_at', label: 'Start', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'end_at', label: 'End', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'renewal_count', label: 'Renewals' },
          ]}
          data={subs}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSubscriptions;
