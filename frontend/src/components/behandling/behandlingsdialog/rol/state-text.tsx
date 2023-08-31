import { Alert } from '@navikt/ds-react';
import React from 'react';
import { FlowState, IHelper } from '@app/types/oppgave-common';

interface Props {
  rol: IHelper;
  isSaksbehandler: boolean;
}

export const RolStateText = ({ rol, isSaksbehandler }: Props) => {
  const text = useText(rol, isSaksbehandler);

  return (
    <Alert variant="info" size="small" inline>
      {text}
    </Alert>
  );
};

const useText = ({ navIdent, flowState }: IHelper, isSaksbehandler: boolean): string => {
  switch (flowState) {
    case FlowState.NOT_SENT:
      return navIdent === null ? 'Ikke i felles kø eller oversendt.' : 'Ikke oversendt.';
    case FlowState.SENT:
      return isSaksbehandler
        ? `Oversendt til ${navIdent === null ? 'felles kø' : 'rådgivende overlege'}.`
        : 'Oversendt fra saksbehandler.';
    case FlowState.RETURNED:
      return isSaksbehandler ? 'Returnert av rådgivende overlege.' : 'Returnert til saksbehandler.';
  }
};
