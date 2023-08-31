import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { getTitleLowercase } from './get-title';

interface Props {
  medunderskriver: IHelper;

  typeId: SaksTypeEnum;
}

export const MedunderskriverStateText = ({ medunderskriver, typeId }: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const text = useText(medunderskriver, isSaksbehandler, typeId);

  return (
    <Alert variant="info" size="small" inline>
      {text}
    </Alert>
  );
};

const useText = ({ navIdent, flowState }: IHelper, isSaksbehandler: boolean, typeId: SaksTypeEnum): string => {
  switch (flowState) {
    case FlowState.NOT_SENT:
      return 'Ikke oversendt.';
    case FlowState.SENT:
      return isSaksbehandler
        ? `Oversendt til ${navIdent === null ? 'felles kø' : getTitleLowercase(typeId)}.`
        : 'Oversendt fra saksbehandler.';
    case FlowState.RETURNED:
      return isSaksbehandler ? `Returnert av ${getTitleLowercase(typeId)}.` : 'Returnert til saksbehandler.';
  }
};
