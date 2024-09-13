import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getTitleLowercase } from './get-title';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  medunderskriver: IMedunderskriverRol;
}

export const SendToMedunderskriver = ({ oppgaveId, typeId, medunderskriver }: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const [, medunderskriverLoader] = useSetMedunderskriverMutation({ fixedCacheKey: oppgaveId });
  const [setMedunderskriverFlowState, loader] = useSetMedunderskriverFlowStateMutation();

  if (!isSaksbehandler || medunderskriver.flowState === FlowState.SENT) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="primary"
      type="button"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.SENT })}
      disabled={medunderskriver.employee === null}
      loading={loader.isLoading || medunderskriverLoader.isLoading}
      data-testid="send-to-medunderskriver"
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send til {getTitleLowercase(typeId)}
    </Button>
  );
};
