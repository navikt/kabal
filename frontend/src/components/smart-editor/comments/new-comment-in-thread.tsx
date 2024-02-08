import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostReplyMutation } from '@app/redux-api/smart-editor-comments';
import { StyledNewReply } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface NewCommentInThreadProps {
  threadId: string;
  isFocused: boolean;
  close: () => void;
  onFocus: () => void;
}

export const NewCommentInThread = ({ threadId, isFocused, close, onFocus }: NewCommentInThreadProps) => {
  const { user } = useContext(StaticDataContext);
  const { data: signature } = useGetMySignatureQuery();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);

  if (!isFocused) {
    return null;
  }

  if (typeof signature === 'undefined' || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
  }

  const onSubmit = async (text: string): Promise<void> => {
    if (documentId === null) {
      return;
    }

    await postReply({
      oppgaveId,
      author: {
        ident: user.navIdent,
        name: signature?.customLongName ?? signature.longName,
      },
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
