import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/rol/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
}

export const SendToSaksbehandler = ({ oppgaveId, isSaksbehandler }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();

  if (
    isSaksbehandler ||
    oppgaveIsLoading ||
    oppgave === undefined ||
    (oppgave.typeId !== SaksTypeEnum.KLAGE && oppgave.typeId !== SaksTypeEnum.ANKE)
  ) {
    return null;
  }

  const { rol } = oppgave;

  if (rol.flowState !== FlowState.SENT) {
    return null;
  }

  return (
    <Button
      size="small"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.RETURNED })}
      icon={<PaperplaneIcon aria-hidden />}
      loading={isLoading}
    >
      Send tilbake til saksbehandler
    </Button>
  );
};
