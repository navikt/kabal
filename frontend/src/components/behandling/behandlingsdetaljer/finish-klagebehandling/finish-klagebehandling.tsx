import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import 'nav-frontend-knapper-style';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { ApiError } from '../../../../redux-api/error-type';
import { useGetKlagebehandlingQuery } from '../../../../redux-api/oppgave';
import { StyledPaddedContent, StyledSubHeader } from '../../styled-components';
import { ConfirmFinish } from './confirm-finish';
import { ErrorMessage } from './error-messages';
import { KlagebehandlingFinished } from './klagebehandling-finished';

export const FinishKlagebehandling = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const cancel = () => {
    setConfirmFinish(false);
  };

  const showFinish = () => {
    setConfirmFinish(true);
  };

  if (klagebehandling.avsluttetAvSaksbehandler !== null) {
    return <KlagebehandlingFinished utfall={klagebehandling.resultat.utfall} />;
  }

  if (!canEdit) {
    return null;
  }

  return (
    <>
      <StyledPaddedContent>
        <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
        <ErrorMessage error={error} />
        {!showConfirmFinish && (
          <Knapp mini onClick={showFinish}>
            Fullfør klagebehandling
          </Knapp>
        )}
      </StyledPaddedContent>
      {showConfirmFinish && <ConfirmFinish cancel={cancel} setError={setError} />}
    </>
  );
};
