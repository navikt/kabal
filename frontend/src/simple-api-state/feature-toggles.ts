import { useEffect, useState } from 'react';
import { ServerSentEventManager, type TracedEvent } from '@/server-sent-events';

interface FeatureToggle extends TracedEvent {
  enabled: boolean;
}

interface State {
  data: FeatureToggle | undefined;
  isLoading: boolean;
}

const useFeatureToggle = (toggleName: string): State => {
  const [state, setState] = useState<State>({ data: undefined, isLoading: true });

  useEffect(() => {
    const manager = ServerSentEventManager.get<'toggle'>(
      `feature-toggle.${toggleName}`,
      `/feature-toggle/${toggleName}`,
    );

    const removeListener = manager.addJsonEventListener<FeatureToggle>('toggle', (data) => {
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
