import React from 'react';
import { createRoot } from 'react-dom/client';
import { Scrubber } from 'slate';
import { App } from './components/app/app';

// https://docs.slatejs.org/api/scrubber
Scrubber.setScrubber((key, value) => (key === 'text' ? '[FJERNET]' : value));

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}
