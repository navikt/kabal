import { InlineMessage } from '@navikt/ds-react';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { FlowState, type IMedunderskriver, ReviewFlowState } from '@/types/oppgave-common';

interface Props {
  medunderskriver: IMedunderskriver;
}

export const MedunderskriverStateText = ({ medunderskriver }: Props) => {
  const text = useText(medunderskriver);

  return (
    <InlineMessage status="info" size="small">
      {text}
    </InlineMessage>
  );
};

const useText = ({ employee, flowState }: IMedunderskriver): string => {
  const isSaksbehandler = useIsTildeltSaksbehandler();

  switch (flowState) {
    case FlowState.NOT_SENT:
      return 'Ikke oversendt.';
    case FlowState.SENT:
      return isSaksbehandler
        ? `Oversendt til ${employee === null ? 'felles kø' : 'medunderskriver'}.`
        : 'Oversendt fra saksbehandler.';
    case FlowState.RETURNED:
      return isSaksbehandler ? 'Returnert av medunderskriver.' : 'Returnert til saksbehandler.';
    case ReviewFlowState.APPROVED:
      return isSaksbehandler ? 'Godkjent av medunderskriver.' : 'Returnert med godkjenning.';
    case ReviewFlowState.REJECTED:
      return isSaksbehandler ? 'Ikke godkjent av medunderskriver.' : 'Returnert uten godkjenning.';
  }
};
