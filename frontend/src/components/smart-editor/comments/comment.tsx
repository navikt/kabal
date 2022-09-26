import React, { useState } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '../../../domain/date';
import { ISmartEditorComment } from '../../../types/smart-editor/comments';
import { DeleteButton } from './delete-button';
import { EditButton, EditComment } from './edit-comment';

interface Props extends ISmartEditorComment {
  isFocused: boolean;
}

export const Comment = React.memo(
  ({ author, created, text, id, isFocused }: Props) => {
    const [isEditing, setIsEditing] = useState(false);

    const Text = () =>
      isEditing ? (
        <EditComment id={id} authorIdent={author.ident} close={() => setIsEditing(false)} defaultValue={text} />
      ) : (
        <StyledText>{text}</StyledText>
      );

    return (
      <StyledListItem>
        <StyledComment>
          <StyledTopRow>
            <StyledName>{author.name}</StyledName>
            <StyledButtons>
              <EditButton
                id={id}
                authorIdent={author.ident}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isFocused={isFocused}
              />
              <DeleteButton id={id} authorIdent={author.ident} isFocused={isFocused} />
            </StyledButtons>
          </StyledTopRow>

          <StyledDate dateTime={created}>{isoDateTimeToPretty(created)}</StyledDate>
          <Text />
        </StyledComment>
      </StyledListItem>
    );
  },
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id && prevProps.text === nextProps.text && prevProps.isFocused === nextProps.isFocused
);

Comment.displayName = 'Comment';

const StyledButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const StyledTopRow = styled.div`
  display: flex;
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
  gap: 4px;
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
  color: #828282;
`;

const StyledText = styled.p`
  font-size: 16px;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
`;
