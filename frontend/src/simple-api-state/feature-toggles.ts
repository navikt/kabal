import { SimpleApiState, useSimpleApiState } from '@/simple-api-state/simple-api-state';

type FeatureToggle = {
  enabled: boolean;
};

const showNewFileViewer = new SimpleApiState<FeatureToggle>('/feature-toggle/use-new-file-viewer');

export const useNewFileViewerFeatureToggle = () => useSimpleApiState(showNewFileViewer);
