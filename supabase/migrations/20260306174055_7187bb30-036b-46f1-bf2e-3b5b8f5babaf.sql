
-- Member onboarding health/diet profile
CREATE TABLE public.member_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  date_of_birth date,
  gender text,
  height_cm numeric,
  weight_kg numeric,
  target_weight_kg numeric,
  weight_loss_pace text,
  activity_level text,
  diet_type text,
  veg_days text[] DEFAULT '{}',
  non_veg_days text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  dislikes text[] DEFAULT '{}',
  preferred_cuisines text[] DEFAULT '{}',
  health_goals text[] DEFAULT '{}',
  culinary_skill text,
  cooking_frequency text,
  cooking_setup text,
  weekly_food_budget numeric,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.member_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own onboarding" ON public.member_onboarding
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins view all onboarding" ON public.member_onboarding
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_member_onboarding_updated_at
  BEFORE UPDATE ON public.member_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
