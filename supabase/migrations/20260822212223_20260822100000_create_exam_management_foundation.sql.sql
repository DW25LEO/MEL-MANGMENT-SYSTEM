/*
# Examination Management Foundation

1. New Tables
- `terms`: academic terms (e.g. First Term, Second Term) that group courses and exams.
- `exam_types`: configurable exam types (e.g. Midterm, Final, Quiz, CBT Test).
- `exams`: exams created by Super Admins, linked to a course, term, exam type, school, and class level. Stores duration, instructions, pass mark, question count, attempt limit, status (draft/published/archived).
- `exam_questions`: individual questions attached to an exam. Stores question text, options (JSONB), correct option index, and marks.
- `exam_attempts`: a student's attempt at an exam. Stores start/end time, status (in_progress/submitted/expired), score, pass/fail, and attempt number.
- `exam_answers`: individual answers within an attempt, linked to exam_questions and exam_attempts.

2. Existing Table Updates
- `courses`: adds `term_id` (optional FK to terms), `exam_type_id` (optional FK to exam_types), `school_id` (optional FK to schools), and `class_level` is already present. This connects courses to schools, class levels, terms, and exam types.
- `profiles`: adds `school_id` (optional FK to schools) and `class_level` (text) so students can be linked to a school and class/level.

3. Security
- Row Level Security is enabled on every new table.
- Public users can read terms, exam types, and published exams.
- Authenticated students can read exams published for courses they are registered for (via user_courses), and can read questions for those exams.
- Authenticated students can create and read their own exam attempts and answers.
- Super Admins (via is_super_admin()) have full CRUD on terms, exam_types, exams, and exam_questions.
- Students cannot modify exams, questions, or other students' attempts.

4. Integrity and Performance
- Foreign keys connect exams to courses, terms, exam types, schools; questions to exams; attempts to exams and auth users; answers to attempts and questions.
- Unique constraint prevents duplicate attempts per exam per user per attempt number.
- Indexes support published-exam, course-exam, student-attempt, and question lookups.
- The migration is idempotent and preserves all existing data.
*/

-- ── TERMS ──
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

DROP POLICY IF EXISTS "super_admin_insert_terms" ON public.terms;
CREATE POLICY "super_admin_insert_terms" ON public.terms FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_update_terms" ON public.terms;
CREATE POLICY "super_admin_update_terms" ON public.terms FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_delete_terms" ON public.terms;
CREATE POLICY "super_admin_delete_terms" ON public.terms FOR DELETE TO authenticated USING (public.is_super_admin());

-- ── EXAM TYPES ──
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

DROP POLICY IF EXISTS "super_admin_insert_exam_types" ON public.exam_types;
CREATE POLICY "super_admin_insert_exam_types" ON public.exam_types FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_update_exam_types" ON public.exam_types;
CREATE POLICY "super_admin_update_exam_types" ON public.exam_types FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_delete_exam_types" ON public.exam_types;
CREATE POLICY "super_admin_delete_exam_types" ON public.exam_types FOR DELETE TO authenticated USING (public.is_super_admin());

-- ── EXAMS ──
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

-- Public can read published exams
DROP POLICY IF EXISTS "Public can read published exams" ON public.exams;
CREATE POLICY "Public can read published exams" ON public.exams FOR SELECT TO anon, authenticated USING (status = 'published');

-- Super Admin full CRUD
DROP POLICY IF EXISTS "super_admin_insert_exams" ON public.exams;
CREATE POLICY "super_admin_insert_exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_update_exams" ON public.exams;
CREATE POLICY "super_admin_update_exams" ON public.exams FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_delete_exams" ON public.exams;
CREATE POLICY "super_admin_delete_exams" ON public.exams FOR DELETE TO authenticated USING (public.is_super_admin());

-- ── EXAM QUESTIONS ──
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

-- Students can read questions for exams they are registered for (via user_courses → course_id)
DROP POLICY IF EXISTS "Students read questions for registered exams" ON public.exam_questions;
CREATE POLICY "Students read questions for registered exams" ON public.exam_questions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      WHERE e.id = exam_questions.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
    )
  );

-- Super Admin full CRUD
DROP POLICY IF EXISTS "super_admin_insert_exam_questions" ON public.exam_questions;
CREATE POLICY "super_admin_insert_exam_questions" ON public.exam_questions FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_update_exam_questions" ON public.exam_questions;
CREATE POLICY "super_admin_update_exam_questions" ON public.exam_questions FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "super_admin_delete_exam_questions" ON public.exam_questions;
CREATE POLICY "super_admin_delete_exam_questions" ON public.exam_questions FOR DELETE TO authenticated USING (public.is_super_admin());

-- ── EXAM ATTEMPTS ──
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

-- Students can read their own attempts
DROP POLICY IF EXISTS "Students read own attempts" ON public.exam_attempts;
CREATE POLICY "Students read own attempts" ON public.exam_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Students can create their own attempts (only for exams linked to their registered courses)
DROP POLICY IF EXISTS "Students create own attempts" ON public.exam_attempts;
CREATE POLICY "Students create own attempts" ON public.exam_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      WHERE e.id = exam_attempts.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
    )
  );

-- Students can update their own attempts (submit, score)
DROP POLICY IF EXISTS "Students update own attempts" ON public.exam_attempts;
CREATE POLICY "Students update own attempts" ON public.exam_attempts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Super Admin can read all attempts
DROP POLICY IF EXISTS "super_admin_read_exam_attempts" ON public.exam_attempts;
CREATE POLICY "super_admin_read_exam_attempts" ON public.exam_attempts FOR SELECT TO authenticated USING (public.is_super_admin());

-- ── EXAM ANSWERS ──
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

-- Students can read their own answers
DROP POLICY IF EXISTS "Students read own answers" ON public.exam_answers;
CREATE POLICY "Students read own answers" ON public.exam_answers
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );

-- Students can create/update their own answers
DROP POLICY IF EXISTS "Students create own answers" ON public.exam_answers;
CREATE POLICY "Students create own answers" ON public.exam_answers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Students update own answers" ON public.exam_answers;
CREATE POLICY "Students update own answers" ON public.exam_answers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.exam_attempts a WHERE a.id = exam_answers.attempt_id AND a.user_id = auth.uid())
  );

-- Super Admin can read all answers
DROP POLICY IF EXISTS "super_admin_read_exam_answers" ON public.exam_answers;
CREATE POLICY "super_admin_read_exam_answers" ON public.exam_answers FOR SELECT TO authenticated USING (public.is_super_admin());

-- ── COURSES: add term, exam_type, school_id columns ──
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS term_id uuid REFERENCES public.terms(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS exam_type_id uuid REFERENCES public.exam_types(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;

-- ── PROFILES: add school_id and class_level ──
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class_level text;

-- ── INDEXES ──
CREATE INDEX IF NOT EXISTS exams_course_id_idx ON public.exams (course_id);
CREATE INDEX IF NOT EXISTS exams_status_idx ON public.exams (status);
CREATE INDEX IF NOT EXISTS exams_school_class_idx ON public.exams (school_id, class_level);
CREATE INDEX IF NOT EXISTS exam_questions_exam_id_idx ON public.exam_questions (exam_id);
CREATE INDEX IF NOT EXISTS exam_attempts_user_id_idx ON public.exam_attempts (user_id);
CREATE INDEX IF NOT EXISTS exam_attempts_exam_id_idx ON public.exam_attempts (exam_id, user_id);
CREATE INDEX IF NOT EXISTS exam_answers_attempt_id_idx ON public.exam_answers (attempt_id);

-- ── TRIGGER: auto-calculate question_count on exam ──
CREATE OR REPLACE FUNCTION public.update_exam_question_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- ── RPC: submit exam attempt (auto-mark MCQ, compute score) ──
CREATE OR REPLACE FUNCTION public.submit_exam_attempt(
  p_attempt_id uuid,
  p_answers jsonb
)
RETURNS public.exam_attempts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- Delete any prior answers for this attempt (idempotent re-submit)
  DELETE FROM public.exam_answers WHERE attempt_id = p_attempt_id;

  -- Process each answer
  FOR v_answer_record IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
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

-- ── RPC: get next attempt number for a student on an exam ──
CREATE OR REPLACE FUNCTION public.get_next_attempt_number(p_exam_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(max(attempt_number), 0) + 1 FROM public.exam_attempts WHERE exam_id = p_exam_id AND user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_next_attempt_number(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_next_attempt_number(uuid) TO authenticated;
