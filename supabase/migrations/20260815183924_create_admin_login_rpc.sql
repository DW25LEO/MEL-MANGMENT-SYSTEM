-- RPC function to verify admin login credentials
-- Returns admin user row if credentials match, empty array otherwise

CREATE OR REPLACE FUNCTION verify_admin_login(p_email text, p_password text)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.full_name, a.role, a.is_active
  FROM admin_users a
  WHERE a.email = p_email
    AND a.password_hash = crypt(p_password, a.password_hash)
    AND a.is_active = true;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION verify_admin_login(text, text) TO anon, authenticated;
