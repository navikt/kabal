import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorExpandedThreads } from '@app/hooks/settings/use-setting';
import { usePostReplyMutation } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { Chat2Icon } from '@navikt/aksel-icons';
import { BoxNew, Button, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { CommentList } from './comment-list';

interface Props {
  thread: ISmartEditorComment;
  isAbsolute?: boolean;
  isFocused?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onClose?: () => void;
  style?: Pick<React.CSSProperties, 'top' | 'left' | 'bottom' | 'transform'>;
  ref?: React.Ref<HTMLDivElement>;
  zIndex: number;
}

export const THREAD_WIDTH = 350;

const BASE_CLASSES =
  'group/thread will-change-[transform,opacity,box-shadow] transition-[transform,opacity,box-shadow] duration-100 ease-in-out hover:shadow-large hover:z-10000';
const COLLAPSED_CLASSES = `${BASE_CLASSES} cursor-pointer select-none`;
const EXPANDED_CLASSES = `${BASE_CLASSES} cursor-auto select-auto`;

export const Thread = ({ thread, style, onClick, isAbsolute = false, isFocused = false, ref, zIndex }: Props) => {
  const { value: threadsAlwaysExpanded = false } = useSmartEditorExpandedThreads();
  const isExpanded = threadsAlwaysExpanded || isFocused;
  const comments: ISmartEditorComment[] = isExpanded ? [thread, ...thread.comments] : [thread];
  const { editingComment, focusedThreadId } = useContext(SmartEditorContext);

  const isEditing = thread.comments.some((comment) => comment.id === editingComment?.id);

  return (
    <VStack
      asChild
      gap="0"
      width={`${THREAD_WIDTH}px`}
      position={isAbsolute ? 'absolute' : 'static'}
      padding="4"
      ref={ref}
      onClick={onClick}
      style={style}
    >
      <BoxNew
        as="section"
        background="raised"
        borderWidth="1"
        borderColor="neutral"
        borderRadius="medium"
        shadow={isExpanded ? 'dialog' : undefined}
        className={isExpanded ? EXPANDED_CLASSES : COLLAPSED_CLASSES}
        style={{ zIndex: isEditing || focusedThreadId === thread.id ? 999 : zIndex }}
      >
        <CommentList comments={comments} />
        {isExpanded ? null : (
          <div className="text-center text-ax-small text-ax-text-neutral-subtle italic">
            {thread.comments.length} svar
          </div>
        )}
        {isEditing ? null : <AddComment threadId={thread.id} />}
      </BoxNew>
    </VStack>
  );
};

interface AddCommentProps {
  threadId: string;
}

const AddComment = ({ threadId }: AddCommentProps) => {
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { user } = useContext(StaticDataContext);
  const { dokumentId, setEditingComment } = useContext(SmartEditorContext);

  if (oppgaveId === skipToken) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      variant="secondary-neutral"
      className="opacity-0 group-focus-within/thread:opacity-100 group-hover/thread:opacity-100"
      icon={<Chat2Icon aria-hidden />}
      onClick={async () => {
        const comment = await postReply({
          oppgaveId,
          author: { ident: user.navIdent, name: user.navn },
          dokumentId,
          text: '',
          commentId: threadId,
        }).unwrap();

        setEditingComment(comment);
      }}
    >
      Nytt svar
    </Button>
  );
};
