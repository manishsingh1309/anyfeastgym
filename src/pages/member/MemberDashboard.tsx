import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Award, FileText, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);
  const [plans, setPlans] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: subData } = await supabase.from('subscriptions').select('*, gyms(name)').eq('member_id', user.id);
      setSubs(subData || []);
      const { count } = await supabase.from('nutrition_plan_assignments').select('*', { count: 'exact' }).eq('assigned_to_member_id', user.id);
      setPlans(count || 0);
    };
    fetch();
  }, [user]);

  const activeSub = subs.find(s => s.status === 'active');

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Welcome! 🎉</h1>
        <p className="text-muted-foreground mb-6">Your AnyFeast membership overview</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Active Subscription" value={activeSub ? 'Yes' : 'No'} icon={Award} variant={activeSub ? 'crimson' : 'default'} />
          <StatCard title="Nutrition Plans" value={plans} icon={FileText} variant="orange" />
          <StatCard title="Gym" value={activeSub?.gyms?.name || 'None'} icon={Dumbbell} variant="yellow" />
        </div>

        {activeSub && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-xl font-display font-bold mb-4">Current Subscription</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-sm text-muted-foreground">Plan</p><p className="font-semibold">{activeSub.plan_name}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={activeSub.status} /></div>
              <div><p className="text-sm text-muted-foreground">Start</p><p className="font-semibold">{new Date(activeSub.start_at).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-muted-foreground">End</p><p className="font-semibold">{new Date(activeSub.end_at).toLocaleDateString()}</p></div>
            </div>
          </div>
        )}

        {!activeSub && (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-display font-bold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground">Ask your trainer for a coupon code to get started!</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default MemberDashboard;
