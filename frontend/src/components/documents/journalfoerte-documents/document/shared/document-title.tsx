import { DocumentWarnings } from '@app/components/documents/document-warnings';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canOpenInKabal } from '@app/components/documents/filetype';
import { DocumentTitleContainer } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-container';
import { convertRealToAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { SetFilename } from '@app/components/documents/set-filename';
import { DocumentLink } from '@app/components/documents/styled-components/document-link';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import type { IFilesViewed } from '@app/components/file-viewer/types';
import { toast } from '@app/components/toast/store';
import { getJournalfoertDocumentFileUrl } from '@app/domain/file-url';
import { getJournalfoertDocumentTabId, getJournalfoertDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from '@app/hooks/settings/use-setting';
import { isMetaKey, MouseButtons } from '@app/keys';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import type { Variants } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ConfirmEditButton, DocumentTitleActions } from './document-title-actions';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  hasAccess: boolean;
  documentIndex: number;
  vedleggIndex?: number;
  varianter: Variants;
  tittel: string;
}

export const DocumentTitle = (props: Props) => {
  // These hooks would cause rerenders if they were used directly in DocumentTitleInternal, even though used values does not change.
  const { value, setArchivedFiles: setArchivedDocuments } = useFilesViewed();

  return <DocumentTitleInternal {...props} pdfViewed={value} setArchivedDocuments={setArchivedDocuments} />;
};

interface DocumentTitleInternalProps extends Props {
  pdfViewed: IFilesViewed;
  setArchivedDocuments: (documents: readonly IJournalfoertDokumentId[]) => void;
}

const DocumentTitleInternal = memo(
  ({
    journalpostId,
    dokumentInfoId,
    tittel,
    hasAccess,
    varianter,
    pdfViewed,
    setArchivedDocuments,
    documentIndex,
    vedleggIndex = -1,
  }: DocumentTitleInternalProps) => {
    const { getTabRef, setTabRef } = useContext(TabContext);
    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);
    const isTabOpen = useIsTabOpen(documentId);
    const { setDraggingEnabled } = useContext(DragAndDropContext);
    const oppgaveId = useOppgaveId();
    const [setTitle] = useSetTitleMutation();

    const isDownload = useMemo(() => !canOpenInKabal(varianter), [varianter]);

    const [editMode, _setEditMode] = useState(false);

    const isInlineOpen = useMemo(
      () => pdfViewed.archivedFiles?.some((d) => d.dokumentInfoId === dokumentInfoId) ?? false,
      [dokumentInfoId, pdfViewed.archivedFiles],
    );

    const setEditMode = useCallback(
      (edit: boolean) => {
        _setEditMode(edit);
        setDraggingEnabled(!edit);
        const index = convertRealToAccessibleDocumentIndex([documentIndex, vedleggIndex]);
        setFocusIndex(index);
      },
      [setDraggingEnabled, documentIndex, vedleggIndex],
    );

    const filenameInputRef = useRef<HTMLInputElement | null>(null);

    if (editMode) {
      return (
        <DocumentTitleContainer onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <SetFilename
            tittel={tittel}
            close={() => {
              setEditMode(false);
              filenameInputRef.current?.dispatchEvent(new Event('focus-journalfoerte-documents', { bubbles: true }));
              const index = convertRealToAccessibleDocumentIndex([documentIndex, vedleggIndex]);
              setFocusIndex(index);
            }}
            hideLabel
            setFilename={async (filename) => {
              if (oppgaveId !== skipToken) {
                await setTitle({ journalpostId, dokumentInfoId, tittel: filename, oppgaveId });
              }
            }}
            autoFocus
            ref={filenameInputRef}
          />

          <ConfirmEditButton setEditMode={setEditMode} />
        </DocumentTitleContainer>
      );
    }

    const href = isDownload
      ? getJournalfoertDocumentFileUrl(journalpostId, dokumentInfoId)
      : getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      if (!hasAccess || isDownload || e.button === MouseButtons.RIGHT) {
        // Use default browser behavior.
        return;
      }

      e.preventDefault();

      const shouldOpenInNewTab = isMetaKey(e) || e.button === MouseButtons.MIDDLE;

      if (!shouldOpenInNewTab) {
        setArchivedDocuments([{ journalpostId, dokumentInfoId }]);

        return;
      }

      const tabRef = getTabRef(documentId);

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
      const newTabRef = window.open(href, documentId);

      if (newTabRef === null) {
        toast.error('Kunne ikke åpne dokument i ny fane');

        return;
      }

      setTabRef(documentId, newTabRef);
    };

    return (
      <DocumentTitleContainer>
        <DocumentLink
          active={isInlineOpen || isTabOpen}
          aria-current={isInlineOpen || isTabOpen ? 'true' : undefined}
          disabled={!hasAccess}
          onClick={onClick}
          onAuxClick={onClick}
          data-testid="document-open-button"
          href={href}
          target={documentId}
          download={isDownload}
          tabIndex={-1}
        >
          {tittel}
        </DocumentLink>

        <DocumentWarnings varianter={varianter} />

        <DocumentTitleActions setEditMode={setEditMode} tittel={tittel} hasAccess={hasAccess} />
      </DocumentTitleContainer>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tittel === nextProps.tittel &&
    prevProps.hasAccess === nextProps.hasAccess &&
    prevProps.varianter === nextProps.varianter &&
    prevProps.dokumentInfoId === nextProps.dokumentInfoId &&
    prevProps.journalpostId === nextProps.journalpostId &&
    prevProps.documentIndex === nextProps.documentIndex &&
    prevProps.vedleggIndex === nextProps.vedleggIndex &&
    prevProps.pdfViewed === nextProps.pdfViewed &&
    prevProps.setArchivedDocuments === nextProps.setArchivedDocuments,
);

DocumentTitleInternal.displayName = 'DocumentTitleInternal';
