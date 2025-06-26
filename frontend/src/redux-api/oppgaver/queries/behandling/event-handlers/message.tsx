import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import { type IMessage, messagesApi, OPTIMISTIC_MESSAGE_ID_PREFIX } from '@app/redux-api/messages';
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
      const { id, text, timestamp, actor } = event;
      const message: IMessage = {
        author: actor,
        id,
        text,
        created: timestamp,
        modified: timestamp,
      };

      if (messages === undefined) {
        return [message];
      }

      const updatedList: IMessage[] = [];
      let isUpdate = false;

      for (const m of messages) {
        if (m.id === message.id) {
          updatedList.push(message);
          isUpdate = true;
        } else if (!m.id.startsWith(OPTIMISTIC_MESSAGE_ID_PREFIX)) {
          updatedList.push(m);
        }
      }

      return isUpdate ? updatedList : [message, ...updatedList];
    }),
  );
};
