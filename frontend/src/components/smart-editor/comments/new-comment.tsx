import { Close, Send } from '@navikt/ds-icons';
import { Button, Loader, Textarea } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useState } from 'react';
import { Range, Transforms } from 'slate';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostCommentMutation } from '../../../redux-api/smart-editor-comments';
import { useUser } from '../../../simple-api-state/use-user';
import { connectCommentThread } from '../../rich-text/rich-text-editor/connect-thread';
import { CommentableVoidElementTypes } from '../../rich-text/types/editor-void-types';
import { SmartEditorContext } from '../context/smart-editor-context';
import { StyledCommentButtonContainer, StyledNewComment } from './styled-components';

interface Props {
  close: () => void;
}

export const NewComment = ({ close }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();
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

  if (
    signatureIsLoading ||
    brukerIsLoading ||
    typeof bruker === 'undefined' ||
    typeof signature === 'undefined' ||
    oppgaveId === skipToken
  ) {
    return <Loader size="xlarge" />;
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
        size="small"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Skriv inn en kommentar"
        label="Ny kommentar"
        hideLabel
        minRows={3}
        maxLength={0}
        disabled={isLoading}
        autoFocus
      />
      <StyledCommentButtonContainer>
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={onSubmit}
          disabled={text.length <= 0}
          loading={isLoading}
          title="Ctrl/⌘ + Enter"
          icon={<Send aria-hidden />}
        >
          Legg til
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={close}
          disabled={isLoading}
          title="Escape"
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledCommentButtonContainer>
    </StyledNewComment>
  );
};
