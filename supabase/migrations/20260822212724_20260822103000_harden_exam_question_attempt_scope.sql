/* Align question and attempt authorization with published exam school/class eligibility. */

DROP POLICY IF EXISTS "Students read questions for registered exams" ON public.exam_questions;
CREATE POLICY "Students read questions for registered exams" ON public.exam_questions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE e.id = exam_questions.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
        AND (e.school_id IS NULL OR e.school_id = p.school_id)
        AND (e.class_level IS NULL OR e.class_level = p.class_level)
    )
  );

DROP POLICY IF EXISTS "Students create own attempts" ON public.exam_attempts;
CREATE POLICY "Students create own attempts" ON public.exam_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.exams e
      JOIN public.user_courses uc ON uc.course_id = e.course_id
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE e.id = exam_attempts.exam_id
        AND e.status = 'published'
        AND uc.user_id = auth.uid()
        AND (e.school_id IS NULL OR e.school_id = p.school_id)
        AND (e.class_level IS NULL OR e.class_level = p.class_level)
    )
  );
