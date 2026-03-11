
-- Update handle_new_user to auto-assign super_admin for the designated admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role app_role;
BEGIN
  IF NEW.email = 'admin@anyfeast.in' THEN
    v_role := 'super_admin';
  ELSE
    v_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::app_role,
      'member'
    );
    IF v_role = 'super_admin' THEN
      v_role := 'member';
    END IF;
  END IF;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;

-- If the user already exists, ensure they have super_admin role
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'admin@anyfeast.in' LIMIT 1;
  IF v_uid IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = v_uid;
    INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'super_admin');
  END IF;
END;
$$;
