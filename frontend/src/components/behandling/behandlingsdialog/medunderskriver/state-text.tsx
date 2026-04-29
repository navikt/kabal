import { InlineMessage } from '@navikt/ds-react';
import { getTitleLowercase } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import type { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState, type IMedunderskriver, ReviewFlowState } from '@/types/oppgave-common';

interface Props {
  medunderskriver: IMedunderskriver;
  typeId: SaksTypeEnum;
}

export const MedunderskriverStateText = ({ medunderskriver, typeId }: Props) => {
  const text = useText(medunderskriver, typeId);

  return (
    <InlineMessage status="info" size="small">
      {text}
    </InlineMessage>
  );
};

const useText = ({ employee, flowState }: IMedunderskriver, typeId: SaksTypeEnum): string => {
  const isSaksbehandler = useIsTildeltSaksbehandler();

  switch (flowState) {
    case FlowState.NOT_SENT:
      return 'Ikke oversendt.';
    case FlowState.SENT:
      return isSaksbehandler
        ? `Oversendt til ${employee === null ? 'felles kø' : getTitleLowercase(typeId)}.`
        : 'Oversendt fra saksbehandler.';
    case FlowState.RETURNED:
      return isSaksbehandler ? `Returnert av ${getTitleLowercase(typeId)}.` : 'Returnert til saksbehandler.';
    case ReviewFlowState.APPROVED:
      return isSaksbehandler ? `Godkjent av ${getTitleLowercase(typeId)}.` : 'Returnert med godkjenning.';
    case ReviewFlowState.REJECTED:
      return isSaksbehandler ? `Ikke godkjent av ${getTitleLowercase(typeId)}.` : 'Returnert uten godkjenning.';
  }
};
