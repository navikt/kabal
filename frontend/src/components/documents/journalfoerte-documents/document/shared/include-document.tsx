import { Fields, GRID_CLASSES } from '@app/components/documents/new-documents/grid';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCheckDocument } from '@app/hooks/use-check-document';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Journalstatus } from '@app/types/arkiverte-documents';
import { CircleSlashIcon, FolderPlusIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useMemo } from 'react';

interface Props {
  name: string;
  dokumentInfoId: string;
  journalpostId: string;
  journalpoststatus: Journalstatus | null;
  hasAccess: boolean;
  checked: boolean;
}

export const IncludeDocument = memo(
  ({ dokumentInfoId, journalpostId, name, journalpoststatus, hasAccess, checked }: Props): React.JSX.Element | null => {
    const oppgaveId = useOppgaveId();
    const [setDocument, isUpdating] = useCheckDocument(oppgaveId, dokumentInfoId, journalpostId);
    const canEdit = useCanEdit();
    const isFeilregistrert = useIsFeilregistrert();
    const isSaksbehandler = useIsSaksbehandler();
    const isRol = useIsRol();

    const title = `${checked ? 'Ekskluder' : 'Inkluder'} ${name}`;

    const unavailableMessage = useMemo(() => {
      if (!hasAccess) {
        return 'Du har ikke tilgang til dette dokumentet.';
      }

      if (journalpoststatus === Journalstatus.MOTTATT) {
        return 'Dokumentet har status "Mottatt". Fullfør journalføring i Gosys for å inkludere det.';
      }

      return null;
    }, [hasAccess, journalpoststatus]);

    if (oppgaveId === skipToken) {
      return null;
    }

    if (unavailableMessage !== null) {
      return (
        <Tooltip placement="right" content={unavailableMessage} maxChar={Number.POSITIVE_INFINITY}>
          <HStack align="center" justify="center" className="opacity-30">
            <CircleSlashIcon aria-hidden />
          </HStack>
        </Tooltip>
      );
    }

    return (
      <Button
        size="small"
        variant={checked ? 'primary' : 'tertiary'}
        icon={<FolderPlusIcon aria-hidden />}
        title={title}
        onClick={() => setDocument(!checked)}
        data-testid="journalfoert-document-button"
        disabled={!canEdit || !(isSaksbehandler || isRol) || isFeilregistrert}
        loading={isUpdating}
        className={GRID_CLASSES[Fields.Action]}
        data-included={checked}
        aria-pressed={checked}
        tabIndex={-1}
      />
    );
  },
  (prevProps, nextProps) => prevProps.checked === nextProps.checked && prevProps.name === nextProps.name,
);
