import { getTitleLowercase } from '@app/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { InlineMessage } from '@navikt/ds-react';

interface Props {
  medunderskriver: IMedunderskriverRol;
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

const useText = ({ employee, flowState }: IMedunderskriverRol, typeId: SaksTypeEnum): string => {
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
  }
};
