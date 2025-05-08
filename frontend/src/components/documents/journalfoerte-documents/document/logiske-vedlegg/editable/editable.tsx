import { EditLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/edit';
import { EditableTag } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/editable-tag';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveLogiskVedleggMutation, useUpdateLogiskVedleggMutation } from '@app/redux-api/logiske-vedlegg';
import type { LogiskVedlegg } from '@app/types/arkiverte-documents';
import { FilesIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useRef, useState } from 'react';

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

  const onClose = useCallback(() => setIsEditing(false), []);

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

  const showOnFocusClasses = isFocused ? 'opacity-100' : 'opacity-0';
  const hideOnFocusClasses = isFocused ? 'opacity-0' : 'opacity-100';

  return (
    <EditableTag
      size="small"
      variant="neutral"
      title={logiskVedlegg.tittel}
      onMouseLeave={() => setIsFocused(false)}
      className="group min-w-[88px]"
    >
      <span className={`${TITLE_CLASSES} group-hover:opacity-0 ${hideOnFocusClasses}`}>{logiskVedlegg.tittel}</span>

      <span
        className={`absolute right-20 left-2 group-hover:opacity-100 ${TITLE_CLASSES} ${showOnFocusClasses}`}
        aria-hidden
        role="presentation"
      >
        {logiskVedlegg.tittel}
      </span>

      <HStack position="absolute" right="2" className={`select-none group-hover:opacity-100 ${showOnFocusClasses}`}>
        <Tooltip content="Kopier" placement="top">
          <CopyButton
            size="xsmall"
            variant="neutral"
            copyText={logiskVedlegg.tittel}
            icon={<FilesIcon aria-hidden />}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={-1}
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
            tabIndex={-1}
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
            tabIndex={-1}
          />
        </Tooltip>
      </HStack>
    </EditableTag>
  );
};

const TITLE_CLASSES = 'overflow-hidden text-ellipsis whitespace-nowrap cursor-text';

const getIsFocused = ({ current }: React.RefObject<HTMLElement | null>) =>
  current?.contains(document.activeElement) ?? false;
