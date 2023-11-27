import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { IShownDocument } from '@app/components/view-pdf/types';
import { getJournalfoertDocumentTabId, getJournalfoertDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentLink } from '../../../styled-components/document-link';
import { DocumentTitleActions } from './document-title-actions';
import { SetFilename } from './set-filename';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  harTilgangTilArkivvariant: boolean;
}

export const DocumentTitle = (props: Props) => {
  // These hooks would cause rerenders if they were used directly in DocumentTitleInternal, even though used values does not change
  const { value, setValue } = useDocumentsPdfViewed();
  const [isExpanded] = useIsExpanded();

  return <DocumentTitleInternal {...props} shownDocument={value} setShownDocument={setValue} isExpanded={isExpanded} />;
};

interface DocumentTitleInternalProps extends Props {
  shownDocument: IShownDocument[];
  setShownDocument: (value: IShownDocument[]) => void;
  isExpanded: boolean;
}

const DocumentTitleInternal = memo(
  ({
    journalpostId,
    dokumentInfoId,
    tittel,
    harTilgangTilArkivvariant,
    shownDocument,
    setShownDocument,
    isExpanded,
  }: DocumentTitleInternalProps) => {
    const { getTabRef, setTabRef } = useContext(TabContext);
    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);
    const isTabOpen = useIsTabOpen(documentId);
    const { setDraggingEnabled } = useContext(DragAndDropContext);

    const [editMode, _setEditMode] = useState(false);

    const isInlineOpen = useMemo(
      () => shownDocument.some((v) => v.type === DocumentTypeEnum.JOURNALFOERT && v.dokumentInfoId === dokumentInfoId),
      [dokumentInfoId, shownDocument],
    );

    const setEditMode = useCallback(
      (edit: boolean) => {
        _setEditMode(edit);
        setDraggingEnabled(!edit);
      },
      [setDraggingEnabled],
    );

    if (editMode) {
      return (
        <StyledDocumentTitle>
          <SetFilename
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            tittel={tittel}
            onDone={() => setEditMode(false)}
          />
          <DocumentTitleActions
            editMode={editMode}
            setEditMode={setEditMode}
            tittel={tittel}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          />
        </StyledDocumentTitle>
      );
    }

    const href = getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      e.preventDefault();

      if (!harTilgangTilArkivvariant) {
        return;
      }

      const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === 1;

      if (!shouldOpenInNewTab) {
        setShownDocument([
          {
            type: DocumentTypeEnum.JOURNALFOERT,
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
      <StyledDocumentTitle>
        <StyledDocumentLink
          $isActive={isInlineOpen || isTabOpen}
          aria-pressed={isInlineOpen || isTabOpen}
          $disabled={!harTilgangTilArkivvariant}
          onClick={onClick}
          onAuxClick={onClick}
          data-testid="document-open-button"
          href={href}
          target={documentId}
        >
          <EllipsisTitle title={tittel}>{tittel}</EllipsisTitle>
        </StyledDocumentLink>
        {isExpanded ? (
          <DocumentTitleActions
            editMode={editMode}
            setEditMode={setEditMode}
            tittel={tittel}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          />
        ) : null}
      </StyledDocumentTitle>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tittel === nextProps.tittel &&
    prevProps.harTilgangTilArkivvariant === nextProps.harTilgangTilArkivvariant &&
    prevProps.dokumentInfoId === nextProps.dokumentInfoId &&
    prevProps.journalpostId === nextProps.journalpostId,
);

DocumentTitleInternal.displayName = 'DocumentTitleInternal';
