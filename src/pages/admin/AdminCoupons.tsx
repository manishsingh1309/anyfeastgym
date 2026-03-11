import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('coupons').select('*, gyms(name), trainers(name)').order('created_at', { ascending: false })
      .then(({ data }) => setCoupons(data || []));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Coupons</h1>
        <p className="text-muted-foreground mb-6">All coupons across the network</p>
        <DataTable
          columns={[
            { key: 'code', label: 'Code', render: (v) => <span className="font-mono font-bold">{v}</span> },
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || 'Gym-wide' },
            { key: 'coupon_type', label: 'Type', render: (v) => v?.replace('_', ' ') },
            { key: 'redemptions', label: 'Used', render: (v, row) => `${v}/${row.max_redemptions}` },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
          ]}
          data={coupons}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminCoupons;
