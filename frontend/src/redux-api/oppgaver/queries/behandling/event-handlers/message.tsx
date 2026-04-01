import { BodyShort } from '@navikt/ds-react';
import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { getReduxStore } from '@/redux/store-ref';
import { type IMessage, messagesApi } from '@/redux-api/messages';
import type { NewMessageEvent } from '@/redux-api/server-sent-events/types';

export const handleMessageEvent = (oppgaveId: string, userId: string) => (event: NewMessageEvent) => {
  if (event.actor.navIdent !== userId) {
    toast.info(
      <InfoToast title={`Ny melding fra ${formatEmployeeName(event.actor)}`}>
        <BodyShort>{event.text}</BodyShort>
      </InfoToast>,
    );
  }

  getReduxStore().dispatch(
    messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) => {
      const { id, text, timestamp, actor, notify } = event;

      if (messages === undefined) {
        return [{ author: actor, id, text, created: timestamp, modified: null, notify }];
      }

      const updatedList: IMessage[] = [];
      let isUpdate = false;

      for (const m of messages) {
        if (m.id === id) {
          updatedList.push({ ...m, text, modified: timestamp, notify });
          isUpdate = true;
        } else {
          updatedList.push(m);
        }
      }

      if (isUpdate) {
        return updatedList;
      }

      return [{ author: actor, id, text, created: timestamp, modified: null, notify }, ...updatedList].toSorted(
        (a, b) => b.created.localeCompare(a.created),
      );
    }),
  );
};
