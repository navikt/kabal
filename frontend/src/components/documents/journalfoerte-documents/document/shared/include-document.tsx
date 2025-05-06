import {
  useHasTilknyttetVedlegg,
  useIsTilknyttetDokument,
} from '@app/components/documents/journalfoerte-documents/use-tilknyttede-dokumenter';
import { Fields } from '@app/components/documents/new-documents/grid';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCheckDocument } from '@app/hooks/use-check-document';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Journalstatus } from '@app/types/arkiverte-documents';
import { CircleSlashIcon, FolderPlusIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, HStack, Tooltip } from '@navikt/ds-react';
import { memo, useMemo } from 'react';

interface Props {
  dokumentInfoId: string;
  journalpostId: string;
  journalpoststatus: Journalstatus | null;
  hasAccess: boolean;
}

export const IncludeDocument = memo(
  ({ journalpoststatus, hasAccess, ...rest }: Props) => {
    const unavailableMessage = useMemo(() => {
      if (!hasAccess) {
        return 'Du har ikke tilgang til dette dokumentet.';
      }

      if (journalpoststatus === Journalstatus.MOTTATT) {
        return 'Dokumentet har status mottatt. Fullfør journalføring i Gosys for å inkludere det.';
      }

      return null;
    }, [hasAccess, journalpoststatus]);

    return unavailableMessage === null ? <Enabled {...rest} /> : <Disabled unavailableMessage={unavailableMessage} />;
  },
  (prevProps, nextProps) =>
    prevProps.journalpostId === nextProps.journalpostId &&
    prevProps.dokumentInfoId === nextProps.dokumentInfoId &&
    prevProps.hasAccess === nextProps.hasAccess &&
    prevProps.journalpoststatus === nextProps.journalpoststatus,
);

interface DisabledProps {
  unavailableMessage: string;
}

const Disabled = ({ unavailableMessage }: DisabledProps) => (
  <Tooltip placement="right" content={unavailableMessage} maxChar={Number.POSITIVE_INFINITY}>
    <HStack align="center" justify="center" className="opacity-30" style={{ gridArea: Fields.Action }}>
      <CircleSlashIcon aria-hidden />
    </HStack>
  </Tooltip>
);

interface EnabledProps {
  dokumentInfoId: string;
  journalpostId: string;
}

const Enabled = ({ dokumentInfoId, journalpostId }: EnabledProps) => {
  const oppgaveId = useOppgaveId();
  const [setDocument, isUpdating] = useCheckDocument(oppgaveId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit();
  const isFeilregistrert = useIsFeilregistrert();
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const checked = useIsTilknyttetDokument(journalpostId, dokumentInfoId);
  const indeterminate = useHasTilknyttetVedlegg(journalpostId, dokumentInfoId);

  const { variant, title } = useMemo<{ variant: ButtonProps['variant']; title: string }>(() => {
    if (checked) {
      return { variant: 'primary', title: 'Ekskluder fra saken' };
    }

    if (indeterminate) {
      return { variant: 'secondary', title: 'Inkluder i saken.\nEtt eller flere vedlegg er inkludert.' };
    }

    return { variant: 'tertiary', title: 'Inkluder i saken' };
  }, [indeterminate, checked]);

  return (
    <Tooltip placement="right" content={title} keys={['M']} className="whitespace-pre" describesChild>
      <Button
        size="small"
        variant={variant}
        icon={<FolderPlusIcon aria-hidden />}
        onClick={(e) => {
          e.stopPropagation();
          setDocument(!checked);
        }}
        data-testid="journalfoert-document-button"
        disabled={!canEdit || !(isSaksbehandler || isRol) || isFeilregistrert}
        loading={isUpdating}
        style={{ gridArea: Fields.Action }}
        data-included={checked}
        aria-pressed={checked}
        tabIndex={-1}
      />
    </Tooltip>
  );
};
