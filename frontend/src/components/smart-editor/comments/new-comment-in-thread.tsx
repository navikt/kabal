import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { usePostCommentReplyMutation } from '../../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { StyledCommentButton, StyledCommentButtonContainer, StyledNewCommentInThread } from './styled-components';

interface NewCommentInThreadProps {
  threadId: string;
  onFocusChange: (focused: boolean) => void;
  focused: boolean;
}

export const NewCommentInThread = ({ threadId, onFocusChange, focused }: NewCommentInThreadProps) => {
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const [postReply] = usePostCommentReplyMutation();
  const oppgaveId = useOppgaveId();
  const { data: smartEditorData } = useGetSmartEditorIdQuery(oppgaveId);

  const [text, setText] = useState<string>('');

  if (
    typeof bruker === 'undefined' ||
    brukerIsLoading ||
    typeof smartEditorData === 'undefined' ||
    smartEditorData?.smartEditorId === null
  ) {
    return <NavFrontendSpinner />;
  }

  const onSubmit = () => {
    if (smartEditorData?.smartEditorId === null || text.length <= 0) {
      return;
    }

    postReply({
      author: {
        ident: bruker.info.navIdent,
        name: bruker.info.sammensattNavn,
      },
      documentId: smartEditorData?.smartEditorId,
      text,
      threadId,
    }).then(() => {
      setText('');
    });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <StyledNewCommentInThread>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Svar"
        maxLength={0}
        onFocus={() => onFocusChange(true)}
      />
      {focused && (
        <StyledCommentButtonContainer>
          <StyledCommentButton mini onClick={onSubmit} disabled={text.length <= 0}>
            Legg til
          </StyledCommentButton>
          <Knapp mini onClick={() => onFocusChange(false)}>
            Avbryt
          </Knapp>
        </StyledCommentButtonContainer>
      )}
    </StyledNewCommentInThread>
  );
};
