import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { GosysOppgaveEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { behandlingerQuerySlice } from '../behandling';

export const handleGosysOppgaveEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  async ({ actor, timestamp, gosysOppgave }: GosysOppgaveEvent) => {
    reduxStore.dispatch(
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

    await reduxStore.dispatch(behandlingerQuerySlice.util.upsertQueryData('getGosysOppgave', oppgaveId, gosysOppgave)); // Wait for this to prevent fetching the same data again from the API.

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
