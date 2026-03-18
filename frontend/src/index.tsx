import '@/tracing';
import '@/set-faro-user';
import { createRoot } from 'react-dom/client';
import { App } from '@/components/app/app';
import { FRAME_TIMES } from '@/frame-times';
import { cleanLocalStorage } from '@/localstorage';
import { initLongTaskObserver } from '@/long-tasks';
import { initializeScrubber } from '@/scrubber';

initializeScrubber();

if (typeof window !== 'undefined' && window.localStorage !== undefined) {
  cleanLocalStorage(window.localStorage);
}

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

FRAME_TIMES.init();
initLongTaskObserver();
