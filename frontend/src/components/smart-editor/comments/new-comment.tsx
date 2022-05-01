import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useCallback, useContext, useState } from 'react';
import { Range, Transforms } from 'slate';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetBrukerQuery, useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostCommentMutation } from '../../../redux-api/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { CommentableVoidElementTypes } from '../editor-types';
import { connectCommentThread } from '../rich-text-editor/connect-thread';
import { StyledCommentButton, StyledCommentButtonContainer, StyledNewComment } from './styled-components';

interface Props {
  close: () => void;
}

export const NewComment = ({ close }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const [postComment, { isLoading }] = usePostCommentMutation();
  const { documentId, setFocusedThreadId, activeElement, editor, selection } = useContext(SmartEditorContext);
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const [text, setText] = useState<string>('');

  const onNewThread = useCallback(
    (threadId: string) => {
      if (editor === null) {
        return;
      }

      if (selection !== null && Range.isExpanded(selection)) {
        connectCommentThread(editor, selection, threadId);
        return;
      }

      if (activeElement !== null) {
        const { threadIds } = activeElement;
        Transforms.setNodes<CommentableVoidElementTypes>(
          editor,
          { threadIds: [...threadIds, threadId] },
          {
            at: [],
            match: (n) => n === activeElement,
          }
        );
      }
    },
    [activeElement, editor, selection]
  );

  if (signatureIsLoading || brukerIsLoading || typeof bruker === 'undefined' || typeof signature === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const onSubmit = () => {
    if (documentId === null || text.length <= 0) {
      return;
    }

    postComment({
      author: {
        ident: bruker.navIdent,
        name: signature.customLongName ?? signature.longName,
      },
      dokumentId: documentId,
      text,
      oppgaveId,
    })
      .unwrap()
      .then(({ id }) => {
        onNewThread(id);
        setText('');
        close();
        setTimeout(() => {
          setFocusedThreadId(id);
        }, 1000);
      });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }

    if (event.key === 'Escape') {
      close();
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
        disabled={isLoading}
        autoFocus
      />
      <StyledCommentButtonContainer>
        <StyledCommentButton
          mini
          kompakt
          onClick={onSubmit}
          disabled={text.length <= 0}
          spinner={isLoading}
          autoDisableVedSpinner
          title="Ctrl/⌘ + Enter"
        >
          Legg til
        </StyledCommentButton>
        <Knapp onClick={close} mini kompakt disabled={isLoading} title="Escape">
          Avbryt
        </Knapp>
      </StyledCommentButtonContainer>
    </StyledNewComment>
  );
};
