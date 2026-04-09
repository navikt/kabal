import { useEffect, useState } from 'react';
import { ServerSentEventManager, type TracedEvent } from '@/server-sent-events';

interface FeatureToggle extends TracedEvent {
  enabled: boolean;
}

interface State {
  data: FeatureToggle | undefined;
  isLoading: boolean;
}

const cache = new Map<string, FeatureToggle>();

const useFeatureToggle = (toggleName: string): State => {
  const cached = cache.get(toggleName);
  const [state, setState] = useState<State>({ data: cached, isLoading: cached === undefined });

  useEffect(() => {
    const manager = ServerSentEventManager.get<'toggle'>(
      `feature-toggle.${toggleName}`,
      `/feature-toggle/${toggleName}`,
    );

    const removeListener = manager.addJsonEventListener<FeatureToggle>('toggle', (data) => {
      cache.set(toggleName, data);
      setState({ data, isLoading: false });
    });

    return () => {
      removeListener();
      manager.close();
    };
  }, [toggleName]);

  return state;
};

export const useShowNewFileViewerFeatureToggle = () => useFeatureToggle('show-new-file-viewer');

export const useShowOldPdfViewerFeatureToggle = () => useFeatureToggle('show-old-pdf-viewer');
