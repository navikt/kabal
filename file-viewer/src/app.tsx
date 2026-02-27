import { type AppTheme, getAppThemeKey, resolveTheme } from '@app/theme';
import type { DocumentViewerMetadata } from '@app/types';
import { Theme } from '@navikt/ds-react';
import { KlageFileViewer } from '@navikt/klage-file-viewer';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import WORKER_SRC from '@navikt/klage-file-viewer/pdf-worker?url';
import { useEffect, useState } from 'react';

// --- Theme ---

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

  return (
    <Theme asChild theme={appTheme}>
      <KlageFileViewer files={metadata.files} theme={appTheme} workerSrc={WORKER_SRC} standalone />
    </Theme>
  );
};
