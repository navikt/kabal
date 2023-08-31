import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IHelper;
}

export const TakeFromRol = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isSaksbehandler || rol.flowState !== FlowState.SENT) {
    return null;
  }

  const from = rol.navIdent === null ? 'felles kø' : 'rådgivende overlege';

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowUndoIcon aria-hidden />}
      variant="primary"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.NOT_SENT })}
    >
      Hent tilbake fra {from}
    </Button>
  );
};
