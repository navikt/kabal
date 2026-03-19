import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getTitleLowercase } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useSetMedunderskriverMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import type { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  medunderskriver: IMedunderskriverRol;
}

export const SendToMedunderskriver = ({ oppgaveId, typeId, medunderskriver }: Props) => {
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const [, medunderskriverLoader] = useSetMedunderskriverMutation({ fixedCacheKey: oppgaveId });
  const [setMedunderskriverFlowState, loader] = useSetMedunderskriverFlowStateMutation();

  if (!isSaksbehandler || medunderskriver.employee === null || medunderskriver.flowState === FlowState.SENT) {
    return null;
  }

  return (
    <Button
      data-color="neutral"
      size="small"
      variant="secondary"
      type="button"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.SENT })}
      loading={loader.isLoading || medunderskriverLoader.isLoading}
      data-testid="send-to-medunderskriver"
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send til {getTitleLowercase(typeId)}
    </Button>
  );
};
