import { Theme } from '@navikt/ds-react';
import { KlageFileViewer } from '@navikt/klage-file-viewer';
import { useEffect, useState } from 'react';
import { type AppTheme, getAppThemeKey, resolveTheme } from '@/theme';
import type { DocumentViewerMetadata } from '@/types';

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
      <KlageFileViewer files={metadata.files} theme={appTheme} standalone />
    </Theme>
  );
};
