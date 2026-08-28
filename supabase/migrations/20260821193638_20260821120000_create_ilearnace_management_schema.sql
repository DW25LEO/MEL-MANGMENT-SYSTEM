/*
# Create I-LearnAce management schema

1. New Tables
- `site_settings`: one-row public website configuration including logo, colors, footer copy, homepage images, About text, and examination text.
- `tertiary_institutions`: public tertiary education institutions managed by Super Admins.
- `tertiary_exams`: exams and tests linked to a tertiary institution.
- `schools`: primary and secondary schools with public website links.
- `sub_admins`: school sub-administrator login page records and server-side password hashes.
- `backups`: durable records of generated course backup files.
- `user_courses`: authenticated user-to-course selections.

2. Existing Table Updates
- `courses`: adds school name, class level, subject name, scheme of work, notes PDF URL, external link URL, publish state, and backup file URL while preserving all existing columns and data.

3. Security
- Row Level Security is enabled on every new table.
- Public users can read public site settings, tertiary institutions and exams, schools, and published courses only.
- Authenticated users can read and create their own course selections.
- Sensitive administrator and backup tables have no public policies; future server-authorized functions will perform administrator writes.

4. Integrity and Performance
- Foreign keys connect exams to tertiary institutions, backups to courses, and user selections to auth users and courses.
- Unique constraints prevent duplicate course selections and duplicate school names.
- Indexes support published-course, institution-exam, and backup lookups.
- The migration is idempotent and preserves existing rows.
*/

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
