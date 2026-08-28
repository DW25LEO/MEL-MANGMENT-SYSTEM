/* Replace broad management policies with explicit CRUD policies. */

DROP POLICY IF EXISTS "Super admins manage site settings" ON public.site_settings;
CREATE POLICY "super_admin_select_site_settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_site_settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage tertiary institutions" ON public.tertiary_institutions;
CREATE POLICY "super_admin_select_tertiary_institutions" ON public.tertiary_institutions FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_tertiary_institutions" ON public.tertiary_institutions FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_tertiary_institutions" ON public.tertiary_institutions FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_tertiary_institutions" ON public.tertiary_institutions FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage tertiary exams" ON public.tertiary_exams;
CREATE POLICY "super_admin_select_tertiary_exams" ON public.tertiary_exams FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_tertiary_exams" ON public.tertiary_exams FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_tertiary_exams" ON public.tertiary_exams FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_tertiary_exams" ON public.tertiary_exams FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage schools" ON public.schools;
CREATE POLICY "super_admin_select_schools" ON public.schools FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_schools" ON public.schools FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_schools" ON public.schools FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_schools" ON public.schools FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage backups" ON public.backups;
CREATE POLICY "super_admin_select_backups" ON public.backups FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_backups" ON public.backups FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_backups" ON public.backups FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_backups" ON public.backups FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins manage courses" ON public.courses;
CREATE POLICY "super_admin_select_courses" ON public.courses FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_courses" ON public.courses FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_courses" ON public.courses FOR DELETE TO authenticated USING (public.is_super_admin());
