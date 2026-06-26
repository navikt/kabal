import { HGrid, HStack } from '@navikt/ds-react';
import { Rol } from '@/components/common-table-components/rol';
import { FradelRolButton } from '@/components/krolstyring/fradel-rol-button';
import { TildelRolButton } from '@/components/krolstyring/tildel-rol-button';
import type { IOppgave } from '@/types/oppgaver';

export const KrolStyring = (oppgave: IOppgave) => (
  <HGrid columns="110px 400px" gap="space-0 space-8" style={{ gridTemplateAreas: '"tildel rol"' }}>
    <TildelRolButton {...oppgave} />
    <FradelRolButton id={oppgave.id} rol={oppgave.rol} />
    <HStack align="center" justify="start" height="34px" width="100%" className="[grid-area:rol]">
      <Rol oppgaveId={oppgave.id} rolIdent={oppgave.rol.employee?.navIdent ?? null} />
    </HStack>
  </HGrid>
);
