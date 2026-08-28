/*
# Authorize Super Admin management operations

All management writes require an authenticated user whose public profile role is `super-admin`.
Password hashes remain server-generated through `create_sub_admin`; the browser never writes plaintext passwords to the table.
*/

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super-admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "Super admins manage site settings" ON public.site_settings;
CREATE POLICY "Super admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage tertiary institutions" ON public.tertiary_institutions;
CREATE POLICY "Super admins manage tertiary institutions" ON public.tertiary_institutions FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage tertiary exams" ON public.tertiary_exams;
CREATE POLICY "Super admins manage tertiary exams" ON public.tertiary_exams FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage schools" ON public.schools;
CREATE POLICY "Super admins manage schools" ON public.schools FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage backups" ON public.backups;
CREATE POLICY "Super admins manage backups" ON public.backups FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage courses" ON public.courses;
CREATE POLICY "Super admins manage courses" ON public.courses FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE OR REPLACE FUNCTION public.create_sub_admin(
  p_school_name text,
  p_login_link text,
  p_password text
)
RETURNS public.sub_admins
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE result public.sub_admins;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF length(trim(p_school_name)) < 2 OR length(p_password) < 8 THEN RAISE EXCEPTION 'Invalid sub-admin details'; END IF;
  INSERT INTO public.sub_admins (school_name, login_link, password_hash)
  VALUES (trim(p_school_name), trim(p_login_link), crypt(p_password, gen_salt('bf', 12)))
  RETURNING * INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.create_sub_admin(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_sub_admin(text, text, text) TO authenticated;
