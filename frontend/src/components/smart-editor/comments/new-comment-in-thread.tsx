import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { usePostReplyMutation } from '@app/redux-api/smart-editor-comments';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledNewReply } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface NewCommentInThreadProps {
  threadId: string;
  isFocused: boolean;
  close: () => void;
  onFocus: () => void;
}

export const NewCommentInThread = ({ threadId, isFocused, close, onFocus }: NewCommentInThreadProps) => {
  const { data: bruker, isLoading: brukerIsLoading } = useUser();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);

  if (!isFocused) {
    return null;
  }

  if (typeof bruker === 'undefined' || brukerIsLoading || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
  }

  const onSubmit = async (text: string): Promise<void> => {
    if (documentId === null) {
      return;
    }

    await postReply({
      oppgaveId,
      author: { ident: bruker.navIdent, name: bruker.name },
      dokumentId: documentId,
      text,
      commentId: threadId,
    });
  };

  return (
    <StyledNewReply>
      <WriteComment
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Svar på kommentar"
        close={close}
        onFocus={onFocus}
        primaryButtonLabel="Legg til"
      />
    </StyledNewReply>
  );
};
