import { ErrorMessage } from '@navikt/ds-react';
import { Navigate } from 'react-router-dom';
import { useLandingPagePath } from '@app/hooks/use-landing-page-path';
import { PageWrapper } from '../page-wrapper';

export const LandingPage = () => {
  const result = useLandingPagePath();

  if (result !== null) {
    const [path] = result;

    return <Navigate replace to={path} />;
  }

  return (
    <PageWrapper>
      <ErrorMessage>Ingen tilganger funnet</ErrorMessage>
    </PageWrapper>
  );
};
