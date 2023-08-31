import { ArrowRedoIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import React from 'react';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  rol: IHelper;
  variant?: ButtonProps['variant'];
}

export const TakeFromSaksbehandler = ({ oppgaveId, rol, variant = 'primary' }: Props) => {
  const isRol = useIsRol();
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isRol || rol.flowState !== FlowState.RETURNED) {
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
