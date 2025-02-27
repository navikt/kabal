import type { IOppgave } from '@app/types/oppgaver';
import { styled } from 'styled-components';
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
  column-gap: var(--a-spacing-2);
  grid-template-columns: 110px 400px;
  grid-template-areas: 'tildel saksbehandler';
`;
