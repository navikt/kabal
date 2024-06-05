import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { ValidationType } from '@app/types/oppgavebehandling/params';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from './confirm-finish';

const TEST_ID = 'complete-button';

export const FinishButton = () => {
  const canEdit = useCanEdit();
  const [validate, { data: validationData, isLoading, isFetching }] = useLazyValidateQuery();
  const { setValidationSectionErrors } = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert();
  const { data: oppgave } = useOppgave();

  const showConfirmFinishDisplay =
    !isFullfoert &&
    showConfirmFinish &&
    !isFetching &&
    validationData !== undefined &&
    validationData.sections.length === 0;

  if (isFullfoert) {
    return (
      <Button disabled size="small" data-testid={TEST_ID} icon={<CheckmarkIcon aria-hidden />}>
        Fullført
      </Button>
    );
  }

  if (!canEdit || typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <Container>
      <Button
        type="button"
        size="small"
        disabled={showConfirmFinishDisplay}
        onClick={async () => {
          if (typeof oppgave === 'undefined') {
            return;
          }

          const validation = await validate({ oppgaveId: oppgave.id, type: ValidationType.FINISH }).unwrap();
          setValidationSectionErrors(validation.sections);
          setConfirmFinish(true);
        }}
        data-testid={TEST_ID}
        loading={isFetching || isLoading}
        icon={<CheckmarkIcon aria-hidden />}
      >
        Fullfør
      </Button>
      <ConfirmFinish show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;
