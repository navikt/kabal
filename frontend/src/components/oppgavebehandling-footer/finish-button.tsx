import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-finish';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useLazyValidateQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { useLazyGetEkspedisjonsbrevTilTrygderettenNeedsToBeSentQuery } from '@/redux-api/oppgaver/queries/documents';
import { SaksTypeEnum } from '@/types/kodeverk';
import { ValidationType } from '@/types/oppgavebehandling/params';

export const FinishButton = () => {
  const canEdit = useIsTildeltSaksbehandler();
  const [validate, { data: validationData, isLoading, isFetching }] = useLazyValidateQuery();
  const [
    getEkspedisjonsbrevNeedsToBeSent,
    { isFetching: isEkspedisjonsbrevSentFetching, currentData: ekspedisjonsbrevNeedsToBeSent },
  ] = useLazyGetEkspedisjonsbrevTilTrygderettenNeedsToBeSentQuery();
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

  const { id, typeId } = oppgave;

  return (
    <div className="relative">
      <Button
        className="flex"
        type="button"
        size="small"
        disabled={showConfirmFinishDisplay}
        onClick={async () => {
          const validationPromise = validate({ oppgaveId: id, type: ValidationType.FINISH }).unwrap();

          const ekspedisjonsbrevPromise =
            typeId === SaksTypeEnum.ANKE_AFTER_2027 || typeId === SaksTypeEnum.ANKE
              ? getEkspedisjonsbrevNeedsToBeSent(id).unwrap() // Update currentData for useLazyGetEkspedisjonsbrevTilTrygderettenNeedsToBeSentQuery.
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
        <ConfirmFinish
          cancel={() => setConfirmFinish(false)}
          ekspedisjonsbrevNeedsToBeSent={ekspedisjonsbrevNeedsToBeSent}
        />
      ) : null}
    </div>
  );
};
