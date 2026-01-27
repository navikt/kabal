import type { DocumentViewerMetadata } from '@app/types';

export const getMetadata = (): DocumentViewerMetadata | null => {
  const element = document.getElementById('file-viewer-metadata');

  if (element === null) {
    return null;
  }

  const text = element.textContent;

  if (text === null || text.length === 0) {
    return null;
  }

  try {
    return JSON.parse(text) as DocumentViewerMetadata;
  } catch {
    return null;
  }
};
