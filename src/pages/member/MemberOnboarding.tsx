import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logo from '@/assets/anyfeast-logo.png';
import {
  ArrowRight, ArrowLeft, Check, Cake, Ruler, Weight,
  Target, Zap, Activity, Leaf, AlertTriangle, ChefHat,
  Wallet, Heart, Sparkles, Star
} from 'lucide-react';

const TOTAL_STEPS = 8;

const MEMES = [
  { emoji: '🍕', text: "Don't worry, pizza is basically a vegetable… right?" },
  { emoji: '💪', text: "You're already stronger than your excuses!" },
  { emoji: '🥦', text: "Broccoli called. It wants to be in your meal plan." },
  { emoji: '🏋️', text: "Skipping leg day? Not on our watch!" },
  { emoji: '🥑', text: "Avocados: expensive but worth every bite." },
  { emoji: '🔥', text: "You're on fire! (Not literally. Stay hydrated.)" },
  { emoji: '🍳', text: "Egg-cellent progress so far!" },
  { emoji: '🎯', text: "Almost there! Your personalised plate awaits." },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CUISINES = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'Thai', 'Mediterranean', 'Continental', 'Korean', 'Middle Eastern'];
const HEALTH_GOALS = ['Weight Loss', 'Muscle Gain', 'Heart Health', 'Diabetes Management', 'Better Digestion', 'Increased Energy', 'Better Sleep', 'Immunity Boost'];
const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat/Gluten', 'Shellfish', 'Fish', 'Sesame'];

interface OnboardingData {
  date_of_birth: string;
  gender: string;
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number;
  weight_loss_pace: string;
  activity_level: string;
  diet_type: string;
  veg_days: string[];
  non_veg_days: string[];
  allergies: string[];
  dislikes: string;
  preferred_cuisines: string[];
  health_goals: string[];
  culinary_skill: string;
  cooking_frequency: string;
  cooking_setup: string;
  weekly_food_budget: number;
}

const MemberOnboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    date_of_birth: '',
    gender: '',
    height_cm: 165,
    weight_kg: 70,
    target_weight_kg: 65,
    weight_loss_pace: '',
    activity_level: '',
    diet_type: '',
    veg_days: [],
    non_veg_days: [],
    allergies: [],
    dislikes: '',
    preferred_cuisines: [],
    health_goals: [],
    culinary_skill: '',
    cooking_frequency: '',
    cooking_setup: '',
    weekly_food_budget: 2000,
  });

  const age = useMemo(() => {
    if (!data.date_of_birth) return null;
    const today = new Date();
    const birth = new Date(data.date_of_birth);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [data.date_of_birth]);

  const weightDiff = data.target_weight_kg - data.weight_kg;

  const update = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: keyof OnboardingData, item: string) => {
    setData(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] };
    });
  };

  const next = () => { if (step < TOTAL_STEPS) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('member_onboarding').upsert({
        user_id: user.id,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        target_weight_kg: data.target_weight_kg,
        weight_loss_pace: data.weight_loss_pace || null,
        activity_level: data.activity_level || null,
        diet_type: data.diet_type || null,
        veg_days: data.veg_days,
        non_veg_days: data.non_veg_days,
        allergies: data.allergies,
        dislikes: data.dislikes ? data.dislikes.split(',').map(s => s.trim()) : [],
        preferred_cuisines: data.preferred_cuisines,
        health_goals: data.health_goals,
        culinary_skill: data.culinary_skill || null,
        cooking_frequency: data.cooking_frequency || null,
        cooking_setup: data.cooking_setup || null,
        weekly_food_budget: data.weekly_food_budget,
        onboarding_completed: true,
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Welcome to AnyFeast! 🎉 Your personalised plate is being prepared.');
      navigate('/member', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
    setSaving(false);
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const OptionButton = ({ selected, onClick, children, className = '' }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
        selected
          ? 'border-secondary bg-brand-light-green text-foreground shadow-md scale-[1.02]'
          : 'border-border bg-card text-foreground hover:border-muted-foreground hover:bg-muted'
      } ${className}`}
    >
      {children}
    </button>
  );

  const ChipToggle = ({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (item: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selected.includes(item)
              ? 'bg-secondary text-secondary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {selected.includes(item) && <Check className="inline h-3 w-3 mr-1" />}
          {item}
        </button>
      ))}
    </div>
  );

  const meme = MEMES[step - 1];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="p-4 flex items-center justify-between border-b border-border bg-card">
        <img src={logo} alt="AnyFeast" className="h-8" />
        <span className="text-sm text-muted-foreground font-medium">Step {step}/{TOTAL_STEPS}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Meme banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="text-center p-4 rounded-xl bg-brand-light-green border border-secondary/20"
              >
                <span className="text-3xl">{meme.emoji}</span>
                <p className="text-sm text-foreground/70 mt-1 italic">"{meme.text}"</p>
              </motion.div>

              {/* Step 1: DOB, Age, Gender */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Cake className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl">Let's get to know you!</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={data.date_of_birth}
                      onChange={e => update('date_of_birth', e.target.value)}
                      className="h-12"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {age !== null && age > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-semibold text-secondary"
                      >
                        🎂 You're {age} years old — great age to start eating smarter!
                      </motion.p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <OptionButton key={g} selected={data.gender === g} onClick={() => update('gender', g)}>
                          {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '🧑'} {g}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Height & Weight */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl">Your body stats</h2>
                  </div>
                  <div className="space-y-3">
                    <Label>Height: <span className="text-secondary font-bold">{data.height_cm} cm</span></Label>
                    <input
                      type="range" min={100} max={220} step={1}
                      value={data.height_cm}
                      onChange={e => update('height_cm', Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-secondary"
                      style={{ background: `linear-gradient(to right, hsl(145 50% 38%) ${((data.height_cm - 100) / 120) * 100}%, hsl(0 0% 88%) ${((data.height_cm - 100) / 120) * 100}%)` }}
                    />
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number" min={100} max={220} value={data.height_cm}
                        onChange={e => update('height_cm', Number(e.target.value))}
                        className="w-24 h-10"
                      />
                      <span className="text-sm text-muted-foreground">cm</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Weight: <span className="text-secondary font-bold">{data.weight_kg} kg</span></Label>
                    <input
                      type="range" min={30} max={200} step={0.5}
                      value={data.weight_kg}
                      onChange={e => update('weight_kg', Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-secondary"
                      style={{ background: `linear-gradient(to right, hsl(145 50% 38%) ${((data.weight_kg - 30) / 170) * 100}%, hsl(0 0% 88%) ${((data.weight_kg - 30) / 170) * 100}%)` }}
                    />
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number" min={30} max={200} step={0.5} value={data.weight_kg}
                        onChange={e => update('weight_kg', Number(e.target.value))}
                        className="w-24 h-10"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Target Weight */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl">What's your goal weight?</h2>
                  </div>
                  <div className="space-y-3">
                    <Label>Target Weight: <span className="text-secondary font-bold">{data.target_weight_kg} kg</span></Label>
                    <input
                      type="range" min={30} max={200} step={0.5}
                      value={data.target_weight_kg}
                      onChange={e => update('target_weight_kg', Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-secondary"
                      style={{ background: `linear-gradient(to right, hsl(145 50% 38%) ${((data.target_weight_kg - 30) / 170) * 100}%, hsl(0 0% 88%) ${((data.target_weight_kg - 30) / 170) * 100}%)` }}
                    />
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number" min={30} max={200} step={0.5} value={data.target_weight_kg}
                        onChange={e => update('target_weight_kg', Number(e.target.value))}
                        className="w-24 h-10"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>
                  {data.weight_kg > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl text-center font-semibold text-lg ${
                        weightDiff < 0 ? 'bg-brand-light-green text-secondary' :
                        weightDiff > 0 ? 'bg-brand-pink text-primary' :
                        'bg-muted text-foreground'
                      }`}
                    >
                      {weightDiff < 0 && `📉 You want to lose ${Math.abs(weightDiff).toFixed(1)} kg — let's do it!`}
                      {weightDiff > 0 && `📈 You want to gain ${weightDiff.toFixed(1)} kg — bulk mode ON! 💪`}
                      {weightDiff === 0 && `⚖️ Maintain your current weight — balanced king/queen! 👑`}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 4: Weight Loss Pace + Activity Level */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl">Your pace & activity</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>How fast do you want to reach your goal?</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { v: 'slow', label: '🐢 Slow & Steady', desc: '0.25 kg/week' },
                        { v: 'moderate', label: '🚶 Moderate', desc: '0.5 kg/week' },
                        { v: 'fast', label: '🏃 Fast', desc: '0.75 kg/week' },
                        { v: 'aggressive', label: '🚀 Aggressive', desc: '1 kg/week' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.weight_loss_pace === opt.v} onClick={() => update('weight_loss_pace', opt.v)}>
                          <div className="text-left">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-muted-foreground ml-2 text-xs">({opt.desc})</span>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>How active are you?</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { v: 'sedentary', label: '🛋️ Sedentary', desc: 'Desk job, little exercise' },
                        { v: 'light', label: '🚶 Lightly Active', desc: '1-3 days/week' },
                        { v: 'moderate', label: '🏋️ Moderately Active', desc: '3-5 days/week' },
                        { v: 'active', label: '💪 Very Active', desc: '6-7 days/week' },
                        { v: 'athlete', label: '🏆 Athlete', desc: 'Twice a day training' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.activity_level === opt.v} onClick={() => update('activity_level', opt.v)}>
                          <div className="text-left">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-muted-foreground ml-2 text-xs">({opt.desc})</span>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Diet Type + Veg/Non-veg days */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-secondary" />
                    <h2 className="text-2xl">Your diet preference</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>What kind of eater are you?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'veg', label: '🥗 Vegetarian' },
                        { v: 'non_veg', label: '🍗 Non-Veg' },
                        { v: 'vegan', label: '🌱 Vegan' },
                        { v: 'jain', label: '🙏 Jain' },
                        { v: 'eggetarian', label: '🥚 Eggetarian' },
                        { v: 'flexitarian', label: '🔄 Flexitarian' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.diet_type === opt.v} onClick={() => update('diet_type', opt.v)}>
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  {(data.diet_type === 'non_veg' || data.diet_type === 'flexitarian') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                      <Label>Which days do you eat veg? 🥬</Label>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map(d => (
                          <button key={d} type="button" onClick={() => toggleArray('veg_days', d)}
                            className={`w-11 h-11 rounded-full text-xs font-bold transition-all duration-200 ${
                              data.veg_days.includes(d)
                                ? 'bg-secondary text-secondary-foreground shadow-md'
                                : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                      <Label>Which days do you eat non-veg? 🍖</Label>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map(d => (
                          <button key={d} type="button" onClick={() => toggleArray('non_veg_days', d)}
                            className={`w-11 h-11 rounded-full text-xs font-bold transition-all duration-200 ${
                              data.non_veg_days.includes(d)
                                ? 'bg-accent text-accent-foreground shadow-md'
                                : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 6: Allergies & Dislikes */}
              {step === 6 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-accent" />
                    <h2 className="text-2xl">Allergies & Dislikes</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>Any food allergies? (tap to select)</Label>
                    <ChipToggle items={COMMON_ALLERGIES} selected={data.allergies} onToggle={item => toggleArray('allergies', item)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Foods you dislike (comma-separated)</Label>
                    <Input
                      placeholder="e.g. bitter gourd, mushroom, olives"
                      value={data.dislikes}
                      onChange={e => update('dislikes', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              {/* Step 7: Cuisine & Health Goals */}
              {step === 7 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl">Taste & Health Goals</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred cuisine types</Label>
                    <ChipToggle items={CUISINES} selected={data.preferred_cuisines} onToggle={item => toggleArray('preferred_cuisines', item)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Health goals</Label>
                    <ChipToggle items={HEALTH_GOALS} selected={data.health_goals} onToggle={item => toggleArray('health_goals', item)} />
                  </div>
                </div>
              )}

              {/* Step 8: Cooking + Budget */}
              {step === 8 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-6 w-6 text-secondary" />
                    <h2 className="text-2xl">Your kitchen game</h2>
                  </div>
                  <div className="space-y-2">
                    <Label>Culinary skills</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: 'beginner', label: '🔰 Beginner' },
                        { v: 'intermediate', label: '👨‍🍳 Intermediate' },
                        { v: 'advanced', label: '⭐ Advanced' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.culinary_skill === opt.v} onClick={() => update('culinary_skill', opt.v)}>
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>How often do you cook?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'daily', label: '🍳 Every day' },
                        { v: 'few_times_week', label: '📅 Few times/week' },
                        { v: 'weekends', label: '🏖️ Weekends only' },
                        { v: 'rarely', label: '🛒 Rarely' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.cooking_frequency === opt.v} onClick={() => update('cooking_frequency', opt.v)}>
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cooking setup</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: 'basic', label: '🔥 Basic' },
                        { v: 'moderate', label: '🍽️ Moderate' },
                        { v: 'full', label: '🏠 Full Kitchen' },
                      ].map(opt => (
                        <OptionButton key={opt.v} selected={data.cooking_setup === opt.v} onClick={() => update('cooking_setup', opt.v)}>
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Weekly food budget: <span className="text-secondary font-bold">₹{data.weekly_food_budget}</span>
                    </Label>
                    <input
                      type="range" min={500} max={10000} step={100}
                      value={data.weekly_food_budget}
                      onChange={e => update('weekly_food_budget', Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-secondary"
                      style={{ background: `linear-gradient(to right, hsl(145 50% 38%) ${((data.weekly_food_budget - 500) / 9500) * 100}%, hsl(0 0% 88%) ${((data.weekly_food_budget - 500) / 9500) * 100}%)` }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹500</span><span>₹10,000</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prev} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <Button
                onClick={next}
                className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={saving}
                className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 shadow-lg"
              >
                {saving ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary-foreground border-t-transparent" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get My Meal Plan
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Step dots */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i + 1)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 === step ? 'w-6 bg-secondary' : i + 1 < step ? 'w-2 bg-secondary/50' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOnboarding;
