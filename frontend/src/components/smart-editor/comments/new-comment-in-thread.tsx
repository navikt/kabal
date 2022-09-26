import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostReplyMutation } from '../../../redux-api/smart-editor-comments';
import { useUser } from '../../../simple-api-state/use-user';
import { SmartEditorContext } from '../context/smart-editor-context';
import { StyledNewCommentInThread } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface NewCommentInThreadProps {
  threadId: string;
  isFocused: boolean;
  close: () => void;
  onFocus: () => void;
}

export const NewCommentInThread = ({ threadId, isFocused, close, onFocus }: NewCommentInThreadProps) => {
  const { data: bruker, isLoading: brukerIsLoading } = useUser();
  const { data: signature } = useGetMySignatureQuery();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);

  if (!isFocused) {
    return null;
  }

  if (typeof bruker === 'undefined' || brukerIsLoading || typeof signature === 'undefined' || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
  }

  const onSubmit = async (text: string): Promise<void> => {
    if (documentId === null) {
      return;
    }

    await postReply({
      oppgaveId,
      author: {
        ident: bruker.navIdent,
        name: signature?.customLongName ?? signature.longName,
      },
      dokumentId: documentId,
      text,
      commentId: threadId,
    });
  };

  return (
    <StyledNewCommentInThread>
      <WriteComment
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Svar på kommentar"
        close={close}
        onFocus={onFocus}
        primaryButtonLabel="Legg til"
      />
    </StyledNewCommentInThread>
  );
};
