import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => (
  <DashboardLayout>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account</p>
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
        <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-display font-bold mb-2">Settings Coming Soon</h3>
        <p className="text-muted-foreground">Account management and preferences will be available here.</p>
      </div>
    </motion.div>
  </DashboardLayout>
);

export default Settings;
