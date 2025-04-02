import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { getMergedDuaDocumentTabId, getMergedDuaDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { MouseButtons } from '@app/keys';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Link } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

interface Props {
  document: IMainDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  className?: string;
}

export const TitleAction = ({ setEditMode, editMode, className, document }: Props) => {
  const canEdit = useCanEditDocument(document);
  const canRename = canEdit && document.type !== DocumentTypeEnum.JOURNALFOERT;

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
      {editMode ? null : <CombinedDocument document={document} />}
    </HStack>
  );
};

interface Propss {
  document: IMainDocument;
  disabled?: boolean;
}

const CombinedDocument = ({ document, disabled = false }: Propss) => {
  const oppgaveId = useOppgaveId();
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value, setValue } = useDocumentsPdfViewed();

  const tabId = getMergedDuaDocumentTabId(document.id);

  const isTabOpen = useIsTabOpen(tabId);

  if (oppgaveId === skipToken || document.type === DocumentTypeEnum.JOURNALFOERT) {
    return null;
  }

  const url = getMergedDuaDocumentTabUrl(oppgaveId, document.id);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled || e.button === MouseButtons.RIGHT) {
      return;
    }

    e.preventDefault();

    if (disabled) {
      return;
    }

    const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === MouseButtons.MIDDLE;

    // Open in PDF-viewer panel.
    if (!shouldOpenInNewTab) {
      setValue([{ type: document.type, documentId: document.id }]);

      return;
    }

    const tabRef = getTabRef(tabId);

    // There is a reference to the tab and it is open.
    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    if (isTabOpen) {
      toast.warning('Dokumentet er allerede åpent i en annen fane');

      return;
    }

    // There is no reference to the tab or it is closed.
    const newTabRef = window.open(url, tabId);

    if (newTabRef === null) {
      toast.error('Kunne ikke åpne dokument i ny fane');

      return;
    }

    setTabRef(tabId, newTabRef);
  };

  return (
    <Link as="a" href={url} target={tabId} onClick={onClick} onAuxClick={onClick}>
      <PencilIcon aria-hidden />
    </Link>
  );
};
