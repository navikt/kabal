import { CopyButton } from '@app/components/copy-button/copy-button';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import type { IPart } from '@app/types/oppgave-common';
import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
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
  const canEdit = useCanEditBehandling();

  const toggleEditing = () => setIsEditing(!isEditing);

  if (part === null) {
    return (
      <BehandlingSection label={label}>
        <HStack align="center" justify="space-between">
          <VStack align="start" justify="start">
            <span>Ikke satt</span>
          </VStack>

          <div>{canEdit ? <EditButton onClick={toggleEditing} isEditing={isEditing} /> : null}</div>
        </HStack>

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
      <HStack align="center" justify="space-between" wrap={false}>
        <VStack align="start" justify="start">
          <HStack align="center" gap="1" wrap>
            {part.name === null ? (
              <span>Navn mangler</span>
            ) : (
              <CopyButton size="small" copyText={part.name} text={part.name} activeText={part.name} />
            )}
            {part.identifikator === null ? null : <CopyIdButton size="small" id={part.identifikator} />}
          </HStack>

          <PartStatusList statusList={part.statusList} size="xsmall" />
        </VStack>

        <HStack align="center" wrap={false}>
          {isDeletable && isEditing ? (
            <DeleteButton
              onDelete={() => {
                onChange(null);
                setIsEditing(false);
              }}
            />
          ) : null}
          {canEdit ? <EditButton onClick={toggleEditing} isEditing={isEditing} /> : null}
        </HStack>
      </HStack>

      {isEditing ? (
        <EditPart
          onChange={(newPart) => {
            onChange(newPart);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
          isLoading={isLoading}
          autoFocus
          allowUnreachable
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
