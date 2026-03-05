import { App } from '@app/components/app/app';
import { FRAME_TIMES } from '@app/frame-times';
import { initializeScrubber } from '@app/scrubber';
import { createRoot } from 'react-dom/client';

initializeScrubber();

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

FRAME_TIMES.init();
