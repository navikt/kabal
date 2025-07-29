import type { IOppgave } from '@app/types/oppgaver';
import { HGrid } from '@navikt/ds-react';
import { FradelButton } from './fradel-button';
import { Saksbehandler } from './saksbehandler';
import { TildelButton } from './tildel-button';

export const Oppgavestyring = (oppgave: IOppgave) => (
  <HGrid columns="110px 400px" gap="0 2" style={{ gridTemplateAreas: '"tildel saksbehandler"' }}>
    <TildelButton {...oppgave} />
    <FradelButton {...oppgave} />
    <Saksbehandler {...oppgave} />
  </HGrid>
);
