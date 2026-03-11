import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerNutrition: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [gymId, setGymId] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', goal_tag: '', duration: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const { data: gym } = await supabase.from('gyms').select('id').eq('owner_user_id', user.id).limit(1).single();
    if (!gym) return;
    setGymId(gym.id);
    const { data } = await supabase.from('nutrition_plan_assets').select('*').eq('gym_id', gym.id).order('created_at', { ascending: false });
    setPlans(data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);

    const fileName = `${gymId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('nutrition-plans').upload(fileName, file);
    if (uploadError) { toast.error(uploadError.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from('nutrition-plans').getPublicUrl(fileName);

    const { error } = await supabase.from('nutrition_plan_assets').insert({
      ...form,
      gym_id: gymId,
      file_url: urlData.publicUrl,
    });

    if (error) { toast.error(error.message); setUploading(false); return; }
    toast.success('Nutrition plan uploaded!');
    setOpen(false);
    setForm({ title: '', goal_tag: '', duration: '' });
    setFile(null);
    setUploading(false);
    fetchData();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Nutrition Plans</h1>
            <p className="text-muted-foreground">Upload and manage PDF nutrition plans</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Upload className="mr-2 h-4 w-4" />Upload Plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Nutrition Plan</DialogTitle></DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div><Label>Goal Tag</Label><Input value={form.goal_tag} onChange={e => setForm({...form, goal_tag: e.target.value})} placeholder="e.g. Weight Loss, Muscle Gain" /></div>
                <div><Label>Duration</Label><Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 4 weeks" /></div>
                <div>
                  <Label>PDF File</Label>
                  <Input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Plan'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'goal_tag', label: 'Goal' },
            { key: 'duration', label: 'Duration' },
            { key: 'version', label: 'Version' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'created_at', label: 'Uploaded', render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={plans}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default OwnerNutrition;
