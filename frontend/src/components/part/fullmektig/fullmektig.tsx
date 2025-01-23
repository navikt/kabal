import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { EditPart } from '@app/components/part/edit-part';
import { NO_FULLMEKTIG_ID } from '@app/components/part/fullmektig/types';
import { WithoutId } from '@app/components/part/fullmektig/without-id';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import type { IFullmektig } from '@app/types/oppgave-common';
import { ArrowUndoIcon, PencilIcon, TrashFillIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { styled } from 'styled-components';

enum Option {
  ID = 'id',
  ADDRESS = 'address',
}

const OPTIONS = Object.values(Option);
const isOption = (value: string): value is Option => OPTIONS.some((option) => option === value);

const getInitialValue = (part: IFullmektig | null): Option => {
  if (part === null) {
    return Option.ID;
  }

  return part.identifikator === null ? Option.ADDRESS : Option.ID;
};

interface Props {
  part: IFullmektig | null;
}

export const Fullmektig = ({ part }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(getInitialValue(part));
  const [updateFullmektig, { isLoading }] = useUpdateFullmektigMutation({
    fixedCacheKey: part?.id ?? NO_FULLMEKTIG_ID,
  });
  const oppgaveId = useOppgaveId();

  const onClose = () => setIsEditing(false);

  return (
    <BehandlingSection label="Fullmektig">
      <HStack justify="space-between" wrap={false}>
        <Name>
          {typeof part?.name === 'string' ? (
            <CopyButton size="small" copyText={part.name} text={part.name} activeText={part.name} />
          ) : (
            'Ikke satt'
          )}
          {typeof part?.identifikator === 'string' ? <CopyIdButton size="small" id={part.identifikator} /> : null}
        </Name>

        <HStack wrap={false} align="start">
          {isEditing && part !== null ? <Delete onClose={onClose} id={part.id} /> : null}
          <EditButton onClick={() => setIsEditing(!isEditing)} isEditing={isEditing} />
        </HStack>
      </HStack>
      {isEditing ? (
        <VStack gap="4" style={{ marginTop: 'var(--a-spacing-4)' }}>
          <ToggleGroup
            size="small"
            onChange={(v) => {
              if (isOption(v)) {
                setValue(v);
              }
            }}
            value={value}
          >
            <ToggleGroup.Item value={Option.ID}>ID-nummer</ToggleGroup.Item>
            <ToggleGroup.Item value={Option.ADDRESS}>Navn og adresse</ToggleGroup.Item>
          </ToggleGroup>

          {value === Option.ID ? (
            <EditPart
              onChange={async (fullmektig) => {
                if (oppgaveId === skipToken) {
                  return;
                }

                await updateFullmektig({ oppgaveId, fullmektig }).unwrap();

                onClose();
              }}
              id={part?.id}
              isLoading={isLoading}
              autoFocus
            />
          ) : null}
          {value === Option.ADDRESS ? <WithoutId part={part} onClose={onClose} /> : null}
        </VStack>
      ) : null}
    </BehandlingSection>
  );
};

const Delete = ({ onClose, id }: { onClose: () => void; id: string }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateFullmektig, { isLoading }] = useUpdateFullmektigMutation({ fixedCacheKey: id });
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (
    <>
      {showConfirm ? (
        <Button
          icon={<TrashFillIcon />}
          variant="danger"
          size="small"
          loading={isLoading}
          onClick={async () => {
            await updateFullmektig({ oppgaveId, fullmektig: null }).unwrap();
            onClose();
          }}
        />
      ) : null}
      <Button
        icon={showConfirm ? <ArrowUndoIcon aria-hidden /> : <TrashFillIcon aria-hidden />}
        variant={showConfirm ? 'tertiary' : 'danger'}
        size="small"
        onClick={() => setShowConfirm(!showConfirm)}
      />
    </>
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

const Name = styled.div`
  display: flex;
  gap: var(--a-spacing-1);
  flex-wrap: wrap;
  align-items: center;
`;
