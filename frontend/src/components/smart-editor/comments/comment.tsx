import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { DeleteButton } from './delete-button';
import { EditButton, EditComment } from './edit-comment';

interface Props extends ISmartEditorComment {
  isExpanded: boolean;
  isMain: boolean;
}

export const Comment = memo(
  ({ author, created, text, id, isExpanded, isMain }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(actionsRef, () => setShowActions(false));

    const Text = () =>
      isEditing ? (
        <EditComment id={id} authorIdent={author.ident} close={() => setIsEditing(false)} defaultValue={text} />
      ) : (
        <StyledText>{text}</StyledText>
      );

    return (
      <StyledListItem>
        <StyledComment>
          <StyledName>{author.name}</StyledName>

          <StyledDate dateTime={created}>{isoDateTimeToPretty(created)}</StyledDate>

          <Text />

          {isExpanded ? (
            <ActionsContainer ref={actionsRef}>
              <Button
                onClick={() => setShowActions((a) => !a)}
                size="xsmall"
                variant="tertiary-neutral"
                icon={<MenuElipsisVerticalIcon aria-hidden />}
              />
              {showActions ? (
                <StyledButtons>
                  <EditButton
                    id={id}
                    authorIdent={author.ident}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isFocused={isExpanded}
                    close={() => setShowActions(false)}
                  />
                  <DeleteButton
                    id={id}
                    authorIdent={author.ident}
                    isFocused={isExpanded}
                    close={() => setShowActions(false)}
                  >
                    {isMain ? 'Slett tråd' : 'Slett svar'}
                  </DeleteButton>
                </StyledButtons>
              ) : null}
            </ActionsContainer>
          ) : null}
        </StyledComment>
      </StyledListItem>
    );
  },
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id && prevProps.text === nextProps.text && prevProps.isExpanded === nextProps.isExpanded,
);

Comment.displayName = 'Comment';

const ActionsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledButtons = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  box-shadow: var(--a-shadow-medium);
  background-color: white;
  padding: 4px;
  border-radius: var(--a-border-radius-medium);
  white-space: nowrap;
  z-index: 1;
`;

const StyledListItem = styled.li`
  padding-left: 4px;
  border-left: 4px solid lightgrey;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }
`;

const StyledComment = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
`;

const StyledName = styled.div`
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDate = styled.time`
  display: block;
  width: 100%;
  font-size: 14px;
  color: var(--a-gray-700);
`;

const StyledText = styled.p`
  font-size: 16px;
  margin: 0;
  margin-top: 4px;
  white-space: break-spaces;
  overflow-wrap: break-word;
`;
