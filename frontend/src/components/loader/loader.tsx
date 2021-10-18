import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';

interface LoaderProps {
  children: string;
}

export const Loader = ({ children }: LoaderProps): JSX.Element => (
  <div>
    <NavFrontendSpinner />
    <span>{children}</span>
  </div>
);
