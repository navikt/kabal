import { getMergedDuaDocumentTabId, getMergedDuaDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { ViewDocumentMode, useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useHandleTab } from '@app/hooks/use-handle-tab';
import { MouseButtons } from '@app/keys';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { BookIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';

interface Props {
  document: IMainDocument;
  disabled?: boolean;
  oppgaveId: string;
}

export const ViewCombinedDuaButton = ({ document, oppgaveId, disabled = false }: Props) => {
  const { setValue } = useDocumentsPdfViewed();

  const tabId = getMergedDuaDocumentTabId(document.id);
  const url = getMergedDuaDocumentTabUrl(oppgaveId, document.id);

  const handleTab = useHandleTab(url, tabId);

  if (document.type === DocumentTypeEnum.JOURNALFOERT) {
    return null;
  }

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
      setValue([{ type: document.type, documentId: document.id }], ViewDocumentMode.MERGED);

      return;
    }

    handleTab();
  };

  return (
    <Link as="a" variant="neutral" href={url} target={tabId} onClick={onClick} onAuxClick={onClick}>
      <BookIcon aria-hidden />
    </Link>
  );
};
