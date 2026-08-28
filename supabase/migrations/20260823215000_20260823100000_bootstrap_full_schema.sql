-- Combined schema bootstrap: applies all existing migration files in dependency order.
-- Source: supabase/migrations/*.sql

-- ═══ 1. profiles table ═══
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'student',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ═══ 2. institutions, courses, subjects, verification_codes, payments, admin_users ═══
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
CREATE POLICY "institutions_select_public" ON institutions FOR SELECT TO anon, authenticated USING (true);

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
CREATE POLICY "subjects_select_public" ON subjects FOR SELECT TO anon, authenticated USING (true);

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
CREATE POLICY "verification_codes_insert_public" ON verification_codes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "verification_codes_select_own" ON verification_codes;
CREATE POLICY "verification_codes_select_own" ON verification_codes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "verification_codes_update_own" ON verification_codes;
CREATE POLICY "verification_codes_update_own" ON verification_codes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

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

-- Seed institutions
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

-- Seed courses
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

-- Seed subjects
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

-- Seed default super admin
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('dev.evo@gmail.com', crypt('Leonard112233', gen_salt('bf')), 'Super Admin', 'super-admin')
ON CONFLICT (email) DO NOTHING;

-- ═══ 3. Management schema (site_settings, tertiary_institutions, schools, sub_admins, backups, user_courses) ═══
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  primary_color text NOT NULL DEFAULT '#2563eb',
  footer_text text NOT NULL DEFAULT 'A unified education technology platform for modern learning.',
  homepage_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  about_text text,
  exam_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.tertiary_institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.tertiary_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.tertiary_institutions(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  exam_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('primary', 'secondary')),
  website_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.sub_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  login_link text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  backup_file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS school_name text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS class_level text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS subject_name text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS scheme_of_work text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS notes_pdf_url text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS backup_file_url text;

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_singleton_key ON public.site_settings ((true));
CREATE UNIQUE INDEX IF NOT EXISTS tertiary_institutions_name_key ON public.tertiary_institutions (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS schools_name_key ON public.schools (lower(name));
CREATE INDEX IF NOT EXISTS tertiary_exams_institution_id_idx ON public.tertiary_exams (institution_id);
CREATE INDEX IF NOT EXISTS courses_published_idx ON public.courses (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS backups_course_id_idx ON public.backups (course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_courses_user_id_idx ON public.user_courses (user_id, created_at DESC);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tertiary_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tertiary_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read tertiary institutions" ON public.tertiary_institutions;
CREATE POLICY "Public can read tertiary institutions" ON public.tertiary_institutions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read tertiary exams" ON public.tertiary_exams;
CREATE POLICY "Public can read tertiary exams" ON public.tertiary_exams FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read schools" ON public.schools;
CREATE POLICY "Public can read schools" ON public.schools FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read published courses" ON public.courses;
CREATE POLICY "Public can read published courses" ON public.courses FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "Users can read own course selections" ON public.user_courses;
CREATE POLICY "Users can read own course selections" ON public.user_courses FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own course selections" ON public.user_courses;
CREATE POLICY "Users can create own course selections" ON public.user_courses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can remove own course selections" ON public.user_courses;
CREATE POLICY "Users can remove own course selections" ON public.user_courses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ═══ 4. is_super_admin function + management policies ═══
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super-admin');
$$;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

CREATE POLICY "super_admin_select_site_settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_site_settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE POLICY "super_admin_select_tertiary_institutions" ON public.tertiary_institutions FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_tertiary_institutions" ON public.tertiary_institutions FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_tertiary_institutions" ON public.tertiary_institutions FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_tertiary_institutions" ON public.tertiary_institutions FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE POLICY "super_admin_select_tertiary_exams" ON public.tertiary_exams FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_tertiary_exams" ON public.tertiary_exams FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_tertiary_exams" ON public.tertiary_exams FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_tertiary_exams" ON public.tertiary_exams FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE POLICY "super_admin_select_schools" ON public.schools FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_schools" ON public.schools FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_schools" ON public.schools FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_schools" ON public.schools FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE POLICY "super_admin_select_backups" ON public.backups FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_backups" ON public.backups FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_backups" ON public.backups FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_backups" ON public.backups FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE POLICY "super_admin_select_courses" ON public.courses FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_courses" ON public.courses FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_courses" ON public.courses FOR DELETE TO authenticated USING (public.is_super_admin());

-- ═══ 5. create_sub_admin RPC ═══
CREATE OR REPLACE FUNCTION public.create_sub_admin(p_school_name text, p_login_link text, p_password text)
RETURNS public.sub_admins LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
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

-- ═══ 6. get_super_admin_stats RPC ═══
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS TABLE (total_users bigint, total_courses bigint, total_schools bigint, total_sub_admins bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super-admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
  SELECT (SELECT count(*) FROM auth.users), (SELECT count(*) FROM public.courses),
         (SELECT count(*) FROM public.schools), (SELECT count(*) FROM public.sub_admins);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_super_admin_stats() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_super_admin_stats() TO authenticated;

-- ═══ 7. verify_admin_login + create_admin_user RPCs ═══
CREATE OR REPLACE FUNCTION verify_admin_login(p_email text, p_password text)
RETURNS TABLE (id uuid, email text, full_name text, role text, is_active boolean)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.full_name, a.role, a.is_active
  FROM admin_users a
  WHERE a.email = p_email AND a.password_hash = crypt(p_password, a.password_hash) AND a.is_active = true;
END;
$$;
GRANT EXECUTE ON FUNCTION verify_admin_login(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION create_admin_user(p_email text, p_password text, p_full_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_users (email, password_hash, full_name, role)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_full_name, 'super-admin')
  ON CONFLICT (email) DO NOTHING;
END;
$$;
GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text) TO anon, authenticated;

-- ═══ 8. Exam management foundation (terms, exam_types, exams, exam_questions, exam_attempts, exam_answers) ═══
CREATE TABLE IF NOT EXISTS public.terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read terms" ON public.terms;
CREATE POLICY "Public can read terms" ON public.terms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "super_admin_insert_terms" ON public.terms FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_terms" ON public.terms FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_terms" ON public.terms FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE TABLE IF NOT EXISTS public.exam_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read exam_types" ON public.exam_types;
CREATE POLICY "Public can read exam_types" ON public.exam_types FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "super_admin_insert_exam_types" ON public.exam_types FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_exam_types" ON public.exam_types FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_exam_types" ON public.exam_types FOR DELETE TO authenticated USING (public.is_super_admin());

CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  term_id uuid REFERENCES public.terms(id) ON DELETE SET NULL,
  exam_type_id uuid REFERENCES public.exam_types(id) ON DELETE SET NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL,
  class_level text,
  duration_minutes integer NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  instructions text,
  pass_mark integer NOT NULL DEFAULT 50 CHECK (pass_mark >= 0 AND pass_mark <= 100),
  question_count integer NOT NULL DEFAULT 0,
  attempt_limit integer NOT NULL DEFAULT 2 CHECK (attempt_limit > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index integer NOT NULL DEFAULT 0,
  marks integer NOT NULL DEFAULT 1 CHECK (marks > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'expired')),
  score integer,
  total_marks integer,
  is_pass boolean,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (exam_id, user_id, attempt_number)
);
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.exam_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  selected_option_index integer,
  is_correct boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS term_id uuid REFERENCES public.terms(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS exam_type_id uuid REFERENCES public.exam_types(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class_level text;

CREATE INDEX IF NOT EXISTS exams_course_id_idx ON public.exams (course_id);
CREATE INDEX IF NOT EXISTS exams_status_idx ON public.exams (status);
CREATE INDEX IF NOT EXISTS exams_school_class_idx ON public.exams (school_id, class_level);
CREATE INDEX IF NOT EXISTS exam_questions_exam_id_idx ON public.exam_questions (exam_id);
CREATE INDEX IF NOT EXISTS exam_attempts_user_id_idx ON public.exam_attempts (user_id);
CREATE INDEX IF NOT EXISTS exam_attempts_exam_id_idx ON public.exam_attempts (exam_id, user_id);
CREATE INDEX IF NOT EXISTS exam_answers_attempt_id_idx ON public.exam_answers (attempt_id);

-- Exam policies: students see only published exams for their registered courses
DROP POLICY IF EXISTS "Public can read published exams" ON public.exams;
CREATE POLICY "Eligible students read published exams" ON public.exams
  FOR SELECT TO authenticated USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.user_courses uc
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE uc.course_id = exams.course_id
        AND uc.user_id = auth.uid()
        AND (exams.school_id IS NULL OR exams.school_id = p.school_id)
        AND (exams.class_level IS NULL OR exams.class_level = p.class_level)
    )
  );
CREATE POLICY "super_admin_select_exams" ON public.exams FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "super_admin_insert_exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_exams" ON public.exams FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_exams" ON public.exams FOR DELETE TO authenticated USING (public.is_super_admin());

-- Question policies
CREATE POLICY "Students read questions for registered exams" ON public.exam_questions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE e.id = exam_questions.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
        AND (e.school_id IS NULL OR e.school_id = p.school_id)
        AND (e.class_level IS NULL OR e.class_level = p.class_level)
    )
  );
CREATE POLICY "super_admin_insert_exam_questions" ON public.exam_questions FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_update_exam_questions" ON public.exam_questions FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "super_admin_delete_exam_questions" ON public.exam_questions FOR DELETE TO authenticated USING (public.is_super_admin());

-- Attempt policies
CREATE POLICY "Students read own attempts" ON public.exam_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Students create own attempts" ON public.exam_attempts
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE e.id = exam_attempts.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
        AND (e.school_id IS NULL OR e.school_id = p.school_id)
        AND (e.class_level IS NULL OR e.class_level = p.class_level)
    )
  );
CREATE POLICY "super_admin_read_exam_attempts" ON public.exam_attempts FOR SELECT TO authenticated USING (public.is_super_admin());

-- Answer policies
CREATE POLICY "Students read own answers" ON public.exam_answers
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );
CREATE POLICY "Students create own answers" ON public.exam_answers
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );
CREATE POLICY "Students update own answers" ON public.exam_answers
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );
CREATE POLICY "super_admin_read_exam_answers" ON public.exam_answers FOR SELECT TO authenticated USING (public.is_super_admin());

-- Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.update_exam_question_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.exams SET question_count = (
    SELECT count(*) FROM public.exam_questions WHERE exam_id = COALESCE(NEW.exam_id, OLD.exam_id)
  ), updated_at = now()
  WHERE id = COALESCE(NEW.exam_id, OLD.exam_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;
DROP TRIGGER IF EXISTS exam_questions_count_trigger ON public.exam_questions;
CREATE TRIGGER exam_questions_count_trigger
  AFTER INSERT OR DELETE OR UPDATE ON public.exam_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_exam_question_count();
REVOKE ALL ON FUNCTION public.update_exam_question_count() FROM PUBLIC;

-- RPC: submit exam attempt
CREATE OR REPLACE FUNCTION public.submit_exam_attempt(p_attempt_id uuid, p_answers jsonb)
RETURNS public.exam_attempts
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_attempt public.exam_attempts;
  v_exam public.exams;
  v_question public.exam_questions;
  v_selected integer;
  v_correct_count integer := 0;
  v_total_marks integer := 0;
  v_score integer := 0;
  v_answer_record jsonb;
BEGIN
  SELECT * INTO v_attempt FROM public.exam_attempts WHERE id = p_attempt_id AND user_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_attempt.status <> 'in_progress' THEN RAISE EXCEPTION 'Attempt already submitted'; END IF;
  SELECT * INTO v_exam FROM public.exams WHERE id = v_attempt.exam_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam not found'; END IF;
  DELETE FROM public.exam_answers WHERE attempt_id = p_attempt_id;
  FOR v_answer_record IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
    SELECT * INTO v_question FROM public.exam_questions WHERE id = (v_answer_record->>'question_id')::uuid AND exam_id = v_attempt.exam_id;
    IF NOT FOUND THEN CONTINUE; END IF;
    v_selected := NULLIF(v_answer_record->>'selected_option_index', '')::integer;
    v_total_marks := v_total_marks + v_question.marks;
    IF v_selected IS NOT NULL AND v_selected = v_question.correct_option_index THEN
      v_correct_count := v_correct_count + v_question.marks;
    END IF;
    INSERT INTO public.exam_answers (attempt_id, question_id, selected_option_index, is_correct)
    VALUES (p_attempt_id, v_question.id, v_selected, v_selected IS NOT NULL AND v_selected = v_question.correct_option_index)
    ON CONFLICT (attempt_id, question_id) DO UPDATE SET selected_option_index = v_selected, is_correct = (v_selected IS NOT NULL AND v_selected = v_question.correct_option_index);
  END LOOP;
  v_score := CASE WHEN v_total_marks > 0 THEN round((v_correct_count::numeric / v_total_marks::numeric) * 100)::integer ELSE 0 END;
  UPDATE public.exam_attempts
  SET status = 'submitted', score = v_score, total_marks = v_total_marks, is_pass = (v_score >= v_exam.pass_mark), submitted_at = now()
  WHERE id = p_attempt_id
  RETURNING * INTO v_attempt;
  RETURN v_attempt;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_exam_attempt(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_exam_attempt(uuid, jsonb) TO authenticated;

-- RPC: get next attempt number
CREATE OR REPLACE FUNCTION public.get_next_attempt_number(p_exam_id uuid)
RETURNS integer LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(max(attempt_number), 0) + 1 FROM public.exam_attempts WHERE exam_id = p_exam_id AND user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.get_next_attempt_number(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_next_attempt_number(uuid) TO authenticated;

-- ═══ 9. Payment ownership + school sync ═══
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.payments ALTER COLUMN user_id SET DEFAULT auth.uid();
UPDATE public.payments p SET user_id = u.id FROM auth.users u WHERE p.user_id IS NULL AND lower(p.user_email) = lower(u.email);
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_own" ON public.payments;
DROP POLICY IF EXISTS "payments_update_own" ON public.payments;
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_super_admin());
CREATE POLICY "Users create own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins update payments" ON public.payments FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super admins delete payments" ON public.payments FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments (user_id, created_at DESC);

-- Sync legacy institutions schools into schools table
INSERT INTO public.schools (name, type, created_at)
SELECT i.name, CASE WHEN i.type = 'school' THEN 'secondary' ELSE i.type END, COALESCE(i.created_at, now())
FROM public.institutions i
WHERE i.type = 'school'
  AND NOT EXISTS (SELECT 1 FROM public.schools s WHERE lower(s.name) = lower(i.name));

-- ═══ 10. Create requested admin user ═══
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('leoebehigmail.com', crypt('Leonard112233@', gen_salt('bf')), 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
