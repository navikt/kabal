import { StaticDataContext } from '@app/components/app/static-data-context';
import { connectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { getRangePosition } from '@app/plate/functions/get-range-position';
import { useMyPlateEditorState } from '@app/plate/types';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostCommentMutation } from '@app/redux-api/smart-editor-comments';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { RangeApi } from '@udecode/plate';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { StyledNewThread } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface Props {
  container: HTMLDivElement | null;
}

export const NewComment = ({ container }: Props) => {
  const oppgaveId = useOppgaveId();
  const editor = useMyPlateEditorState();
  const { user } = useContext(StaticDataContext);
  const [postComment, { isLoading }] = usePostCommentMutation();
  const { dokumentId, setFocusedThreadId, newCommentSelection, setNewCommentSelection } =
    useContext(SmartEditorContext);
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const position = getRangePosition(editor, newCommentSelection, container);
  const ref = useRef<HTMLTextAreaElement>(null);

  const onNewThread = useCallback(
    (threadId: string) => {
      if (editor === null || newCommentSelection === null || RangeApi.isCollapsed(newCommentSelection)) {
        return;
      }

      connectCommentThread(editor, newCommentSelection, threadId);
    },
    [editor, newCommentSelection],
  );

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.focus();
      ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length, 'forward');
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  if (container === null || newCommentSelection === null || position === null) {
    return null;
  }

  if (signatureIsLoading || typeof signature === 'undefined' || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
  }

  const onSubmit = async (text: string) => {
    await postComment({
      author: {
        ident: user.navIdent,
        name: signature.customLongName ?? signature.longName,
      },
      dokumentId,
      text,
      oppgaveId,
    })
      .unwrap()
      .then(({ id }) => {
        onNewThread(id);
        setNewCommentSelection(null);
        setTimeout(() => {
          setFocusedThreadId(id);
          editor.tf.focus();
        }, 0);
      });
  };

  const close = () => {
    setNewCommentSelection(null);
    editor.tf.focus();
  };

  return (
    <StyledNewThread
      style={{ top: `${position.top}em` }}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          close();
        }
      }}
    >
      <WriteComment
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Ny kommentar"
        close={close}
        primaryButtonLabel="Legg til"
        autoFocus
        ref={ref}
      />
    </StyledNewThread>
  );
};
