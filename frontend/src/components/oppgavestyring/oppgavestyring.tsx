import { HGrid } from '@navikt/ds-react';
import { FradelButton } from '@/components/oppgavestyring/fradel-button';
import { Saksbehandler } from '@/components/oppgavestyring/saksbehandler';
import { TildelButton } from '@/components/oppgavestyring/tildel-button';
import type { IOppgave } from '@/types/oppgaver';

export const Oppgavestyring = (oppgave: IOppgave) => (
  <HGrid columns="110px 400px" gap="space-0 space-8" style={{ gridTemplateAreas: '"tildel saksbehandler"' }}>
    <TildelButton {...oppgave} />
    <FradelButton {...oppgave} />
    <Saksbehandler {...oppgave} />
  </HGrid>
);
