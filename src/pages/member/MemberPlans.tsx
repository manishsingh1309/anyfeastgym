import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const MemberPlans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('nutrition_plan_assignments')
      .select('*, nutrition_plan_assets(*)')
      .eq('assigned_to_member_id', user.id)
      .then(({ data }) => setPlans(data || []));
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">My Nutrition Plans</h1>
        <p className="text-muted-foreground mb-6">Plans shared with you</p>
        <DataTable
          columns={[
            { key: 'nutrition_plan_assets', label: 'Title', render: (v) => v?.title || '—' },
            { key: 'nutrition_plan_assets', label: 'Goal', render: (v) => v?.goal_tag || '—' },
            { key: 'nutrition_plan_assets', label: 'Duration', render: (v) => v?.duration || '—' },
            { key: 'nutrition_plan_assets', label: 'View', render: (v) => v?.file_url ? <a href={v.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Open PDF</a> : '—' },
          ]}
          data={plans}
          emptyMessage="No nutrition plans shared with you yet."
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default MemberPlans;
