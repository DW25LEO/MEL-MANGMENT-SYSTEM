import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type SiteSettings = {
  id?: string;
  logo_url: string;
  primary_color: string;
  footer_text: string;
  homepage_images: { heroTitle?: string; heroSubtitle?: string; images?: string[] };
  about_text: string;
  exam_text: string;
};

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  saveSettings: (next: SiteSettings) => Promise<{ error: string | null }>;
};

const defaults: SiteSettings = {
  logo_url: '',
  primary_color: '#2563eb',
  footer_text: 'A unified education technology platform for modern learning.',
  homepage_images: { heroTitle: '', heroSubtitle: '', images: [] },
  about_text: '',
  exam_text: '',
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    if (!error && data) {
      setSettings({
        ...defaults,
        ...data,
        homepage_images: typeof data.homepage_images === 'object' && data.homepage_images ? data.homepage_images : defaults.homepage_images,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadSettings(); }, [loadSettings]);

  const saveSettings = useCallback(async (next: SiteSettings) => {
    const payload = {
      logo_url: next.logo_url || null,
      primary_color: next.primary_color,
      footer_text: next.footer_text,
      homepage_images: next.homepage_images,
      about_text: next.about_text,
      exam_text: next.exam_text,
      updated_at: new Date().toISOString(),
    };
    const existing = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
    const result = existing.data?.id
      ? await supabase.from('site_settings').update(payload).eq('id', existing.data.id).select('*').single()
      : await supabase.from('site_settings').insert(payload).select('*').single();
    if (result.error || !result.data) return { error: result.error?.message || existing.error?.message || 'Unable to save site settings.' };
    setSettings({ ...defaults, ...result.data, homepage_images: result.data.homepage_images || defaults.homepage_images });
    return { error: null };
  }, []);

  const value = useMemo(() => ({ settings, loading, saveSettings }), [settings, loading, saveSettings]);
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const value = useContext(SiteSettingsContext);
  if (!value) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return value;
}
