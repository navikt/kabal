import React from 'react';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return SKELETON;
  }

  if (oppgave.strengtFortrolig === true) {
    return null;
  }

  return (
    <>
      <MedunderskriverInfo
        typeId={oppgave.typeId}
        tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
        medunderskriverident={oppgave.medunderskriverident}
      />
      <SelectMedunderskriver
        ytelseId={oppgave.ytelseId}
        typeId={oppgave.typeId}
        id={oppgave.id}
        medunderskriverident={oppgave.medunderskriverident}
      />
      <SendTilMedunderskriver
        id={oppgave.id}
        typeId={oppgave.typeId}
        medunderskriverident={oppgave.medunderskriverident}
        medunderskriverFlyt={oppgave.medunderskriverFlyt}
      />
      <SendTilSaksbehandler id={oppgave.id} medunderskriverFlyt={oppgave.medunderskriverFlyt} />
    </>
  );
};
