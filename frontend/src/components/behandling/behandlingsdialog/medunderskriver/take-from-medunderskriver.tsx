import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getTitleLowercase } from './get-title';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const TakeFromMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const [setMedunderskriverFlowState, { isLoading }] = useSetMedunderskriverFlowStateMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  if (!isSaksbehandler || medunderskriver.flowState !== FlowState.SENT) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowUndoIcon aria-hidden />}
      variant="primary"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.NOT_SENT })}
    >
      Hent tilbake fra {getTitleLowercase(typeId)}
    </Button>
  );
};
