CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  v_role app_role;
BEGIN
  -- Read role from signup metadata, default to 'member'
  v_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'member'
  );

  -- Only allow self-selection of member, trainer, gym_owner (not super_admin)
  IF v_role = 'super_admin' THEN
    v_role := 'member';
  END IF;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;