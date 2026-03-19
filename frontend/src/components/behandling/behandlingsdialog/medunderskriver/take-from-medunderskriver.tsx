import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getTitleLowercase } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useSetMedunderskriverFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import type { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const TakeFromMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const isSaksbehandler = useIsTildeltSaksbehandler();
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
      variant="secondary"
      data-color="neutral"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.NOT_SENT })}
    >
      Hent tilbake fra {getTitleLowercase(typeId)}
    </Button>
  );
};
