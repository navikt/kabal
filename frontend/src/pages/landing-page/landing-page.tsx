import { ErrorMessage, Loader } from '@navikt/ds-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLandingPagePath } from '@app/hooks/use-landing-page-path';
import { PageWrapper } from '../page-wrapper';

export const LandingPage = () => {
  const [isLoading, path] = useLandingPagePath();

  if (isLoading) {
    return <Loader size="xlarge" />;
  }

  if (path !== null) {
    return <Navigate replace to={path} />;
  }

  return (
    <PageWrapper>
      <ErrorMessage>Ingen tilganger funnet</ErrorMessage>
    </PageWrapper>
  );
};
