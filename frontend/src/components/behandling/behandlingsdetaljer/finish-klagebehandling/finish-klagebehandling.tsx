import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import 'nav-frontend-knapper-style';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../../../redux-api/oppgave';
import { StyledPaddedContent, StyledSubHeader } from '../../styled-components';
import { ConfirmFinish } from './confirm-finish';
import { KlagebehandlingFinished } from './klagebehandling-finished';

export const FinishKlagebehandling = () => {
  const id = useKlagebehandlingId();
  const canEdit = useCanEdit(id);
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);
  const [showConfirmFinish, setConfirmFinish] = useState(false);

  if (!canEdit) {
    return null;
  }

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

  return (
    <>
      <StyledPaddedContent>
        <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
        {!showConfirmFinish && (
          <Knapp mini onClick={showFinish}>
            Fullfør klagebehandling
          </Knapp>
        )}
      </StyledPaddedContent>
      {showConfirmFinish && <ConfirmFinish cancel={cancel} />}
    </>
  );
};
