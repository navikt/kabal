import { Alert } from '@navikt/ds-react';
import { FlowState, IMedunderskriverRol } from '@app/types/oppgave-common';

interface Props {
  rol: IMedunderskriverRol;
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

const useText = ({ employee, flowState }: IMedunderskriverRol, isSaksbehandler: boolean): string => {
  switch (flowState) {
    case FlowState.NOT_SENT:
      return employee === null ? 'Ikke i felles kø eller oversendt.' : 'Ikke oversendt.';
    case FlowState.SENT:
      return isSaksbehandler
        ? `Oversendt til ${employee === null ? 'felles kø' : 'rådgivende overlege'}.`
        : 'Oversendt fra saksbehandler.';
    case FlowState.RETURNED:
      return isSaksbehandler ? 'Returnert av rådgivende overlege.' : 'Returnert til saksbehandler.';
  }
};
