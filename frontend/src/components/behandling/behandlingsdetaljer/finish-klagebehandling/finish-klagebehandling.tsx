import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import 'nav-frontend-knapper-style';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery, useLazyValidateQuery } from '../../../../redux-api/oppgave';
import { ValidationErrorContext } from '../../../kvalitetsvurdering/validation-error-context';
import { StyledPaddedContent, StyledSubHeader } from '../../styled-components';
import { ConfirmFinish } from './confirm-finish';
import { ValidationSummary } from './error-messages';
import { KlagebehandlingFinished } from './klagebehandling-finished';

export const FinishKlagebehandling = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit();
  const isFullfoert = useIsFullfoert(klagebehandlingId);
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const errorContext = useContext(ValidationErrorContext);

  const hasErrors = useMemo<boolean>(() => {
    if (typeof data === 'undefined') {
      return false;
    }

    return data['invalid-properties'].length !== 0;
  }, [data]);

  useEffect(() => {
    if (typeof errorContext !== 'undefined' && typeof data !== 'undefined') {
      errorContext.setValidationErrors(data['invalid-properties']);
    }
  }, [data, errorContext]);

  useEffect(() => {
    if (klagebehandling?.isAvsluttetAvSaksbehandler === false) {
      setConfirmFinish(false);
    }
  }, [setConfirmFinish, klagebehandling]);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert) {
    return <KlagebehandlingFinished utfall={klagebehandling.resultat.utfall} />;
  }

  if (!canEdit) {
    return null;
  }

  return (
    <>
      <StyledPaddedContent>
        <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
        <ValidationSummary errors={data?.['invalid-properties'] ?? []} />
        {(!showConfirmFinish || hasErrors) && (
          <Knapp
            mini
            onClick={() => {
              validate(klagebehandlingId);
              setConfirmFinish(true);
            }}
            spinner={isFetching}
            autoDisableVedSpinner
            data-testid="finish-klagebehandling-button"
          >
            Fullfør klagebehandling
          </Knapp>
        )}
      </StyledPaddedContent>
      {showConfirmFinish && !hasErrors && !isFetching && (
        <StyledPaddedContent>
          <ConfirmFinish cancel={() => setConfirmFinish(false)} />
        </StyledPaddedContent>
      )}
    </>
  );
};
