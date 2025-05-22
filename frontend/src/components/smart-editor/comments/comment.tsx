import { StaticDataContext } from '@app/components/app/static-data-context';
import { WriteComment } from '@app/components/smart-editor/comments/write-comment/write-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Box, Button, VStack } from '@navikt/ds-react';
import { useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { DeleteButton } from './delete-button';
import { EditButton } from './edit-comment';

interface Props extends ISmartEditorComment {
  isExpanded: boolean;
  isMain?: boolean;
  id: string;
}

export const Comment = ({ author, created, text, id, isExpanded, isMain = false }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionsRef, () => setShowActions(false));
  const { user } = useContext(StaticDataContext);
  const { editCommentId, setEditCommentId } = useContext(SmartEditorContext);
  const isSaksbehandler = useIsSaksbehandler();

  const isAuthor = author.ident === user.navIdent;
  const canEdit = isSaksbehandler || isAuthor;

  const isEditing = editCommentId === id;

  return (
    <StyledListItem>
      <VStack as="article" position="relative">
        <StyledName>{author.name}</StyledName>

        <StyledDate dateTime={created}>{isoDateTimeToPretty(created)}</StyledDate>

        {isEditing ? (
          <WriteComment commentId={id} text={text} label="Rediger kommentar" />
        ) : (
          <StyledText>{text}</StyledText>
        )}

        {canEdit && isExpanded ? (
          <ActionsContainer ref={actionsRef}>
            <Button
              onClick={() => setShowActions((a) => !a)}
              size="xsmall"
              variant="tertiary-neutral"
              icon={<MenuElipsisVerticalIcon aria-hidden />}
            />
            {showActions ? (
              <VStack asChild gap="1 0" right="0" className="top-full z-1 whitespace-nowrap">
                <Box shadow="medium" background="bg-default" borderRadius="medium" padding="1" position="absolute">
                  <EditButton
                    authorIdent={author.ident}
                    isEditing={isEditing}
                    setIsEditing={() => {
                      setEditCommentId(id);
                      setShowActions(false);
                    }}
                    isFocused={isExpanded}
                  />
                  <DeleteButton
                    id={id}
                    authorIdent={author.ident}
                    isFocused={isExpanded}
                    close={() => setShowActions(false)}
                  >
                    {isMain ? 'Slett tråd' : 'Slett svar'}
                  </DeleteButton>
                </Box>
              </VStack>
            ) : null}
          </ActionsContainer>
        ) : null}
      </VStack>
    </StyledListItem>
  );
};

Comment.displayName = 'Comment';

const ActionsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

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

const StyledDate = styled.time`
  display: block;
  width: 100%;
  font-size: var(--a-font-size-small);
  color: var(--a-gray-700);
`;

const StyledText = styled.p`
  font-size: var(--a-spacing-4);
  margin: 0;
  margin-top: var(--a-spacing-1);
  white-space: break-spaces;
  overflow-wrap: break-word;
`;
