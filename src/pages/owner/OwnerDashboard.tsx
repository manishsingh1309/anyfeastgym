import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, CreditCard, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [gym, setGym] = useState<any>(null);
  const [stats, setStats] = useState({ trainers: 0, totalLicenses: 0, redeemed: 0, activeMembers: 0 });
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: gymData } = await supabase.from('gyms').select('*').eq('owner_user_id', user.id).limit(1).single();
      if (!gymData) return;
      setGym(gymData);

      const [t, pools, members] = await Promise.all([
        supabase.from('trainers').select('*').eq('gym_id', gymData.id),
        supabase.from('license_pools').select('quantity, redeemed').eq('gym_id', gymData.id),
        supabase.from('member_gym_links').select('*', { count: 'exact' }).eq('gym_id', gymData.id).eq('status', 'active'),
      ]);

      setTrainers(t.data || []);
      const totalL = pools.data?.reduce((a, p) => a + (p.quantity || 0), 0) || 0;
      const totalR = pools.data?.reduce((a, p) => a + (p.redeemed || 0), 0) || 0;

      setStats({
        trainers: t.data?.length || 0,
        totalLicenses: totalL,
        redeemed: totalR,
        activeMembers: members.count || 0,
      });
    };
    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">{gym?.name || 'Gym'} Dashboard</h1>
        <p className="text-muted-foreground mb-6">Your gym's overview and performance</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Trainers" value={stats.trainers} icon={Users} variant="crimson" />
          <StatCard title="Total Licenses" value={stats.totalLicenses} icon={CreditCard} variant="orange" />
          <StatCard title="Licenses Used" value={stats.redeemed} subtitle={`${stats.totalLicenses - stats.redeemed} remaining`} icon={TrendingUp} variant="yellow" />
          <StatCard title="Active Members" value={stats.activeMembers} icon={Award} />
        </div>

        <h2 className="text-xl font-display font-bold mb-4">Your Trainers</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
          ]}
          data={trainers}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
