import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useCallback, useContext, useState } from 'react';
import { ReactEditor } from 'slate-react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { usePostCommentMutation } from '../../../redux-api/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { connectCommentThread } from '../elements/rich-text/connect-thread';
import { StyledCommentButton, StyledCommentButtonContainer, StyledNewComment } from './styled-components';

export const NewComment = () => {
  const oppgaveId = useOppgaveId();
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const [postComment] = usePostCommentMutation();
  const { documentId } = useContext(SmartEditorContext);

  const [text, setText] = useState<string>('');

  const { editor, selection } = useContext(SmartEditorContext);

  const onNewThread = useCallback(
    (threadId: string) => {
      if (editor === null) {
        return;
      }

      ReactEditor.focus(editor);
      connectCommentThread(editor, selection, threadId);
    },
    [editor, selection]
  );

  if (typeof bruker === 'undefined' || brukerIsLoading) {
    return <NavFrontendSpinner />;
  }

  const onSubmit = () => {
    if (documentId === null || text.length <= 0) {
      return;
    }

    postComment({
      author: {
        ident: bruker.info.navIdent,
        name: bruker.info.sammensattNavn,
      },
      dokumentId: documentId,
      text,
      oppgaveId,
    })
      .unwrap()
      .then(({ id }) => {
        onNewThread(id);
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
    <StyledNewComment>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Skriv inn en kommentar"
        maxLength={0}
      />
      <StyledCommentButtonContainer>
        <StyledCommentButton mini onClick={onSubmit} disabled={text.length <= 0}>
          Legg til
        </StyledCommentButton>
        <Knapp mini>Avbryt</Knapp>
      </StyledCommentButtonContainer>
    </StyledNewComment>
  );
};
