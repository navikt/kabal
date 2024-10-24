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
    await reduxStore.dispatch(behandlingerQuerySlice.util.upsertQueryData('getGosysOppgave', oppgaveId, gosysOppgave));

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
