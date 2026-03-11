import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const AdminNutrition: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('nutrition_plan_assets').select('*, gyms(name)').order('created_at', { ascending: false })
      .then(({ data }) => setPlans(data || []));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Nutrition Plans</h1>
        <p className="text-muted-foreground mb-6">All uploaded nutrition plan PDFs</p>
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'gyms', label: 'Gym', render: (v) => v?.name || '—' },
            { key: 'goal_tag', label: 'Goal' },
            { key: 'duration', label: 'Duration' },
            { key: 'version', label: 'Version' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
          ]}
          data={plans}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminNutrition;
