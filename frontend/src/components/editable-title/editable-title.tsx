import { CheckmarkIcon, PencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  title: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  label: string;
}

const SIZE = 'small';

export const EditableTitle = ({ title, onChange, label, isLoading }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const onCancel = () => {
    setNewTitle(title);
    setEditMode(false);
  };

  const onSave = () => {
    if (newTitle !== title) {
      onChange(newTitle);
    }
    setEditMode(false);
  };

  return (
    <Container>
      {editMode ? (
        <StyledTextField
          label={label}
          size={SIZE}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          hideLabel
          placeholder='Skriv inn tittel og trykk "Enter"'
          autoFocus
          spellCheck
          onBlur={onSave}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
                onSave();
                break;
              case 'Escape':
                onCancel();
                break;
            }
          }}
        />
      ) : (
        <NoStyleButton onClick={() => setEditMode(true)}>
          <Heading level="1" size={SIZE}>
            {getTitle(title)}
          </Heading>
        </NoStyleButton>
      )}
      <Buttons
        editMode={editMode}
        isLoading={isLoading}
        onCancel={onCancel}
        onEdit={() => setEditMode(true)}
        onSave={onSave}
        size="xsmall"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  grid-area: title;
`;

interface ButtonsProps {
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  editMode: boolean;
  size: 'xsmall' | 'small' | 'medium';
}

const Buttons = ({ editMode, isLoading, onCancel, onSave, onEdit, size }: ButtonsProps) => {
  if (!editMode) {
    return (
      <ButtonsContainer>
        <Button variant="tertiary" size={size} onClick={onEdit} icon={<PencilIcon aria-hidden />} loading={isLoading} />
      </ButtonsContainer>
    );
  }

  return (
    <ButtonsContainer>
      <Button
        variant="tertiary"
        size={size}
        onClick={onSave}
        icon={<CheckmarkIcon aria-hidden />}
        loading={isLoading}
      />
      <Button variant="tertiary" size={size} onClick={onCancel} icon={<XMarkIcon aria-hidden />} loading={isLoading} />
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
`;

const NoStyleButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: text;
`;

export const StyledHeading = styled(Heading)`
  flex-grow: 1;
`;

export const getTitle = (title?: string) => (title === undefined || title.length === 0 ? '<Ingen tittel>' : title);
