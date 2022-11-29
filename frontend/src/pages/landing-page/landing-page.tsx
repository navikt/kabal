import { ErrorMessage, Loader } from '@navikt/ds-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../simple-api-state/use-user';
import { Role } from '../../types/bruker';
import { PageWrapper } from '../page-wrapper';

export const LandingPage = () => {
  const { data, isLoading } = useUser();

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  if (data.roller.includes(Role.KABAL_INNSYN_EGEN_ENHET)) {
    return <Navigate replace to="enhetensoppgaver" />;
  }

  if (data.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return <Navigate replace to="sok" />;
  }

  if (data.roller.includes(Role.KABAL_SAKSBEHANDLING)) {
    return <Navigate replace to="/mineoppgaver" />;
  }

  if (data.roller.includes(Role.KABAL_TILGANGSSTYRING_EGEN_ENHET)) {
    return <Navigate replace to="tilgangsstyring" />;
  }

  if (data.roller.includes(Role.KABAL_FAGTEKSTREDIGERING)) {
    return <Navigate replace to="gode-formuleringer" />;
  }

  if (data.roller.includes(Role.KABAL_MALTEKSTREDIGERING)) {
    return <Navigate replace to="maltekster" />;
  }

  if (data.roller.includes(Role.KABAL_ADMIN)) {
    return <Navigate replace to="admin" />;
  }

  return (
    <PageWrapper>
      <ErrorMessage>Ingen tilganger funnet</ErrorMessage>
    </PageWrapper>
  );
};
