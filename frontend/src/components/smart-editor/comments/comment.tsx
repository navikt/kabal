import { StaticDataContext } from '@app/components/app/static-data-context';
import { SavedStatus } from '@app/components/saved-status/saved-status';
import { DeleteButton } from '@app/components/smart-editor/comments/delete-button';
import { WriteComment } from '@app/components/smart-editor/comments/write-comment/write-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUpdateCommentOrReplyMutation } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { BodyLong, HStack, VStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
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
    <StyledListItem>
      <VStack as="article" position="relative">
        <HStack gap="2" align="center" justify="space-between" wrap={false}>
          <StyledName>{author.name}</StyledName>
          {canDeleteComment ? <DeleteButton id={id} title={isMain ? 'Slett tråd' : 'Slett svar'} /> : null}
        </HStack>

        <SavedStatus
          {...status}
          modified={modified}
          fallback={
            <HStack className="text-small text-text-subtle" gap="1" align="center">
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
    </StyledListItem>
  );
};

const StyledListItem = styled.li`
  padding-left: var(--a-spacing-1);
  border-left: var(--a-spacing-1) solid lightgrey;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }
`;

const StyledName = styled.div`
  display: block;
  width: 100%;
  font-size: var(--a-spacing-4);
  font-weight: bold;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;
