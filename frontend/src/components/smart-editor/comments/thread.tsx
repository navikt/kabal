import { StaticDataContext } from '@app/components/app/static-data-context';
import { CommentList } from '@app/components/smart-editor/comments/comment-list';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { usePostReplyMutation } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { Box, Button, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

interface Props {
  thread: ISmartEditorComment;
  isAbsolute?: boolean;
  isExpanded?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onClose?: () => void;
  style?: Pick<React.CSSProperties, 'top' | 'left' | 'bottom' | 'transform'>;
  ref?: React.Ref<HTMLDivElement>;
}

export const THREAD_WIDTH = 350;

const BASE_CLASSES =
  'will-change-[transform,opacity,box-shadow] transition-[transform,opacity,box-shadow] duration-100 ease-in-out hover:z-2 hover:shadow-large';
const COLLAPSED_CLASSES = `${BASE_CLASSES} cursor-pointer select-none z-1`;
const EXPANDED_CLASSES = `${BASE_CLASSES} cursor-auto select-auto z-3`;

export const Thread = ({ thread, style, onClick, isAbsolute = false, isExpanded = false, ref }: Props) => {
  const comments: ISmartEditorComment[] = isExpanded ? [thread, ...thread.comments] : [thread];

  return (
    <VStack
      asChild
      gap="4"
      width={`${THREAD_WIDTH}px`}
      position={isAbsolute ? 'absolute' : 'static'}
      padding="4"
      ref={ref}
      onClick={onClick}
      style={style}
    >
      <Box
        as="section"
        background="surface-default"
        borderWidth="1"
        borderColor="border-divider"
        borderRadius="medium"
        shadow={isExpanded ? 'medium' : undefined}
        className={isExpanded ? EXPANDED_CLASSES : COLLAPSED_CLASSES}
      >
        <CommentList comments={comments} isExpanded={isExpanded} />
        {isExpanded ? null : (
          <div className="text-right text-base text-gray-700 italic">{comments.length - 1} svar</div>
        )}
        <AddComment threadId={thread.id} />
      </Box>
    </VStack>
  );
};

const AddComment = ({ threadId }: { threadId: string }) => {
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { user } = useContext(StaticDataContext);
  const { dokumentId, editCommentId, setEditCommentId } = useContext(SmartEditorContext);

  if (oppgaveId === skipToken || editCommentId !== null) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      onClick={async () => {
        const { id } = await postReply({
          oppgaveId,
          author: { ident: user.navIdent, name: user.navn },
          dokumentId,
          text: '',
          commentId: threadId,
        }).unwrap();

        setEditCommentId(id);
      }}
    >
      Svar
    </Button>
  );
};
