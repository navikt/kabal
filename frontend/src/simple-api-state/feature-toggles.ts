import { SimpleApiState, useSimpleApiState } from '@/simple-api-state/simple-api-state';

type FeatureToggle = {
  enabled: boolean;
};

const showNewFileViewer = new SimpleApiState<FeatureToggle>('/feature-toggle/show-new-file-viewer');

const showOldPdfViewer = new SimpleApiState<FeatureToggle>('/feature-toggle/show-old-pdf-viewer');

export const useShowNewFileViewerFeatureToggle = () => useSimpleApiState(showNewFileViewer);

export const useShowOldPdfViewerFeatureToggle = () => useSimpleApiState(showOldPdfViewer);
