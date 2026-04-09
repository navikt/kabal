import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from '@/components/oppgavebehandling-footer/confirm-finish';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useLazyValidateQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { ValidationType } from '@/types/oppgavebehandling/params';

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
      <Button disabled size="small" icon={<CheckmarkIcon aria-hidden />}>
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
        className="flex"
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
        loading={isFetching || isLoading}
        icon={<CheckmarkIcon aria-hidden />}
      >
        Fullfør
      </Button>
      <ConfirmFinish show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
    </div>
  );
};
