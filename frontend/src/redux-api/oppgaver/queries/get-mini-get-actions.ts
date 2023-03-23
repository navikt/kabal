import { ISaksbehandler } from '@app/types/oppgave-common';
import { IPerson } from '@app/types/oppgavebehandling/response';
import { IOppgave } from '@app/types/oppgaver';
import { behandlingerQuerySlice } from './behandling';

export const getMiniGetActions = (oppgaver: IOppgave[]) =>
  oppgaver.flatMap(
    ({
      id,
      person,
      tildeltSaksbehandlerident,
      tildeltSaksbehandlerNavn,
      medunderskriverident,
      medunderskriverNavn,
      medunderskriverFlyt,
    }) => {
      const saksbehandler: ISaksbehandler | null =
        tildeltSaksbehandlerident === null || tildeltSaksbehandlerNavn === null
          ? null
          : { navIdent: tildeltSaksbehandlerident, navn: tildeltSaksbehandlerNavn };

      const medunderskriver: ISaksbehandler | null =
        medunderskriverident === null || medunderskriverNavn === null
          ? null
          : { navIdent: medunderskriverident, navn: medunderskriverNavn };

      const sakenGjelder: IPerson | null = person === null ? null : person;

      const actions = [
        behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', id, () => ({ saksbehandler })),
        behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', id, () => ({ medunderskriver })),
        behandlingerQuerySlice.util.updateQueryData('getMedunderskriverflyt', id, () => ({ medunderskriverFlyt })),
        behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', id, (draft) => ({
          ...draft,
          tildeltSaksbehandler: saksbehandler,
          medunderskriver,
          medunderskriverFlyt,
        })),
      ];

      if (sakenGjelder !== null) {
        actions.push(behandlingerQuerySlice.util.updateQueryData('getSakenGjelder', id, () => ({ sakenGjelder })));
      }

      return actions;
    }
  );
