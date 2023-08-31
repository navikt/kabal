import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/rol/helpers';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, IHelper } from '@app/types/oppgave-common';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IHelper;
}

export const SendToSaksbehandler = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (isSaksbehandler || rol.flowState !== FlowState.SENT) {
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
