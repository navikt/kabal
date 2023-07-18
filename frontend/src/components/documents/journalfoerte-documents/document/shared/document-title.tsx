import React, { memo, useContext, useMemo, useState } from 'react';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
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

export const DocumentTitle = memo(
  ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: Props) => {
    const { value, setValue } = useDocumentsPdfViewed();
    const [isExpanded] = useIsExpanded();
    const { getTabRef, setTabRef } = useContext(TabContext);

    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);

    const isTabOpen = useIsTabOpen(documentId);

    const [editMode, setEditMode] = useState(false);

    const isInlineOpen = useMemo(
      () => value.some((v) => v.type === DocumentTypeEnum.JOURNALFOERT && v.dokumentInfoId === dokumentInfoId),
      [dokumentInfoId, value],
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
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel}
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
        setValue([
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
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel}
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

DocumentTitle.displayName = 'DocumentTitle';
