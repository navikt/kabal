import { canOpenInKabal } from '@app/components/documents/filetype';
import { downloadDocuments } from '@app/components/documents/journalfoerte-documents/download';
import { StyledDocumentTitle } from '@app/components/documents/new-documents/new-document/title-style';
import { DocumentLink } from '@app/components/documents/styled-components/document-link';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import {
  getAttachmentsOverviewTabId,
  getJournalfoertDocumentTabId,
  getNewDocumentTabId,
} from '@app/domain/tabbed-document-url';
import { useFilesViewed } from '@app/hooks/settings/use-setting';
import { isMetaKey, MouseButtons } from '@app/keys';
import { DocumentTypeEnum, type JournalfoertDokumentReference } from '@app/types/documents/documents';
import { useCallback, useContext, useMemo } from 'react';

interface BaseProps {
  title: string;
  url: string;
  documentId: string;
  icon: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface JournalfoertProps extends BaseProps {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: JournalfoertDokumentReference;
}

interface NotJournalfoertProps extends BaseProps {
  type: Exclude<DocumentTypeEnum, DocumentTypeEnum.JOURNALFOERT>;
  parentId: string | null;
  journalfoertDokumentReference?: never;
}

type Props = JournalfoertProps | NotJournalfoertProps;

export const SharedDocumentTitle = (props: Props) => {
  const { title, url, documentId, icon, disabled = false, children, type, journalfoertDokumentReference } = props;
  const { value, setNewDocument, setArchivedFiles: setArchivedDocuments, setVedleggsoversikt } = useFilesViewed();
  const { getTabRef, setTabRef } = useContext(TabContext);

  const tabId = getTabId(props);

  const isTabOpen = useIsTabOpen(tabId);

  const dokumentInfoId = journalfoertDokumentReference?.dokumentInfoId;

  const isInlineOpen = useMemo(() => {
    if (type === DocumentTypeEnum.JOURNALFOERT) {
      return value.archivedFiles?.some((d) => d.dokumentInfoId === dokumentInfoId) ?? false;
    }

    if (type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return value.vedleggsoversikt === documentId;
    }

    return value.newDocument === documentId;
  }, [documentId, dokumentInfoId, type, value]);

  const setViewedDocument = useCallback(() => {
    if (journalfoertDokumentReference !== undefined) {
      if (canOpenInKabal(journalfoertDokumentReference.varianter)) {
        return setArchivedDocuments([
          {
            journalpostId: journalfoertDokumentReference.journalpostId,
            dokumentInfoId: journalfoertDokumentReference.dokumentInfoId,
          },
        ]);
      }

      return downloadDocuments({ ...journalfoertDokumentReference, tittel: title });
    }

    if (type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return setVedleggsoversikt(documentId);
    }

    setNewDocument(documentId);
  }, [
    journalfoertDokumentReference,
    title,
    documentId,
    type,
    setNewDocument,
    setArchivedDocuments,
    setVedleggsoversikt,
  ]);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled || e.button === MouseButtons.RIGHT) {
      return;
    }

    e.preventDefault();

    if (disabled) {
      return;
    }

    const shouldOpenInNewTab = isMetaKey(e) || e.button === MouseButtons.MIDDLE;

    // Open in PDF-viewer panel.
    if (!shouldOpenInNewTab) {
      setViewedDocument();

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
    <StyledDocumentTitle>
      <DocumentLink
        active={isInlineOpen || isTabOpen}
        disabled={disabled}
        aria-current={isInlineOpen || isTabOpen}
        onClick={onClick}
        onAuxClick={onClick}
        data-testid="document-open-button"
        href={url}
        target={tabId}
        icon={icon}
      >
        {title}
      </DocumentLink>
      {children}
    </StyledDocumentTitle>
  );
};

const getTabId = (props: Props) => {
  if (props.type === DocumentTypeEnum.JOURNALFOERT) {
    return getJournalfoertDocumentTabId(
      props.journalfoertDokumentReference.journalpostId,
      props.journalfoertDokumentReference.dokumentInfoId,
    );
  }

  if (props.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
    return getAttachmentsOverviewTabId(props.documentId);
  }

  return getNewDocumentTabId(props.documentId, props.parentId);
};
