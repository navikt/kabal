import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import { type IMessage, messagesApi } from '@app/redux-api/messages';
import type { NewMessageEvent } from '@app/redux-api/server-sent-events/types';
import { BodyShort } from '@navikt/ds-react';

export const handleMessageEvent = (oppgaveId: string, userId: string) => (event: NewMessageEvent) => {
  if (event.actor.navIdent !== userId) {
    toast.info(
      <InfoToast title={`Ny melding fra ${formatEmployeeName(event.actor)}`}>
        <BodyShort>{event.text}</BodyShort>
      </InfoToast>,
    );
  }

  reduxStore.dispatch(
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
