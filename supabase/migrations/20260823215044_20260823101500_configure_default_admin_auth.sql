-- Connect the requested admin account to Supabase Auth without storing plaintext credentials.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
  );
$$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin,
  is_sso_user, is_anonymous
)
SELECT
  gen_random_uuid(), 'authenticated', 'authenticated', 'leoebehigmail.com',
  crypt('Leonard112233@', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Admin","role":"admin"}'::jsonb,
  now(), now(), false, false, false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower('leoebehigmail.com'));

UPDATE public.profiles p
SET role = 'admin', full_name = 'Admin'
FROM auth.users u
WHERE p.id = u.id AND lower(u.email) = lower('leoebehigmail.com');
