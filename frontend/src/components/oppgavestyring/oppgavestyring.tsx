import React from 'react';
import { styled } from 'styled-components';
import { IOppgave } from '@app/types/oppgaver';
import { FradelButton } from './fradel-button';
import { Saksbehandler } from './saksbehandler';
import { TildelButton } from './tildel-button';

export const Oppgavestyring = (oppgave: IOppgave) => (
  <Container>
    <TildelButton {...oppgave} />
    <FradelButton {...oppgave} />
    <Saksbehandler {...oppgave} />
  </Container>
);

const Container = styled.div`
  display: grid;
  column-gap: 8px;
  grid-template-columns: 110px 400px;
  grid-template-areas: 'tildel saksbehandler';
`;
