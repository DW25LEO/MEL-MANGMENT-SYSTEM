/*
# Add server-authorized Super Admin dashboard statistics

The function derives the caller from `auth.uid()` and only returns counts to an authenticated profile whose role is `super-admin`.
*/

CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS TABLE (
  total_users bigint,
  total_courses bigint,
  total_schools bigint,
  total_sub_admins bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super-admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*) FROM auth.users),
    (SELECT count(*) FROM public.courses),
    (SELECT count(*) FROM public.schools),
    (SELECT count(*) FROM public.sub_admins);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_super_admin_stats() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_super_admin_stats() TO authenticated;
