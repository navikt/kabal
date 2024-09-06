import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { SetFilename } from '@app/components/documents/set-filename';
import { DocumentLink, EllipsisTitle } from '@app/components/documents/styled-components/document-link';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { IShownDocument } from '@app/components/view-pdf/types';
import { getJournalfoertDocumentTabId, getJournalfoertDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { areArraysEqual } from '@app/functions/are-arrays-equal';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { MouseButtons } from '@app/keys';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ConfirmEditButton, DocumentTitleActions } from './document-title-actions';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  harTilgangTilArkivvariant: boolean;
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
    harTilgangTilArkivvariant,
    shownDocuments,
    setShownDocuments,
  }: DocumentTitleInternalProps) => {
    const { getTabRef, setTabRef } = useContext(TabContext);
    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);
    const isTabOpen = useIsTabOpen(documentId);
    const { setDraggingEnabled } = useContext(DragAndDropContext);
    const oppgaveId = useOppgaveId();
    const [setTitle] = useSetTitleMutation();

    const [editMode, _setEditMode] = useState(false);

    const isInlineOpen = useMemo(
      () => shownDocuments.some((v) => v.type === DocumentTypeEnum.JOURNALFOERT && v.dokumentInfoId === dokumentInfoId),
      [dokumentInfoId, shownDocuments],
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
            tittel={tittel}
            close={() => setEditMode(false)}
            hideLabel
            setFilename={(filename) => {
              if (oppgaveId === skipToken) {
                return;
              }

              setTitle({ journalpostId, dokumentInfoId, tittel: filename, oppgaveId });
            }}
          />

          <ConfirmEditButton setEditMode={setEditMode} />
        </StyledDocumentTitle>
      );
    }

    const href = getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      if (e.button === MouseButtons.RIGHT) {
        return;
      }

      e.preventDefault();

      if (!harTilgangTilArkivvariant) {
        return;
      }

      const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === MouseButtons.MIDDLE;

      if (!shouldOpenInNewTab) {
        setShownDocuments([
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
        <DocumentLink
          active={isInlineOpen || isTabOpen}
          aria-pressed={isInlineOpen || isTabOpen}
          disabled={!harTilgangTilArkivvariant}
          onClick={onClick}
          onAuxClick={onClick}
          data-testid="document-open-button"
          href={href}
          target={documentId}
        >
          <EllipsisTitle title={tittel}>{tittel}</EllipsisTitle>
        </DocumentLink>

        <DocumentTitleActions
          setEditMode={setEditMode}
          tittel={tittel}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        />
      </StyledDocumentTitle>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tittel === nextProps.tittel &&
    prevProps.harTilgangTilArkivvariant === nextProps.harTilgangTilArkivvariant &&
    prevProps.dokumentInfoId === nextProps.dokumentInfoId &&
    prevProps.journalpostId === nextProps.journalpostId &&
    areArraysEqual(prevProps.shownDocuments, nextProps.shownDocuments),
);

DocumentTitleInternal.displayName = 'DocumentTitleInternal';
