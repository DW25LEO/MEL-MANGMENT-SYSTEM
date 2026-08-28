-- RPC function to create a new admin user with hashed password
CREATE OR REPLACE FUNCTION create_admin_user(p_email text, p_password text, p_full_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_users (email, password_hash, full_name, role)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_full_name, 'super-admin')
  ON CONFLICT (email) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text) TO anon, authenticated;
