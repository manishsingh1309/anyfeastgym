
CREATE OR REPLACE FUNCTION public.redeem_coupon(p_code text, p_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon coupons%rowtype;
  v_pool license_pools%rowtype;
  v_existing_sub uuid;
  v_end_at timestamptz;
  v_sub_id uuid;
  v_rule commission_rules%rowtype;
BEGIN
  -- Lock and fetch coupon
  SELECT * INTO v_coupon
    FROM coupons
    WHERE code = upper(trim(p_code)) AND status = 'active'
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'Invalid or expired coupon code');
  END IF;

  -- Check max redemptions
  IF v_coupon.redemptions >= v_coupon.max_redemptions THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'This coupon has been fully redeemed');
  END IF;

  -- Check expiry
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'This coupon has expired');
  END IF;

  -- Check license pool
  IF v_coupon.pool_id IS NOT NULL THEN
    SELECT * INTO v_pool
      FROM license_pools
      WHERE id = v_coupon.pool_id
      FOR UPDATE;

    IF v_pool.redeemed >= v_pool.quantity THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'No licenses available');
    END IF;
  END IF;

  -- Check duplicate active subscription
  SELECT id INTO v_existing_sub
    FROM subscriptions
    WHERE member_id = p_member_id
      AND gym_id = v_coupon.gym_id
      AND status = 'active'
    LIMIT 1;

  IF v_existing_sub IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'You already have an active subscription at this gym');
  END IF;

  -- Create subscription
  v_end_at := now() + interval '1 month';
  INSERT INTO subscriptions (member_id, plan_name, end_at, gym_id, trainer_id, coupon_id)
    VALUES (
      p_member_id,
      COALESCE(v_pool.plan_name, 'Standard'),
      v_end_at,
      v_coupon.gym_id,
      v_coupon.trainer_id,
      v_coupon.id
    )
    RETURNING id INTO v_sub_id;

  -- Increment coupon redemptions
  UPDATE coupons SET redemptions = redemptions + 1 WHERE id = v_coupon.id;

  -- Increment license pool redeemed
  IF v_coupon.pool_id IS NOT NULL THEN
    UPDATE license_pools SET redeemed = redeemed + 1 WHERE id = v_coupon.pool_id;
  END IF;

  -- Create member gym link
  INSERT INTO member_gym_links (member_id, gym_id, trainer_id)
    VALUES (p_member_id, v_coupon.gym_id, v_coupon.trainer_id)
    ON CONFLICT DO NOTHING;

  -- Log commission event
  IF v_coupon.trainer_id IS NOT NULL THEN
    SELECT * INTO v_rule
      FROM commission_rules
      WHERE gym_id = v_coupon.gym_id
        AND (trainer_id = v_coupon.trainer_id OR trainer_id IS NULL)
      ORDER BY trainer_id NULLS LAST
      LIMIT 1;

    IF FOUND THEN
      INSERT INTO commission_events (gym_id, trainer_id, event_type, amount, subscription_id)
        VALUES (v_coupon.gym_id, v_coupon.trainer_id, 'activation', v_rule.activation_amount, v_sub_id);
    END IF;
  END IF;

  RETURN jsonb_build_object('ok', true, 'subscription_id', v_sub_id);
END;
$$;
