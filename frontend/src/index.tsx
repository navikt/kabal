import { Modal } from '@navikt/ds-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app/app';

const container = document.getElementById('app');

if (container !== null) {
  Modal.setAppElement(container);
  const root = createRoot(container);
  root.render(<App />);
}

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
