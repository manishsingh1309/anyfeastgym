import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const TrainerNutrition: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: trainer } = await supabase.from('trainers').select('id, gym_id').eq('user_id', user.id).limit(1).single();
      if (!trainer) return;
      const { data } = await supabase.from('nutrition_plan_assets').select('*').eq('gym_id', trainer.gym_id).eq('status', 'active');
      setPlans(data || []);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Nutrition Plans</h1>
        <p className="text-muted-foreground mb-6">Plans available from your gym</p>
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'goal_tag', label: 'Goal' },
            { key: 'duration', label: 'Duration' },
            { key: 'file_url', label: 'View', render: (v) => <a href={v} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Open PDF</a> },
          ]}
          data={plans}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default TrainerNutrition;
