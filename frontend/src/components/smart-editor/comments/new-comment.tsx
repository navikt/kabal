import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext } from 'react';
import { Range, Transforms } from 'slate';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostCommentMutation } from '../../../redux-api/smart-editor-comments';
import { useUser } from '../../../simple-api-state/use-user';
import { connectCommentThread } from '../../rich-text/rich-text-editor/connect-thread';
import { CommentableVoidElementTypes } from '../../rich-text/types/editor-void-types';
import { SmartEditorContext } from '../context/smart-editor-context';
import { StyledNewComment } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface Props {
  close: () => void;
}

export const NewComment = ({ close }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();
  const [postComment, { isLoading }] = usePostCommentMutation();
  const { documentId, setFocusedThreadId, activeElement, editor, selection } = useContext(SmartEditorContext);
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();

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
          { at: [], match: (n) => n === activeElement }
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

  const onSubmit = async (text: string) => {
    if (documentId === null) {
      return;
    }

    await postComment({
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
        close();
        setTimeout(() => {
          setFocusedThreadId(id);
        }, 1000);
      });
  };

  return (
    <StyledNewComment>
      <WriteComment
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Ny kommentar"
        close={close}
        primaryButtonLabel="Legg til"
      />
    </StyledNewComment>
  );
};
