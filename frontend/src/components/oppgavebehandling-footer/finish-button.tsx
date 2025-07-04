import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { ValidationType } from '@app/types/oppgavebehandling/params';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from './confirm-finish';

const TEST_ID = 'complete-button';

export const FinishButton = () => {
  const canEdit = useIsTildeltSaksbehandler();
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

  if (!canEdit || oppgave === undefined) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        type="button"
        size="small"
        disabled={showConfirmFinishDisplay}
        onClick={async () => {
          if (oppgave === undefined) {
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
    </div>
  );
};
