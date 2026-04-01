import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { getReduxStore } from '@/redux/store-ref';
import { employeeName } from '@/redux-api/oppgaver/queries/behandling/event-handlers/common';
import { getBehandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/query-slice-ref';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { GosysOppgaveEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const handleGosysOppgaveEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  async ({ actor, timestamp, gosysOppgave }: GosysOppgaveEvent) => {
    const behandlingerQuerySlice = getBehandlingerQuerySlice();

    getReduxStore().dispatch(
      behandlingerQuerySlice.util.updateQueryData('getGosysOppgaveList', oppgaveId, (draft) => {
        for (const oppgave of draft) {
          if (oppgave.id === gosysOppgave.id) {
            oppgave.alreadyUsedBy = oppgaveId;
          } else if (oppgave.alreadyUsedBy === oppgaveId) {
            oppgave.alreadyUsedBy = null;
          }
        }
      }),
    );

    await getReduxStore().dispatch(
      behandlingerQuerySlice.util.upsertQueryData('getGosysOppgave', oppgaveId, gosysOppgave),
    ); // Wait for this to prevent fetching the same data again from the API.

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
