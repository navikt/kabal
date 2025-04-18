import { Fields, GRID_CLASSES } from '@app/components/documents/new-documents/grid';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCheckDocument } from '@app/hooks/use-check-document';
import { FolderPlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo } from 'react';

interface Props {
  name: string;
  dokumentInfoId: string;
  journalpostId: string;
  disabled: boolean;
  checked: boolean;
  className?: string;
}

export const IncludeDocument = memo(
  ({ dokumentInfoId, journalpostId, name, disabled, checked, className }: Props): React.JSX.Element | null => {
    const oppgaveId = useOppgaveId();
    const [setDocument, isUpdating] = useCheckDocument(oppgaveId, dokumentInfoId, journalpostId);
    const canEdit = useCanEdit();

    const disableButton = !canEdit || disabled || isUpdating || oppgaveId === skipToken;

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
        className={`${GRID_CLASSES[Fields.Action]} self-center ${className}`}
        data-included={checked}
        aria-pressed={checked}
      />
    );
  },
  (prevProps, nextProps) => prevProps.checked === nextProps.checked && prevProps.name === nextProps.name,
);
