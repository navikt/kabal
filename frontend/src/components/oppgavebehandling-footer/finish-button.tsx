import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-finish';
import { isAnkeToTrygderettenUtfall } from '@/components/oppgavebehandling-footer/confirm-finish/helpers';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useLazyValidateQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { useLazyGetEkspedisjonsbrevTilTrygderettenIsSentQuery } from '@/redux-api/oppgaver/queries/documents';
import { ValidationType } from '@/types/oppgavebehandling/params';

export const FinishButton = () => {
  const canEdit = useIsTildeltSaksbehandler();
  const [validate, { data: validationData, isLoading, isFetching }] = useLazyValidateQuery();
  const [
    getEkspedisjonsbrevIsSent,
    { isFetching: isEkspedisjonsbrevSentFetching, currentData: isEkspedisjonsbrevSent },
  ] = useLazyGetEkspedisjonsbrevTilTrygderettenIsSentQuery();
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

  const { id, typeId, resultat } = oppgave;
  const { utfallId } = resultat;

  return (
    <div className="relative">
      <Button
        className="flex"
        type="button"
        size="small"
        disabled={showConfirmFinishDisplay}
        onClick={async () => {
          const validationPromise = validate({ oppgaveId: id, type: ValidationType.FINISH }).unwrap();

          const ekspedisjonsbrevPromise = isAnkeToTrygderettenUtfall(typeId, utfallId)
            ? getEkspedisjonsbrevIsSent(id).unwrap() // Trigger ekspedisjonsbrev sent check. Just to populate the RTKQ state, not for local use.
            : Promise.resolve(undefined);

          const [validation] = await Promise.all([validationPromise, ekspedisjonsbrevPromise]);

          setValidationSectionErrors(validation.sections);
          setConfirmFinish(true);
        }}
        loading={isFetching || isLoading || isEkspedisjonsbrevSentFetching}
        icon={<CheckmarkIcon aria-hidden />}
      >
        Fullfør
      </Button>
      {showConfirmFinishDisplay ? (
        <ConfirmFinish cancel={() => setConfirmFinish(false)} isEkspedisjonsbrevSent={isEkspedisjonsbrevSent} />
      ) : null}
    </div>
  );
};
