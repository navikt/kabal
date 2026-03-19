import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import { getMetadata } from '@/metadata';

const metadata = getMetadata();

if (metadata === null) {
  throw new Error('Document viewer metadata is missing or invalid.');
}

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App metadata={metadata} />);
}
