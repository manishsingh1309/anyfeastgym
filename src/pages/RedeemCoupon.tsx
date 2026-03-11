import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '@/assets/anyfeast-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, CheckCircle, AlertCircle } from 'lucide-react';

const RedeemCoupon: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('redeem_coupon', {
        p_code: code.trim(),
      });

      if (error) throw error;

      const result = data as { ok: boolean; reason?: string; subscription_id?: string };

      if (!result.ok) {
        toast.error(result.reason || 'Redemption failed');
        setResult('error');
        setIsLoading(false);
        return;
      }

      toast.success('Subscription activated! 🎉');
      setResult('success');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      setResult('error');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <img src={logo} alt="AnyFeast" className="h-12 w-auto" />
        </div>

        {result === 'success' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">You're In! 🎉</h2>
            <p className="text-muted-foreground mb-6">Your subscription has been activated successfully.</p>
            <Button onClick={() => navigate('/member')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Go to Dashboard
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary mb-4">
                <Ticket className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Redeem Coupon</h2>
              <p className="text-muted-foreground">Enter your trainer's coupon code to activate your subscription</p>
            </div>

            {result === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">Please try a different code</p>
              </div>
            )}

            <form onSubmit={handleRedeem} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  placeholder="ENTER-CODE"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); }}
                  required
                  className="h-14 text-center text-xl tracking-widest font-mono uppercase"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold" disabled={isLoading}>
                {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary-foreground border-t-transparent" /> : 'Redeem Now'}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RedeemCoupon;
