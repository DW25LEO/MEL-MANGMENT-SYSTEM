/*
# Fix exam creation, school registration, and payment access

1. Exams
- Adds the missing Super Admin SELECT policy required by insert/update operations that return rows.

2. Schools and profiles
- Copies existing school records from the legacy institutions table into the managed schools table without creating new mock records.
- Stores the selected school on a student's profile during signup.

3. Payments
- Adds an authenticated user_id owner column.
- Removes public read/write policies and limits students to their own payments and Super Admins to management access.
*/

-- Super Admins need SELECT permission for insert(...).select() and update(...).select().
DROP POLICY IF EXISTS "super_admin_select_exams" ON public.exams;
CREATE POLICY "super_admin_select_exams" ON public.exams
  FOR SELECT TO authenticated USING (public.is_super_admin());

-- Preserve existing registered schools from the legacy institutions catalog.
INSERT INTO public.schools (name, type, created_at)
SELECT i.name, CASE WHEN i.type = 'school' THEN 'secondary' ELSE i.type END, COALESCE(i.created_at, now())
FROM public.institutions i
WHERE i.type = 'school'
  AND NOT EXISTS (SELECT 1 FROM public.schools s WHERE lower(s.name) = lower(i.name));

-- Save the selected school on new profiles created by signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, school_id, class_level)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NULLIF(NEW.raw_user_meta_data->>'school_id', '')::uuid,
    NULLIF(NEW.raw_user_meta_data->>'class_level', '')
  );
  RETURN NEW;
END;
$$;

-- Payment ownership and secure policies.
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.payments ALTER COLUMN user_id SET DEFAULT auth.uid();

UPDATE public.payments p
SET user_id = u.id
FROM auth.users u
WHERE p.user_id IS NULL AND lower(p.user_email) = lower(u.email);

DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_own" ON public.payments;
DROP POLICY IF EXISTS "payments_update_own" ON public.payments;

CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_super_admin());
CREATE POLICY "Users create own payments" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins update payments" ON public.payments
  FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super admins delete payments" ON public.payments
  FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments (user_id, created_at DESC);
