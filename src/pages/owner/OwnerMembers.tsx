import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const OwnerMembers: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_user_id', user.id).limit(1).single();
      if (!gym) return;
      const { data } = await supabase.from('member_gym_links')
        .select('*, profiles!member_gym_links_member_id_fkey(full_name, email, phone), trainers(name), subscriptions!inner(status, plan_name, start_at, end_at, renewal_count)')
        .eq('gym_id', gym.id);
      setMembers(data || []);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Members</h1>
        <p className="text-muted-foreground mb-6">All members at your gym</p>
        <DataTable
          columns={[
            { key: 'profiles', label: 'Name', render: (v) => v?.full_name || '—' },
            { key: 'profiles', label: 'Email', render: (v) => v?.email || '—' },
            { key: 'trainers', label: 'Trainer', render: (v) => v?.name || '—' },
            { key: 'joined_at', label: 'Joined', render: (v) => new Date(v).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
          ]}
          data={members}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerMembers;
