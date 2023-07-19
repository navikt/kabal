import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { IPart } from '@app/types/oppgave-common';
import { BehandlingSection } from '../behandling/behandlingsdetaljer/behandling-section';
import { DeleteButton } from './delete-button';

interface DeletableProps {
  isDeletable: true;
  label: string;
  part: IPart | null;
  onChange: (part: IPart | null) => void;
  isLoading: boolean;
}

interface NonDeletableProps {
  isDeletable: false;
  label: string;
  part: IPart;
  onChange: (part: IPart) => void;
  isLoading: boolean;
}

export const Part = ({ part, isDeletable, label, onChange, isLoading }: DeletableProps | NonDeletableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = useCanEdit();

  const toggleEditing = () => setIsEditing(!isEditing);

  if (part === null) {
    return (
      <BehandlingSection label={label}>
        <StyledPart>
          <StyledName>
            <span>Ikke satt</span>
          </StyledName>

          <div>{canEdit ? <EditButton onClick={toggleEditing} isEditing={isEditing} /> : null}</div>
        </StyledPart>

        {isEditing ? (
          <EditPart
            onChange={(newPart) => {
              onChange(newPart);
              setIsEditing(false);
            }}
            isLoading={isLoading}
            autoFocus
          />
        ) : null}
      </BehandlingSection>
    );
  }

  return (
    <BehandlingSection label={label}>
      <StyledPart>
        <StyledName>
          <span>{part.name}</span>
          <PartStatusList statusList={part.statusList} size="xsmall" />
        </StyledName>

        <div>
          {isDeletable && isEditing ? (
            <DeleteButton
              onDelete={() => {
                onChange(null);
                setIsEditing(false);
              }}
            />
          ) : null}
          {canEdit ? <EditButton onClick={toggleEditing} isEditing={isEditing} /> : null}
        </div>
      </StyledPart>

      {isEditing ? (
        <EditPart
          onChange={(newPart) => {
            onChange(newPart);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
          isLoading={isLoading}
          autoFocus
        />
      ) : null}
    </BehandlingSection>
  );
};

interface EditButtonProps {
  onClick: () => void;
  isEditing: boolean;
}

const EditButton = ({ onClick, isEditing }: EditButtonProps) => {
  const Icon = isEditing ? XMarkIcon : PencilIcon;

  return <Button variant="tertiary" icon={<Icon aria-hidden />} onClick={onClick} size="small" />;
};

const StyledPart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  row-gap: 0;
`;
