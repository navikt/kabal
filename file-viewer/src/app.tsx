import { Theme } from '@navikt/ds-react';
import { KlageFileViewer, type KlageFileViewerHandle } from '@navikt/klage-file-viewer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createHighlightStorage } from '@/highlight-storage';
import { type AppTheme, getAppThemeKey, resolveTheme } from '@/theme';
import type { DocumentViewerMetadata } from '@/types';

// --- BroadcastChannel reload listener ---

const CHANNEL = new BroadcastChannel('pdf-channel');

const useReloadOnBroadcast = (handleRef: React.RefObject<KlageFileViewerHandle | null>) => {
  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (
        typeof event.data === 'object' &&
        event.data !== null &&
        'type' in event.data &&
        event.data.type === 'RELOAD' &&
        'url' in event.data &&
        typeof event.data.url === 'string'
      ) {
        handleRef.current?.reloadFile(event.data.url);
      }
    };

    CHANNEL.addEventListener('message', onMessage);

    return () => CHANNEL.removeEventListener('message', onMessage);
  }, [handleRef]);
};

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
  const handleRef = useRef<KlageFileViewerHandle>(null);
  const { highlightsBehandlingId } = metadata;
  const highlightStorage = useMemo(
    () => (highlightsBehandlingId === undefined ? undefined : createHighlightStorage(highlightsBehandlingId)),
    [highlightsBehandlingId],
  );

  useReloadOnBroadcast(handleRef);

  return (
    <Theme theme={appTheme} className="h-full w-full">
      <KlageFileViewer
        files={metadata.files}
        theme={appTheme}
        standalone
        handleRef={handleRef}
        highlightStorage={highlightStorage}
      />
    </Theme>
  );
};
