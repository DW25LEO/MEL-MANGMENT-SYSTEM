/*
# Restrict exam visibility to eligible students

1. Policy changes
- Replaces the broad published-exam read policy with an authenticated-only policy.
- A student can read an exam only when the exam is published, its course is registered by that student, and any configured school/class restrictions match the student's profile.
- Anonymous users cannot read exams or exam questions.

2. Security changes
- Removes direct student UPDATE access to exam attempts so scores and submission status can only be changed through the validated submit_exam_attempt RPC.
- Keeps Super Admin read access for administrative review.
*/

DROP POLICY IF EXISTS "Public can read published exams" ON public.exams;
CREATE POLICY "Eligible students read published exams" ON public.exams
  FOR SELECT TO authenticated USING (
    status = 'published'
    AND EXISTS (
      SELECT 1
      FROM public.user_courses uc
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE uc.course_id = exams.course_id
        AND uc.user_id = auth.uid()
        AND (exams.school_id IS NULL OR exams.school_id = p.school_id)
        AND (exams.class_level IS NULL OR exams.class_level = p.class_level)
    )
  );

DROP POLICY IF EXISTS "Students update own attempts" ON public.exam_attempts;
