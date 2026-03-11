import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('*, user_roles(role)').order('created_at', { ascending: false })
      .then(({ data }) => setUsers(data || []));
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Users</h1>
        <p className="text-muted-foreground mb-6">All registered users</p>
        <DataTable
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'user_roles', label: 'Roles', render: (v) => (v || []).map((r: any) => r.role).join(', ') || 'member' },
            { key: 'created_at', label: 'Joined', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={users}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminUsers;
