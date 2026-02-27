import { App } from '@app/app';
import { getMetadata } from '@app/metadata';
import { createRoot } from 'react-dom/client';

const metadata = getMetadata();

if (metadata === null) {
  throw new Error('Document viewer metadata is missing or invalid.');
}

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App metadata={metadata} />);
}
