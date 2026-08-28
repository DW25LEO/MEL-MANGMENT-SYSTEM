/*
# Harden management table policies

1. Course visibility
- Removes the legacy policy that exposed every course to the public.
- Keeps public SELECT limited to rows where `is_published` is true.
- Removes direct authenticated INSERT, UPDATE, and DELETE access because administrator actions will use server-authorized functions.

2. Administrator credentials
- Removes broad authenticated CRUD policies from `admin_users`.
- Administrator credential rows are no longer directly readable or writable through the client data API.
- Existing login and administrator-management RPCs remain the intended server-side access path.

3. Data safety
- No rows, columns, or tables are deleted.
- This migration only changes access policies and is safe to re-run.
*/

DROP POLICY IF EXISTS "courses_select_public" ON public.courses;
DROP POLICY IF EXISTS "courses_insert_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_update_admin" ON public.courses;
DROP POLICY IF EXISTS "courses_delete_admin" ON public.courses;

DROP POLICY IF EXISTS "admin_users_select" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_insert" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_update" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_delete" ON public.admin_users;
