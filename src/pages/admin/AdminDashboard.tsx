import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { Dumbbell, Users, CreditCard, Ticket, BarChart3, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ gyms: 0, trainers: 0, licenses: 0, members: 0, activeSubs: 0, coupons: 0 });
  const [recentGyms, setRecentGyms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [gyms, trainers, pools, links, subs, coupons] = await Promise.all([
        supabase.from('gyms').select('*', { count: 'exact' }),
        supabase.from('trainers').select('*', { count: 'exact' }),
        supabase.from('license_pools').select('quantity, redeemed'),
        supabase.from('member_gym_links').select('*', { count: 'exact' }),
        supabase.from('subscriptions').select('*', { count: 'exact' }).eq('status', 'active'),
        supabase.from('coupons').select('*', { count: 'exact' }),
      ]);

      const totalLicenses = pools.data?.reduce((a, p) => a + (p.quantity || 0), 0) || 0;

      setStats({
        gyms: gyms.count || 0,
        trainers: trainers.count || 0,
        licenses: totalLicenses,
        members: links.count || 0,
        activeSubs: subs.count || 0,
        coupons: coupons.count || 0,
      });

      setRecentGyms(gyms.data?.slice(0, 10) || []);
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Overview of the entire AnyFeast gym network</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Gyms" value={stats.gyms} icon={Dumbbell} variant="crimson" />
          <StatCard title="Total Trainers" value={stats.trainers} icon={Users} variant="orange" />
          <StatCard title="Total Licenses" value={stats.licenses} icon={CreditCard} variant="yellow" />
          <StatCard title="Active Members" value={stats.members} icon={Users} />
          <StatCard title="Active Subscriptions" value={stats.activeSubs} icon={Award} />
          <StatCard title="Coupons Created" value={stats.coupons} icon={Ticket} />
        </div>

        <h2 className="text-xl font-display font-bold mb-4">Recent Gyms</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Gym Name' },
            { key: 'branch', label: 'Branch' },
            { key: 'city', label: 'City' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'created_at', label: 'Created', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={recentGyms}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
