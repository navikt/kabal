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
import { toast } from '@app/components/toast/store';
import type { IShownDocument } from '@app/components/view-pdf/types';
import { getJournalfoertDocumentInlineUrl } from '@app/domain/inline-document-url';
import { getJournalfoertDocumentTabId, getJournalfoertDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { areArraysEqual } from '@app/functions/are-arrays-equal';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { isMetaKey, MouseButtons } from '@app/keys';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import type { Variants } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
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
  const { value, setValue } = useDocumentsPdfViewed();

  return <DocumentTitleInternal {...props} shownDocuments={value} setShownDocuments={setValue} />;
};

interface DocumentTitleInternalProps extends Props {
  shownDocuments: IShownDocument[];
  setShownDocuments: (value: IShownDocument[]) => void;
}

const DocumentTitleInternal = memo(
  ({
    journalpostId,
    dokumentInfoId,
    tittel,
    hasAccess,
    varianter,
    shownDocuments,
    setShownDocuments,
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
      () => shownDocuments.some((v) => v.type === DocumentTypeEnum.JOURNALFOERT && v.dokumentInfoId === dokumentInfoId),
      [dokumentInfoId, shownDocuments],
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
            setFilename={(filename) => {
              if (oppgaveId !== skipToken) {
                setTitle({ journalpostId, dokumentInfoId, tittel: filename, oppgaveId, originalTitle: tittel });
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
      ? getJournalfoertDocumentInlineUrl(journalpostId, dokumentInfoId)
      : getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      if (!hasAccess || isDownload || e.button === MouseButtons.RIGHT) {
        // Use default browser behavior.
        return;
      }

      e.preventDefault();

      const shouldOpenInNewTab = isMetaKey(e) || e.button === MouseButtons.MIDDLE;

      if (!shouldOpenInNewTab) {
        setShownDocuments([
          {
            type: DocumentTypeEnum.JOURNALFOERT,
            varianter,
            dokumentInfoId,
            journalpostId,
          },
        ]);

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
          aria-pressed={isInlineOpen || isTabOpen}
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
    areArraysEqual(prevProps.shownDocuments, nextProps.shownDocuments),
);

DocumentTitleInternal.displayName = 'DocumentTitleInternal';
