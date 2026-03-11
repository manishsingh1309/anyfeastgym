import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const OwnerLicenses: React.FC = () => {
  const { user } = useAuth();
  const [pools, setPools] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_user_id', user.id).limit(1).single();
      if (!gym) return;
      const { data } = await supabase.from('license_pools').select('*').eq('gym_id', gym.id).order('created_at', { ascending: false });
      setPools(data || []);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">License Pools</h1>
        <p className="text-muted-foreground mb-6">Your gym's license allocations</p>
        <DataTable
          columns={[
            { key: 'plan_name', label: 'Plan' },
            { key: 'quantity', label: 'Total' },
            { key: 'redeemed', label: 'Redeemed' },
            { key: 'remaining', label: 'Remaining', render: (_, row) => {
              const rem = (row.quantity || 0) - (row.redeemed || 0);
              return <span className={rem <= 5 ? 'font-bold text-destructive' : ''}>{rem}</span>;
            }},
            { key: 'expires_at', label: 'Expires', render: (v) => v ? new Date(v).toLocaleDateString() : 'Never' },
          ]}
          data={pools}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerLicenses;
