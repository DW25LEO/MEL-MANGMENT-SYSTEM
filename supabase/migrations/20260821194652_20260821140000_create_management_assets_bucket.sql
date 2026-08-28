/*
# Add storage for platform logos and course notes

The bucket is publicly readable so public pages can display saved assets. Only authenticated Super Admins may create, update, or delete objects in it.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('ilearnace-assets', 'ilearnace-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read I-LearnAce assets" ON storage.objects;
CREATE POLICY "Public can read I-LearnAce assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'ilearnace-assets');

DROP POLICY IF EXISTS "Super admins upload I-LearnAce assets" ON storage.objects;
CREATE POLICY "Super admins upload I-LearnAce assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ilearnace-assets' AND public.is_super_admin());

DROP POLICY IF EXISTS "Super admins update I-LearnAce assets" ON storage.objects;
CREATE POLICY "Super admins update I-LearnAce assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ilearnace-assets' AND public.is_super_admin()) WITH CHECK (bucket_id = 'ilearnace-assets' AND public.is_super_admin());

DROP POLICY IF EXISTS "Super admins delete I-LearnAce assets" ON storage.objects;
CREATE POLICY "Super admins delete I-LearnAce assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ilearnace-assets' AND public.is_super_admin());
