/*
# Create institutions, courses, subjects, verification_codes, payments, and admin_users tables
*/

-- ── Institutions ──
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('school', 'university')),
  location text,
  contact_email text,
  contact_phone text,
  logo text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "institutions_select_public" ON institutions;
CREATE POLICY "institutions_select_public"
  ON institutions FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "institutions_insert_admin" ON institutions;
CREATE POLICY "institutions_insert_admin"
  ON institutions FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "institutions_update_admin" ON institutions;
CREATE POLICY "institutions_update_admin"
  ON institutions FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "institutions_delete_admin" ON institutions;
CREATE POLICY "institutions_delete_admin"
  ON institutions FOR DELETE TO authenticated
  USING (true);

-- ── Courses (for universities) ──
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  description text,
  credits int DEFAULT 3,
  level text,
  semester text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select_public" ON courses;
CREATE POLICY "courses_select_public"
  ON courses FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "courses_insert_admin" ON courses;
CREATE POLICY "courses_insert_admin"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "courses_update_admin" ON courses;
CREATE POLICY "courses_update_admin"
  ON courses FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "courses_delete_admin" ON courses;
CREATE POLICY "courses_delete_admin"
  ON courses FOR DELETE TO authenticated
  USING (true);

-- ── Subjects (for schools) ──
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  level text,
  term text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subjects_select_public" ON subjects;
CREATE POLICY "subjects_select_public"
  ON subjects FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "subjects_insert_admin" ON subjects;
CREATE POLICY "subjects_insert_admin"
  ON subjects FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "subjects_update_admin" ON subjects;
CREATE POLICY "subjects_update_admin"
  ON subjects FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "subjects_delete_admin" ON subjects;
CREATE POLICY "subjects_delete_admin"
  ON subjects FOR DELETE TO authenticated
  USING (true);

-- ── Verification Codes (OTP) ──
CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  used boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verification_codes_insert_public" ON verification_codes;
CREATE POLICY "verification_codes_insert_public"
  ON verification_codes FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "verification_codes_select_own" ON verification_codes;
CREATE POLICY "verification_codes_select_own"
  ON verification_codes FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "verification_codes_update_own" ON verification_codes;
CREATE POLICY "verification_codes_update_own"
  ON verification_codes FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- ── Payments ──
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount numeric NOT NULL DEFAULT 2000,
  currency text DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  uses_remaining int DEFAULT 2,
  payment_method text,
  reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "payments_update_own" ON payments;
CREATE POLICY "payments_update_own"
  ON payments FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ── Admin Users (Super Admin) ──
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'super-admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select" ON admin_users;
CREATE POLICY "admin_users_select"
  ON admin_users FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_users_insert" ON admin_users;
CREATE POLICY "admin_users_insert"
  ON admin_users FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_users_update" ON admin_users;
CREATE POLICY "admin_users_update"
  ON admin_users FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_users_delete" ON admin_users;
CREATE POLICY "admin_users_delete"
  ON admin_users FOR DELETE TO authenticated
  USING (true);

-- ── Seed institutions ──
INSERT INTO institutions (name, type, location, contact_email, description) VALUES
  ('King''s College', 'school', 'Lagos', 'info@kingscollege.edu.ng', 'Premier secondary school in Lagos.'),
  ('Queen''s College', 'school', 'Lagos', 'info@queenscollege.edu.ng', 'Leading secondary school for girls.'),
  ('Baptist High School', 'school', 'Ibadan', 'info@baptisthigh.edu.ng', 'Comprehensive primary and secondary school.'),
  ('Federal Government College', 'school', 'Abuja', 'info@fgc.edu.ng', 'Federal unity college.'),
  ('Lagos Anglican School', 'school', 'Lagos', 'info@lagosanglican.edu.ng', 'Primary and secondary education.'),
  ('St. Augustine Academy', 'school', 'Port Harcourt', 'info@staugustine.edu.ng', 'Secondary school in Port Harcourt.'),
  ('University of Lagos', 'university', 'Lagos', 'info@unilag.edu.ng', 'Federal university in Lagos.'),
  ('Ahmadu Bello University', 'university', 'Zaria', 'info@abu.edu.ng', 'Federal university in Zaria.'),
  ('University of Ibadan', 'university', 'Ibadan', 'info@ui.edu.ng', 'Nigeria''s first university.'),
  ('Obafemi Awolowo University', 'university', 'Ile-Ife', 'info@oau.edu.ng', 'Federal university in Ile-Ife.'),
  ('University of Nigeria, Nsukka', 'university', 'Nsukka', 'info@unn.edu.ng', 'Federal university in Nsukka.'),
  ('Covenant University', 'university', 'Ota', 'info@covenantuniversity.edu.ng', 'Private Christian university.')
ON CONFLICT DO NOTHING;

-- ── Seed courses for universities ──
INSERT INTO courses (institution_id, code, name, credits, level, semester)
SELECT i.id, v.code, v.name, v.credits, v.level, v.semester
FROM (VALUES
  ('University of Lagos', 'CSC 101', 'Introduction to Computer Science', 3, '100L', 'First'),
  ('University of Lagos', 'CSC 201', 'Programming Fundamentals', 3, '200L', 'First'),
  ('University of Lagos', 'CSC 301', 'Data Structures & Algorithms', 3, '300L', 'First'),
  ('University of Lagos', 'CSC 305', 'Database Systems', 3, '300L', 'First'),
  ('University of Lagos', 'MTH 101', 'Calculus I', 3, '100L', 'First'),
  ('University of Lagos', 'MTH 201', 'Linear Algebra', 3, '200L', 'First'),
  ('University of Lagos', 'GST 101', 'Communication Skills', 2, '100L', 'First'),
  ('University of Lagos', 'STA 201', 'Statistics', 3, '200L', 'First'),
  ('University of Lagos', 'CSC 401', 'Artificial Intelligence', 3, '400L', 'First'),
  ('University of Lagos', 'CSC 501', 'Machine Learning', 4, '500L', 'First'),
  ('University of Nigeria, Nsukka', 'CSC 101', 'Introduction to Computing', 3, '100L', 'First'),
  ('University of Nigeria, Nsukka', 'CSC 201', 'Computer Programming', 3, '200L', 'First'),
  ('University of Nigeria, Nsukka', 'CSC 301', 'Algorithms & Complexity', 3, '300L', 'First'),
  ('University of Nigeria, Nsukka', 'MTH 101', 'Calculus I', 3, '100L', 'First'),
  ('Covenant University', 'CSC 101', 'Intro to Computer Science', 3, '100L', 'First'),
  ('Covenant University', 'CSC 201', 'Object-Oriented Programming', 3, '200L', 'First'),
  ('Covenant University', 'CSC 301', 'Software Engineering', 3, '300L', 'First'),
  ('Covenant University', 'MTH 101', 'Calculus I', 3, '100L', 'First')
) AS v(university_name, code, name, credits, level, semester)
JOIN institutions i ON i.name = v.university_name
ON CONFLICT DO NOTHING;

-- ── Seed subjects for schools ──
INSERT INTO subjects (institution_id, name, level, term)
SELECT i.id, v.name, v.level, v.term
FROM (VALUES
  ('King''s College', 'Mathematics', 'JSS 1', 'First Term'),
  ('King''s College', 'English Language', 'JSS 1', 'First Term'),
  ('King''s College', 'Basic Science', 'JSS 1', 'First Term'),
  ('King''s College', 'Social Studies', 'JSS 1', 'First Term'),
  ('King''s College', 'Mathematics', 'SSS 1', 'First Term'),
  ('King''s College', 'Physics', 'SSS 1', 'First Term'),
  ('King''s College', 'Chemistry', 'SSS 1', 'First Term'),
  ('King''s College', 'Biology', 'SSS 1', 'First Term'),
  ('Baptist High School', 'Mathematics', 'Primary 1', 'First Term'),
  ('Baptist High School', 'English Language', 'Primary 1', 'First Term'),
  ('Baptist High School', 'Basic Science', 'Primary 1', 'First Term'),
  ('Baptist High School', 'Social Studies', 'Primary 1', 'First Term'),
  ('Baptist High School', 'Mathematics', 'Primary 4', 'First Term'),
  ('Baptist High School', 'English Language', 'Primary 4', 'First Term'),
  ('Baptist High School', 'Basic Science', 'Primary 4', 'First Term'),
  ('Baptist High School', 'Mathematics', 'JSS 1', 'First Term'),
  ('Baptist High School', 'English Language', 'JSS 1', 'First Term'),
  ('Baptist High School', 'Mathematics', 'SSS 3', 'First Term'),
  ('Baptist High School', 'Physics', 'SSS 3', 'First Term'),
  ('Lagos Anglican School', 'Mathematics', 'Primary 1', 'First Term'),
  ('Lagos Anglican School', 'English Language', 'Primary 1', 'First Term'),
  ('Lagos Anglican School', 'Basic Science', 'Primary 1', 'First Term'),
  ('Lagos Anglican School', 'Mathematics', 'Primary 5', 'First Term'),
  ('Lagos Anglican School', 'English Language', 'Primary 5', 'First Term')
) AS v(school_name, name, level, term)
JOIN institutions i ON i.name = v.school_name
ON CONFLICT DO NOTHING;

-- ── Seed default super admin ──
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('dev.evo@gmail.com', crypt('Leonard112233', gen_salt('bf')), 'Super Admin', 'super-admin')
ON CONFLICT (email) DO NOTHING;
