import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, RefreshCw, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';

// ── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: 'Jan', activations: 45, renewals: 20, churns: 8 },
  { month: 'Feb', activations: 52, renewals: 25, churns: 6 },
  { month: 'Mar', activations: 61, renewals: 30, churns: 9 },
  { month: 'Apr', activations: 58, renewals: 35, churns: 7 },
  { month: 'May', activations: 74, renewals: 42, churns: 5 },
  { month: 'Jun', activations: 89, renewals: 50, churns: 10 },
  { month: 'Jul', activations: 95, renewals: 60, churns: 8 },
  { month: 'Aug', activations: 102, renewals: 70, churns: 12 },
  { month: 'Sep', activations: 87, renewals: 65, churns: 9 },
  { month: 'Oct', activations: 110, renewals: 80, churns: 7 },
  { month: 'Nov', activations: 125, renewals: 90, churns: 11 },
  { month: 'Dec', activations: 140, renewals: 100, churns: 6 },
];

const FUNNEL_DATA = [
  { step: 'Coupons Created', value: 520 },
  { step: 'Coupons Redeemed', value: 410 },
  { step: 'Subscriptions Activated', value: 340 },
  { step: 'First Meal Plan Created', value: 210 },
];

const TRAINER_PERFORMANCE = [
  { name: 'Rahul K', members: 48 },
  { name: 'Sneha M', members: 41 },
  { name: 'Arjun P', members: 37 },
  { name: 'Priya S', members: 32 },
  { name: 'Vikram R', members: 28 },
  { name: 'Anita D', members: 22 },
];

const GYM_COMPARISON = [
  { gym: 'UFC Andheri', sold: 200, active: 160, renewal: 75 },
  { gym: 'UFC Bandra', sold: 150, active: 110, renewal: 68 },
  { gym: 'UFC Powai', sold: 180, active: 140, renewal: 80 },
  { gym: 'UFC Thane', sold: 120, active: 90, renewal: 72 },
];

const AUDIT_LOG = [
  { ts: '2026-02-26 10:12', actor: 'Super Admin', action: 'Created gym UFC Andheri', status: 'Success' },
  { ts: '2026-02-26 10:45', actor: 'Owner • Ramesh', action: 'Added trainer Rahul K', status: 'Success' },
  { ts: '2026-02-26 11:03', actor: 'Trainer • Rahul K', action: 'Generated coupon UFC-2026-001', status: 'Success' },
  { ts: '2026-02-26 11:30', actor: 'Member • Aditya', action: 'Redeemed coupon UFC-2026-001', status: 'Success' },
  { ts: '2026-02-26 12:00', actor: 'Owner • Ramesh', action: 'Exported member roster CSV', status: 'Success' },
  { ts: '2026-02-26 13:15', actor: 'Trainer • Sneha M', action: 'Assigned nutrition plan to member Priya', status: 'Success' },
  { ts: '2026-02-26 14:00', actor: 'Super Admin', action: 'Updated commission rule for UFC Bandra', status: 'Success' },
  { ts: '2026-02-26 14:45', actor: 'Member • Karan', action: 'Coupon redemption failed — pool exhausted', status: 'Failed' },
  { ts: '2026-02-26 15:20', actor: 'Owner • Meena', action: 'Uploaded nutrition plan v2 PDF', status: 'Success' },
  { ts: '2026-02-26 16:00', actor: 'Trainer • Arjun P', action: 'Renewed subscription for member Rohit', status: 'Success' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h2 className="text-base font-display font-semibold mb-4 text-foreground">{title}</h2>
    {children}
  </div>
);

// Funnel built with plain divs (no external lib needed)
const FunnelChart: React.FC = () => {
  const max = FUNNEL_DATA[0].value;
  const colors = ['#B32024', '#EF3E2D', '#2F8F4E', '#43A047'];

  return (
    <div className="space-y-3">
      {FUNNEL_DATA.map((d, i) => (
        <div key={d.step}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{d.step}</span>
            <span className="font-medium">{d.value}</span>
          </div>
          <div className="h-8 rounded overflow-hidden bg-muted">
            <div
              className="h-full rounded transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: colors[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const AnalyticsContent: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-display font-bold mb-1">Analytics</h1>
    <p className="text-muted-foreground mb-6">Funnel metrics, KPIs & performance across the network</p>

    {/* Section B — KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="Activation Rate" value="82%" icon={TrendingUp} variant="crimson" />
      <StatCard title="Week 1 Retention" value="74%" icon={Users} variant="orange" />
      <StatCard title="Renewal Rate" value="68%" icon={RefreshCw} variant="yellow" />
      <StatCard title="Active Licenses" value={480} icon={Activity} />
    </div>

    {/* Section A — Funnel Chart */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SectionCard title="Conversion Funnel">
        <FunnelChart />
      </SectionCard>

      {/* Section D — Trainer Performance */}
      <SectionCard title="Trainer Performance Leaderboard">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={TRAINER_PERFORMANCE} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={72} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="members" name="Members Onboarded" fill="#B32024" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>

    {/* Section C — Subscription Growth */}
    <div className="mb-6">
      <SectionCard title="Subscription Growth (12 Months)">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={MONTHLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activations" name="New Activations" stroke="#B32024" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="renewals" name="Renewals" stroke="#2F8F4E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="churns" name="Churns" stroke="#EF3E2D" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>

    {/* Section E — Gym Comparison */}
    <div className="mb-6">
      <SectionCard title="Gym Comparison">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={GYM_COMPARISON}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="gym" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" name="Licenses Sold" fill="#B32024" radius={[4, 4, 0, 0]} />
            <Bar dataKey="active" name="Active Members" fill="#2F8F4E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="renewal" name="Renewal Rate (%)" fill="#43A047" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>

    {/* Section F — Audit Log */}
    <SectionCard title="Audit Log">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-left font-medium text-muted-foreground">Timestamp</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Actor</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Action</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">{row.ts}</td>
                <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{row.actor}</td>
                <td className="py-2.5 pr-4">{row.action}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === 'Success'
                        ? 'bg-[#E6F4EC] text-[#2F8F4E]'
                        : 'bg-[#FFC4C4] text-[#B32024]'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  </motion.div>
);

export default AnalyticsContent;
