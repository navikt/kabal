import React from 'react';
import { IBruker, IEnhet } from '../../redux-api/bruker';
import { OppgaveTable } from '../../components/oppgavetabell/oppgavetabell';

interface Props {
  bruker: IBruker;
  valgtEnhet: IEnhet;
}

export const OppgaverPage: React.FC<Props> = ({ bruker, valgtEnhet }) => (
  <OppgaveTable bruker={bruker} valgtEnhet={valgtEnhet} />
);
