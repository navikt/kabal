import React from 'react';
import { Nav } from '../components/nav/nav';

export const OppgaverPageWrapper: React.FC = ({ children }) => (
  <>
    <Nav />
    <main>
      <article>{children}</article>
    </main>
  </>
);
