import { StaticDataContext } from '@app/components/app/static-data-context';
import { SavedStatus } from '@app/components/saved-status/saved-status';
import { DeleteButton } from '@app/components/smart-editor/comments/delete-button';
import { WriteComment } from '@app/components/smart-editor/comments/write-comment/write-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUpdateCommentOrReplyMutation } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { BodyLong, BoxNew, HStack, VStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { EditButton } from './edit-comment';

interface Props {
  isExpanded: boolean;
  isMain?: boolean;
  comment: ISmartEditorComment;
}

export const Comment = ({ isExpanded, isMain, comment }: Props) => {
  const { author, modified, text, id } = comment;
  const { user } = useContext(StaticDataContext);
  const { editingComment, setEditingComment } = useContext(SmartEditorContext);
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const [, status] = useUpdateCommentOrReplyMutation({ fixedCacheKey: comment.id });

  const isAuthor = author.ident === user.navIdent;
  const isEditing = editingComment?.id === id;
  const canEditComment = isAuthor && isExpanded;
  const canDeleteComment = (isAuthor || isSaksbehandler) && isExpanded;

  return (
    <BoxNew
      as="li"
      paddingInline="2 0"
      borderWidth="0 0 0 4"
      borderColor="neutral-subtle"
      className="first:border-l-0 first:pl-0"
    >
      <VStack as="article" position="relative">
        <HStack gap="2" align="center" justify="space-between" wrap={false}>
          <div className="w-full grow truncate text-ax-medium">{author.name}</div>
          {canDeleteComment ? <DeleteButton id={id} title={isMain ? 'Slett tråd' : 'Slett svar'} /> : null}
        </HStack>

        <SavedStatus
          {...status}
          modified={modified}
          fallback={
            <HStack className="text-ax-small text-ax-text-neutral-subtle" gap="1" align="center">
              Sist lagret: <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>
            </HStack>
          }
        />

        {isEditing ? (
          <WriteComment comment={editingComment} label="Rediger kommentar" />
        ) : (
          <HStack gap="2" justify="space-between" align="start" wrap={false}>
            <BodyLong size="small" className="wrap-break-word overflow-hidden whitespace-break-spaces">
              {text}
            </BodyLong>

            {canEditComment ? (
              <EditButton isEditing={isEditing} setIsEditing={() => setEditingComment(comment)} />
            ) : null}
          </HStack>
        )}
      </VStack>
    </BoxNew>
  );
};
