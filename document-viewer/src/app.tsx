import {
  KlagePdfViewer as KlagePdfViewerComponent,
  type PdfViewerConfig,
} from '@navikt/klage-pdf-viewer';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import WORKER_SRC from '@navikt/klage-pdf-viewer/pdf-worker?url';
import { useEffect, useMemo, useState } from 'react';
import type { DocumentViewerMetadata } from '@app/types';

// --- Theme ---

enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const getAppThemeKey = (navIdent: string) => `${navIdent}/app_theme`;

const getSystemTheme = (): AppTheme =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? AppTheme.DARK
    : AppTheme.LIGHT;

const resolveTheme = (navIdent: string): AppTheme => {
  const stored = localStorage.getItem(getAppThemeKey(navIdent));

  if (stored === 'dark') {
    return AppTheme.DARK;
  }

  if (stored === 'light') {
    return AppTheme.LIGHT;
  }

  return getSystemTheme();
};

const useAppTheme = (navIdent: string): AppTheme => {
  const [theme, setTheme] = useState<AppTheme>(() => resolveTheme(navIdent));

  useEffect(() => {
    const key = getAppThemeKey(navIdent);

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setTheme(resolveTheme(navIdent));
      }
    };

    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, [navIdent]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const onChange = () => setTheme(resolveTheme(navIdent));

    mediaQuery.addEventListener('change', onChange);

    return () => mediaQuery.removeEventListener('change', onChange);
  }, [navIdent]);

  return theme;
};

// --- App ---

interface AppProps {
  metadata: DocumentViewerMetadata;
}

export const App = ({ metadata }: AppProps) => {
  const appTheme = useAppTheme(metadata.navIdent);

  const pdfs = useMemo(
    () => metadata.documents.map(({ title, url }) => ({ title, url })),
    [metadata.documents],
  );

  const config = useMemo<Partial<PdfViewerConfig>>(
    () => ({
      invertColors: appTheme === AppTheme.DARK,
    }),
    [appTheme],
  );

  return (
    <KlagePdfViewerComponent
      workerSrc={WORKER_SRC}
      pdfs={pdfs}
      config={config}
    />
  );
};
