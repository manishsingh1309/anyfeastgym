import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-8">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
      <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
      <h1 className="text-3xl font-display font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
      <Link to="/">
        <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Go Home</Button>
      </Link>
    </motion.div>
  </div>
);

export default Unauthorized;
