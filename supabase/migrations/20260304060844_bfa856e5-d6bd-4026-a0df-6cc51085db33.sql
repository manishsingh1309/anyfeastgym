
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'gym_owner', 'trainer', 'member');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Gyms table
CREATE TABLE public.gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  branch TEXT,
  address TEXT,
  city TEXT,
  owner_user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- Trainers table
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- License pools
CREATE TABLE public.license_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  redeemed INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.license_pools ENABLE ROW LEVEL SECURITY;

-- Coupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id),
  code TEXT NOT NULL UNIQUE,
  coupon_type TEXT NOT NULL DEFAULT 'single_use' CHECK (coupon_type IN ('single_use', 'multi_use', 'gym_wide')),
  max_redemptions INTEGER NOT NULL DEFAULT 1,
  redemptions INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  pool_id UUID REFERENCES public.license_pools(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  source TEXT DEFAULT 'gym_onboarding',
  gym_id UUID REFERENCES public.gyms(id),
  trainer_id UUID REFERENCES public.trainers(id),
  coupon_id UUID REFERENCES public.coupons(id),
  renewal_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Commission rules
CREATE TABLE public.commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id),
  activation_type TEXT NOT NULL DEFAULT 'fixed' CHECK (activation_type IN ('fixed', 'percent')),
  activation_amount NUMERIC NOT NULL DEFAULT 0,
  renewal_type TEXT NOT NULL DEFAULT 'fixed' CHECK (renewal_type IN ('fixed', 'percent')),
  renewal_amount NUMERIC NOT NULL DEFAULT 0,
  cap_per_month NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

-- Commission events
CREATE TABLE public.commission_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id) NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('activation', 'renewal', 'refund', 'reversal')),
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.commission_events ENABLE ROW LEVEL SECURITY;

-- Nutrition plan assets
CREATE TABLE public.nutrition_plan_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  goal_tag TEXT,
  duration TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nutrition_plan_assets ENABLE ROW LEVEL SECURITY;

-- Nutrition plan assignments
CREATE TABLE public.nutrition_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.nutrition_plan_assets(id) ON DELETE CASCADE NOT NULL,
  assigned_to_trainer_id UUID REFERENCES public.trainers(id),
  assigned_to_member_id UUID REFERENCES auth.users(id),
  assigned_to_gym BOOLEAN DEFAULT false,
  viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nutrition_plan_assignments ENABLE ROW LEVEL SECURITY;

-- Member gym links
CREATE TABLE public.member_gym_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE (member_id, gym_id)
);
ALTER TABLE public.member_gym_links ENABLE ROW LEVEL SECURITY;

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON public.gyms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  -- Default role is member
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- user_roles: users can see their own roles, super admins see all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Super admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- gyms
CREATE POLICY "Super admins manage gyms" ON public.gyms FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners view own gyms" ON public.gyms FOR SELECT USING (owner_user_id = auth.uid());
CREATE POLICY "Trainers view their gyms" ON public.gyms FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trainers WHERE trainers.gym_id = gyms.id AND trainers.user_id = auth.uid())
);

-- trainers
CREATE POLICY "Super admins manage trainers" ON public.trainers FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners manage trainers" ON public.trainers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = trainers.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view own record" ON public.trainers FOR SELECT USING (user_id = auth.uid());

-- license_pools
CREATE POLICY "Super admins manage pools" ON public.license_pools FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners view pools" ON public.license_pools FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = license_pools.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view pools" ON public.license_pools FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trainers WHERE trainers.gym_id = license_pools.gym_id AND trainers.user_id = auth.uid())
);

-- coupons
CREATE POLICY "Super admins manage coupons" ON public.coupons FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = coupons.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers manage own coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.trainers WHERE trainers.id = coupons.trainer_id AND trainers.user_id = auth.uid())
);

-- subscriptions
CREATE POLICY "Super admins manage subs" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Members view own subs" ON public.subscriptions FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Gym owners view gym subs" ON public.subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = subscriptions.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view own member subs" ON public.subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trainers WHERE trainers.id = subscriptions.trainer_id AND trainers.user_id = auth.uid())
);

-- commission_rules
CREATE POLICY "Super admins manage rules" ON public.commission_rules FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners manage rules" ON public.commission_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = commission_rules.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view own rules" ON public.commission_rules FOR SELECT USING (
  trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
);

-- commission_events
CREATE POLICY "Super admins view events" ON public.commission_events FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners view events" ON public.commission_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = commission_events.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view own events" ON public.commission_events FOR SELECT USING (
  trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
);

-- nutrition_plan_assets
CREATE POLICY "Super admins manage plans" ON public.nutrition_plan_assets FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Gym owners manage plans" ON public.nutrition_plan_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = nutrition_plan_assets.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view gym plans" ON public.nutrition_plan_assets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trainers WHERE trainers.gym_id = nutrition_plan_assets.gym_id AND trainers.user_id = auth.uid())
);

-- nutrition_plan_assignments
CREATE POLICY "Super admins manage assignments" ON public.nutrition_plan_assignments FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Members view own assignments" ON public.nutrition_plan_assignments FOR SELECT USING (assigned_to_member_id = auth.uid());
CREATE POLICY "Trainers manage assignments" ON public.nutrition_plan_assignments FOR ALL USING (
  assigned_to_trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
);

-- member_gym_links
CREATE POLICY "Super admins manage links" ON public.member_gym_links FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Members view own links" ON public.member_gym_links FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Gym owners view links" ON public.member_gym_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = member_gym_links.gym_id AND gyms.owner_user_id = auth.uid())
);
CREATE POLICY "Trainers view own member links" ON public.member_gym_links FOR SELECT USING (
  trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
);

-- audit_log
CREATE POLICY "Super admins view audit" ON public.audit_log FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users view own audit" ON public.audit_log FOR SELECT USING (user_id = auth.uid());

-- Storage bucket for nutrition plans
INSERT INTO storage.buckets (id, name, public) VALUES ('nutrition-plans', 'nutrition-plans', false);

CREATE POLICY "Gym owners upload plans" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'nutrition-plans' AND public.has_role(auth.uid(), 'gym_owner')
);
CREATE POLICY "Authenticated users read plans" ON storage.objects FOR SELECT USING (
  bucket_id = 'nutrition-plans' AND auth.role() = 'authenticated'
);
