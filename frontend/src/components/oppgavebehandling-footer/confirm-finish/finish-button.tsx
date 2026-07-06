import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { isReduxValidationResponse } from '@/functions/error-type-guard';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { IFinishOppgavebehandlingParams } from '@/types/oppgavebehandling/params';

interface FinishButtonProps {
  nyBehandling?: boolean;
  children: string;
  disabled: boolean;
}

export const FinishButton = ({ children, nyBehandling = false, disabled }: FinishButtonProps) => {
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || oppgave === undefined) {
    return null;
  }

  const finish = async () => {
    const params: IFinishOppgavebehandlingParams =
      (oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET) ||
      (oppgave.typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR &&
        oppgave.resultat.utfallId === UtfallEnum.GJENOPPTATT_OPPHEVET)
        ? {
            oppgaveId: oppgave.id,
            typeId: oppgave.typeId,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling,
          }
        : {
            oppgaveId: oppgave.id,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling: false,
          };

    try {
      const { isAvsluttetAvSaksbehandler } = await finishOppgavebehandling(params).unwrap();
      setHasBeenFinished(isAvsluttetAvSaksbehandler);
      errorContext?.setValidationSectionErrors([]);
    } catch (error) {
      if (isReduxValidationResponse(error)) {
        errorContext.setValidationSectionErrors(error.data.sections);
      }
    }
  };

  return (
    <Button
      variant="primary"
      size="small"
      type="button"
      onClick={finish}
      loading={hasBeenFinished || loader.isLoading}
      disabled={hasBeenFinished || loader.isLoading || disabled}
      icon={<CheckmarkIcon aria-hidden />}
      className="w-fit [grid-area:left]"
    >
      {children}
    </Button>
  );
};
