import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const MemberSubscription: React.FC = () => {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('subscriptions').select('*, gyms(name)').eq('member_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setSubs(data || []));
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-1">My Subscriptions</h1>
        <p className="text-muted-foreground mb-6">Your subscription history</p>
        <div className="space-y-4">
          {subs.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No subscriptions yet. Redeem a coupon to get started!</p>
            </div>
          )}
          {subs.map(sub => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-lg">{sub.plan_name}</h3>
                <StatusBadge status={sub.status} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-muted-foreground">Gym</p><p className="font-semibold">{sub.gyms?.name || '—'}</p></div>
                <div><p className="text-muted-foreground">Start</p><p className="font-semibold">{new Date(sub.start_at).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">End</p><p className="font-semibold">{new Date(sub.end_at).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">Renewals</p><p className="font-semibold">{sub.renewal_count}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MemberSubscription;
