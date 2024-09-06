import { FilesIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EditLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/edit';
import { ReadOnlyTag } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/shared/vedlegg-style';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveLogiskVedleggMutation, useUpdateLogiskVedleggMutation } from '@app/redux-api/logiske-vedlegg';
import { LogiskVedlegg } from '@app/types/arkiverte-documents';

interface Props {
  dokumentInfoId: string;
  logiskVedlegg: LogiskVedlegg;
  logiskeVedlegg: LogiskVedlegg[];
  temaId: string | null;
}

export const EditableLogiskVedlegg = ({ dokumentInfoId, logiskVedlegg, logiskeVedlegg, temaId }: Props) => {
  const oppgaveId = useOppgaveId();
  const [update, { isLoading: isUpdating }] = useUpdateLogiskVedleggMutation();
  const [remove, { isLoading: isRemoving }] = useRemoveLogiskVedleggMutation();
  const [isEditing, setIsEditing] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(getIsFocused(editButtonRef) || getIsFocused(removeButtonRef));

  const onUpdate = useCallback(
    (tittel: string) => {
      setIsFocused(false);

      if (oppgaveId !== skipToken) {
        update({ oppgaveId, dokumentInfoId, tittel, logiskVedleggId: logiskVedlegg.logiskVedleggId });
      }
    },
    [oppgaveId, update, dokumentInfoId, logiskVedlegg.logiskVedleggId],
  );

  const onRemove = useCallback(() => {
    setIsFocused(false);

    if (oppgaveId !== skipToken) {
      remove({ oppgaveId, dokumentInfoId, logiskVedleggId: logiskVedlegg.logiskVedleggId });
    }
  }, [oppgaveId, remove, dokumentInfoId, logiskVedlegg.logiskVedleggId]);

  const onEditClick = useCallback(() => {
    setIsEditing((e) => !e);
  }, []);

  const onClose = useCallback(() => setIsEditing(false), [setIsEditing]);

  if (isEditing) {
    return (
      <EditLogiskVedlegg
        initialValue={logiskVedlegg.tittel}
        logiskeVedlegg={logiskeVedlegg}
        onClose={onClose}
        onDone={onUpdate}
        onDelete={onRemove}
        isLoading={isUpdating}
        placeholder="Endre"
        temaId={temaId}
      />
    );
  }

  return (
    <EditableTag size="small" variant="neutral" title={logiskVedlegg.tittel} onMouseLeave={() => setIsFocused(false)}>
      <Title $isFocused={isFocused}>{logiskVedlegg.tittel}</Title>

      <AbsoluteTitle $isFocused={isFocused} aria-hidden role="presentation">
        {logiskVedlegg.tittel}
      </AbsoluteTitle>

      <ButtonContainer $isFocused={isFocused}>
        <Tooltip content="Kopier" placement="top">
          <CopyButton
            size="xsmall"
            variant="neutral"
            copyText={logiskVedlegg.tittel}
            icon={<FilesIcon aria-hidden />}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>

        <Tooltip content="Endre" placement="top">
          <Button
            size="xsmall"
            variant="tertiary-neutral"
            onClick={onEditClick}
            icon={<PencilIcon aria-hidden />}
            loading={isUpdating}
            disabled={isRemoving}
            ref={editButtonRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>

        <Tooltip content="Slett" placement="top">
          <Button
            size="xsmall"
            variant="tertiary-neutral"
            onClick={onRemove}
            icon={<TrashIcon aria-hidden />}
            loading={isRemoving}
            ref={removeButtonRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>
      </ButtonContainer>
    </EditableTag>
  );
};

const getIsFocused = ({ current }: React.RefObject<HTMLElement>) => current?.contains(document.activeElement) ?? false;

interface StyleProps {
  $isFocused: boolean;
}

const Title = styled.span<StyleProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $isFocused }) => ($isFocused ? 0 : 1)};
  cursor: text;
`;

const AbsoluteTitle = styled.span<StyleProps>`
  position: absolute;
  left: var(--a-spacing-2);
  right: var(--a-spacing-20);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0)};
  cursor: text;
`;

const ButtonContainer = styled.div<StyleProps>`
  display: flex;
  flex-direction: row;
  column-gap: 0;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0)};
  position: absolute;
  right: var(--a-spacing-2);
  user-select: none;
`;

const EditableTag = styled(ReadOnlyTag)`
  min-width: 88px;

  &:hover {
    ${Title} {
      opacity: 0;
    }

    ${AbsoluteTitle}, ${ButtonContainer} {
      opacity: 1;
    }
  }
`;
