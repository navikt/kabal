import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { useOppgaveId } from '../../../hooks/use-oppgave-id';
import { useGetAllCommentsQuery } from '../../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { SmartEditorContext } from '../context/smart-editor-context';
import { Thread } from './thread';

export const ThreadList = () => {
  const oppgaveId = useOppgaveId();
  const { data: smartEditorId } = useGetSmartEditorIdQuery(oppgaveId);
  const options = { pollingInterval: 3 * 1000 };
  const { data: threads, isLoading } = useGetAllCommentsQuery(smartEditorId?.smartEditorId ?? skipToken, options);
  const { focusedThreadIds } = useContext(SmartEditorContext);

  if (focusedThreadIds.length > 0) {
    return (
      <>
        {focusedThreadIds.map((id) => (
          <Thread key={id} threadId={id} threads={threads} />
        ))}
      </>
    );
  }

  if (threads === undefined) {
    return null;
  }

  if (isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <>
      {threads.map(({ id }) => (
        <Thread key={id} threadId={id} threads={threads} />
      ))}
    </>
  );
};
