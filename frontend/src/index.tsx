import { FRAME_TIMES } from '@app/frame-times';
import { initializeScrubber } from '@app/scrubber';
import { createRoot } from 'react-dom/client';
import { App } from './components/app/app';

initializeScrubber();

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

FRAME_TIMES.init();
