import { ViewMergedDuaButton } from '@app/components/documents/new-documents/new-document/view-merged-dua-button';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  document: IMainDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  className?: string;
}

export const TitleAction = ({ setEditMode, editMode, className, document }: Props) => {
  const canEdit = useCanEditDocument(document);
  const canRename = canEdit && document.type !== DocumentTypeEnum.JOURNALFOERT;
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return null;
  }

  const { tittel } = document;

  if (!canRename) {
    return <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" className={className} />;
  }

  const Icon = editMode ? CheckmarkIcon : PencilIcon;

  return (
    <HStack align="center" className={className}>
      <Button
        onClick={() => setEditMode(!editMode)}
        data-testid="document-title-edit-save-button"
        size="xsmall"
        icon={<Icon aria-hidden />}
        variant="tertiary"
        title="Endre dokumentnavn"
      />
      {editMode ? null : <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />}
      {editMode ? null : <ViewMergedDuaButton document={document} oppgaveId={oppgaveId} />}
    </HStack>
  );
};
