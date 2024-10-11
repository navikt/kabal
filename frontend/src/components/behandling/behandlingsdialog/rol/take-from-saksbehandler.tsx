import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { ArrowRedoIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps } from '@navikt/ds-react';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  variant?: ButtonProps['variant'];
}

export const TakeFromSaksbehandler = ({ oppgaveId, variant = 'primary' }: Props) => {
  const isRol = useIsRol();
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();

  if (
    oppgaveIsLoading ||
    oppgave === undefined ||
    (oppgave.typeId !== SaksTypeEnum.KLAGE && oppgave.typeId !== SaksTypeEnum.ANKE) ||
    !isRol
  ) {
    return null;
  }

  const { rol } = oppgave;

  if (rol === null || rol.flowState !== FlowState.RETURNED) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowRedoIcon aria-hidden />}
      variant={variant}
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.SENT })}
    >
      Hent tilbake fra saksbehandler
    </Button>
  );
};
