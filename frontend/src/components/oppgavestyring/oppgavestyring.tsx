import { FradelButton } from '@app/components/oppgavestyring/fradel-button';
import { Saksbehandler } from '@app/components/oppgavestyring/saksbehandler';
import { TildelButton } from '@app/components/oppgavestyring/tildel-button';
import type { IOppgave } from '@app/types/oppgaver';
import { HGrid } from '@navikt/ds-react';

export const Oppgavestyring = (oppgave: IOppgave) => (
  <HGrid columns="110px 400px" gap="space-0 space-8" style={{ gridTemplateAreas: '"tildel saksbehandler"' }}>
    <TildelButton {...oppgave} />
    <FradelButton {...oppgave} />
    <Saksbehandler {...oppgave} />
  </HGrid>
);
