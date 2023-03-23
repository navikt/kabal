import React from 'react';
import styled from 'styled-components';
import { IOppgave } from '@app/types/oppgaver';
import { FradelButton } from './fradel-button';
import { Saksbehandler } from './saksbehandler';
import { TildelButton } from './tildel-button';

export const Oppgavestyring = (oppgave: IOppgave) => (
  <Container>
    <TildelButton {...oppgave} />
    <Saksbehandler {...oppgave} />
    <FradelButton {...oppgave} />
  </Container>
);

const Container = styled.div`
  display: grid;
  column-gap: 8px;
  grid-template-columns: minmax(min-content, auto) 400px minmax(min-content, 110px);
  grid-template-areas: 'tildel saksbehandler fradel';
`;
