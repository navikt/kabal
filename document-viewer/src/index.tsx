import { createRoot } from 'react-dom/client';
import { App } from '@app/app';
import type { DocumentViewerMetadata } from '@app/types';

const getMetadata = (): DocumentViewerMetadata | null => {
  const element = document.getElementById('document-viewer-metadata');

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

const metadata = getMetadata();

if (metadata === null) {
  throw new Error('Document viewer metadata is missing or invalid.');
}

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App metadata={metadata} />);
}
