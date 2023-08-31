import { FolderPlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCheckDocument } from '@app/hooks/use-check-document';

interface Props {
  oppgavebehandlingId: string | typeof skipToken;
  name: string;
  dokumentInfoId: string;
  journalpostId: string;
  disabled: boolean;
  checked: boolean;
  className?: string;
}

const InternalIncludeDocument = memo(
  ({
    oppgavebehandlingId,
    dokumentInfoId,
    journalpostId,
    name,
    disabled,
    checked,
    className,
  }: Props): JSX.Element | null => {
    const [setDocument, isUpdating] = useCheckDocument(oppgavebehandlingId, dokumentInfoId, journalpostId);
    const canEdit = useCanEdit();

    const disableButton = !canEdit || disabled || isUpdating || oppgavebehandlingId === skipToken;

    const title = `${checked ? 'Ekskluder' : 'Inkluder'} ${name}`;

    return (
      <Button
        size="xsmall"
        variant={checked ? 'primary' : 'tertiary'}
        icon={<FolderPlusIcon aria-hidden />}
        title={title}
        disabled={disableButton}
        onClick={() => setDocument(!checked)}
        data-testid="journalfoert-document-button"
        loading={isUpdating}
        className={className}
        data-included={checked}
        aria-pressed={checked}
      />
    );
  },
  (prevProps, nextProps) => prevProps.checked === nextProps.checked && prevProps.name === nextProps.name,
);

export const IncludeDocument = styled(InternalIncludeDocument)`
  grid-area: ${Fields.Action};
  justify-self: center;
`;

InternalIncludeDocument.displayName = 'IncludeDocument';
