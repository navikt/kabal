import { CheckmarkIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FeilregistrertModal } from '@app/components/feilregistrert-modal/feilregistrert-modal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Feilregistrering } from '../feilregistrering/feilregistrering';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { ConfirmFinish } from './confirm-finish';
import { DeassignOppgave } from './deassign/deassign-oppgave';
import { VentButton } from './sett-paa-vent/vent-button';
import { StyledButtons, StyledUnfinishedErrorFooter, StyledUnfinishedNoErrorFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedFooter = () => {
  const canEdit = useCanEdit();
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const errorContext = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert();
  const { data: oppgave } = useOppgave();

  const hasErrors = useMemo<boolean>(() => {
    if (typeof data === 'undefined') {
      return false;
    }

    return data.sections.length !== 0;
  }, [data]);

  useEffect(() => {
    if (typeof errorContext !== 'undefined' && typeof data !== 'undefined') {
      errorContext.setValidationSectionErrors(data.sections);
    }
  }, [data, errorContext]);

  const showConfirmFinishDisplay = !isFullfoert && showConfirmFinish && !hasErrors && !isFetching;

  const Wrapper = hasErrors ? StyledUnfinishedErrorFooter : StyledUnfinishedNoErrorFooter;

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <Wrapper>
      <StyledButtons>
        <Button
          type="button"
          size="small"
          disabled={!canEdit || isFullfoert || showConfirmFinishDisplay}
          onClick={() => {
            if (typeof oppgave === 'undefined') {
              return;
            }

            validate(oppgave.id);
            setConfirmFinish(true);
          }}
          data-testid="complete-button"
          loading={isFetching}
          icon={<CheckmarkIcon aria-hidden />}
        >
          Fullfør
        </Button>
        <ConfirmFinishDisplay show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
        <VentButton />
        <BackLink />
        <Deassign type={oppgave.typeId} show={oppgave.feilregistrering === null} />
        {oppgave.feilregistrering === null ? (
          <Feilregistrering
            oppgaveId={oppgave.id}
            fagsystemId={oppgave.fagsystemId}
            tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident ?? null}
            variant="secondary"
            $position="over"
            feilregistrert={null}
          />
        ) : (
          <Feilregistrert />
        )}
      </StyledButtons>
      <ValidationSummaryPopup sections={data?.sections ?? []} hasErrors={hasErrors} />
    </Wrapper>
  );
};

interface ConfirmFinishProps {
  show: boolean;
  cancel: () => void;
}

const ConfirmFinishDisplay = ({ show, cancel }: ConfirmFinishProps) => {
  if (show) {
    return <ConfirmFinish cancel={cancel} />;
  }

  return null;
};

const Deassign = ({ type, show }: { type?: SaksTypeEnum; show: boolean }) => {
  if (show && (type === SaksTypeEnum.ANKE || type === SaksTypeEnum.KLAGE)) {
    return <DeassignOppgave />;
  }

  return null;
};

const Feilregistrert = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button
        onClick={() => setIsOpen((o) => !o)}
        variant="primary"
        size="small"
        icon={<InformationSquareIcon aria-hidden />}
      >
        Vis informasjon om feilregistrering
      </Button>
      <FeilregistrertModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};
