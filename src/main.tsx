import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './lib/auth';
import { SiteSettingsProvider } from './lib/site-settings';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </AuthProvider>
  </StrictMode>
);
