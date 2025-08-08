import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { EditPart } from '@app/components/part/edit-part';
import { WithoutId } from '@app/components/part/fullmektig/without-id';
import { TRYGDERETTEN_ORGNR } from '@app/constants';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import type { IFullmektig } from '@app/types/oppgave-common';
import { ArrowUndoIcon, PencilIcon, TrashFillIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Tag, ToggleGroup, Tooltip, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

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
  const canEdit = useCanEditBehandling();
  const [updateFullmektig, { isLoading }] = useUpdateFullmektigMutation({ fixedCacheKey: part?.id });
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return null;
  }

  const onClose = () => setIsEditing(false);

  const name = part?.name;
  const id = part?.identifikator;
  const hasName = typeof name === 'string' && name.length > 0;
  const hasId = typeof id === 'string' && id.length > 0;

  return (
    <BehandlingSection label="Fullmektig">
      <VStack gap="1">
        <HStack gap="1" align="start" justify="space-between" wrap={false}>
          {hasName ? (
            <Tag
              size="small"
              variant="neutral-moderate"
              className="mr-auto justify-start hyphens-auto break-words py-[7px]"
            >
              {name}
            </Tag>
          ) : (
            'Ikke satt'
          )}

          {hasName ? (
            <Tooltip content="Kopier navn">
              <CopyButton size="small" copyText={name} />
            </Tooltip>
          ) : null}

          {canEdit ? (
            <HStack gap="1" wrap={false} align="center">
              {isEditing && part !== null ? <Delete onClose={onClose} id={part.id} /> : null}

              <EditButton onClick={() => setIsEditing(!isEditing)} isEditing={isEditing} />
            </HStack>
          ) : null}
        </HStack>

        {hasId ? <CopyIdButton size="small" id={id} className="self-start" /> : null}
      </VStack>

      {isEditing ? (
        <VStack gap="4" marginBlock="4 0">
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
                await updateFullmektig({ oppgaveId, fullmektig }).unwrap();

                onClose();
              }}
              id={part?.id}
              isLoading={isLoading}
              autoFocus
              invalidReceivers={[
                {
                  id: TRYGDERETTEN_ORGNR,
                  message: 'Trygderetten kan ikke settes som fullmektig.',
                },
              ]}
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
        <Tooltip content="Fjern fullmektig">
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
        </Tooltip>
      ) : null}

      <Tooltip content={showConfirm ? 'Avbryt' : 'Fjern fullmektig'}>
        <Button
          icon={showConfirm ? <ArrowUndoIcon aria-hidden /> : <TrashFillIcon aria-hidden />}
          variant={showConfirm ? 'tertiary' : 'danger'}
          size="small"
          onClick={() => setShowConfirm(!showConfirm)}
        />
      </Tooltip>
    </>
  );
};

interface EditButtonProps {
  onClick: () => void;
  isEditing: boolean;
}

const EditButton = ({ onClick, isEditing }: EditButtonProps) => {
  const Icon = isEditing ? XMarkIcon : PencilIcon;

  return (
    <Tooltip content="Endre eller fjern fullmektig">
      <Button variant="tertiary-neutral" icon={<Icon aria-hidden />} onClick={onClick} size="small" />
    </Tooltip>
  );
};
