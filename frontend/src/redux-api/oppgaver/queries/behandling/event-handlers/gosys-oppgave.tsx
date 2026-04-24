import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { employeeName } from '@/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { GosysOppgaveEvent } from '@/redux-api/server-sent-events/types';
import type {
  BehandlingGosysOppgave,
  IOppgavebehandling,
  ListGosysOppgave,
} from '@/types/oppgavebehandling/oppgavebehandling';

type UpdateGosysOppgaveList = (recipe: (draft: ListGosysOppgave[]) => void) => void;
type UpsertGosysOppgave = (gosysOppgave: BehandlingGosysOppgave) => Promise<unknown>;

export const handleGosysOppgaveEvent =
  (
    oppgaveId: string,
    userId: string,
    updateCachedData: UpdateFn<IOppgavebehandling>,
    updateGosysOppgaveList: UpdateGosysOppgaveList,
    upsertGosysOppgave: UpsertGosysOppgave,
  ) =>
  async ({ actor, timestamp, gosysOppgave }: GosysOppgaveEvent) => {
    updateGosysOppgaveList((draft) => {
      for (const oppgave of draft) {
        if (oppgave.id === gosysOppgave.id) {
          oppgave.alreadyUsedBy = oppgaveId;
        } else if (oppgave.alreadyUsedBy === oppgaveId) {
          oppgave.alreadyUsedBy = null;
        }
      }
    });

    await upsertGosysOppgave(gosysOppgave);

    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        toast.info(
          <InfoToast title="Oppgave fra Gosys">{employeeName(actor)} har endret oppgave fra Gosys.</InfoToast>,
        );
      }

      draft.gosysOppgaveId = gosysOppgave.id;
      draft.modified = timestamp;
    });
  };
