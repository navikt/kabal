import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  StyledDocumentTitle,
  StyledTitleAction,
} from '@app/components/documents/new-documents/new-document/title-style';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import {
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useArchivedDocumentsFullTitle } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentLink } from '../../styled-components/document-link';
import { SetFilename } from '../shared/set-filename';
import { TitleAction } from './title-action';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();
  const [editMode, setEditMode] = useState(false);
  const { getTabRef, setTabRef } = useContext(TabContext);
  const [isExpanded] = useIsExpanded();
  const oppgaveId = useOppgaveId();
  const maxWidth = useMaxWidth(document);

  const isInlineOpen = useMemo(
    () =>
      value.some((v) => {
        if (document.type === DocumentTypeEnum.JOURNALFOERT) {
          return (
            v.type === DocumentTypeEnum.JOURNALFOERT &&
            v.dokumentInfoId === document.journalfoertDokumentReference.dokumentInfoId
          );
        }

        return v.type === document.type && v.documentId === document.id;
      }),
    [document, value],
  );

  const [url, documentId] = useMemo<[string, string] | [undefined, undefined]>(() => {
    if (document.type !== DocumentTypeEnum.JOURNALFOERT) {
      if (oppgaveId === skipToken) {
        return [undefined, undefined];
      }

      return [getNewDocumentTabUrl(oppgaveId, document.id), getNewDocumentTabId(document.id)];
    }

    const { dokumentInfoId, journalpostId } = document.journalfoertDokumentReference;

    return [
      getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId),
      getJournalfoertDocumentTabId(journalpostId, dokumentInfoId),
    ];
  }, [document, oppgaveId]);

  const isTabOpen = useIsTabOpen(documentId);

  const disabled =
    url === undefined ||
    (document.type === DocumentTypeEnum.JOURNALFOERT &&
      !document.journalfoertDokumentReference.harTilgangTilArkivvariant);

  const setViewedDocument = useCallback(() => {
    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      setValue([
        {
          type: document.type,
          ...document.journalfoertDokumentReference,
        },
      ]);

      return;
    }

    setValue([
      {
        type: document.type,
        documentId: document.id,
      },
    ]);
  }, [document, setValue]);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (disabled) {
        return;
      }

      const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === 1;

      // Open in PDF-viewer panel.
      if (!shouldOpenInNewTab) {
        setViewedDocument();

        return;
      }

      if (documentId === undefined) {
        toast.error('Kunne ikke åpne dokument i ny fane');

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
      const newTabRef = window.open(url, documentId);

      if (newTabRef === null) {
        toast.error('Kunne ikke åpne dokument i ny fane');

        return;
      }

      setTabRef(documentId, newTabRef);
    },
    [disabled, getTabRef, isTabOpen, setTabRef, setViewedDocument, documentId, url],
  );

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename autoFocus hideLabel document={document} onDone={() => setEditMode(false)} />
        <TitleAction editMode={editMode} setEditMode={setEditMode} document={document} />
      </StyledDocumentTitle>
    );
  }

  return (
    <StyledDocumentTitle style={{ maxWidth }}>
      <StyledDocumentLink
        $disabled={disabled}
        $isActive={isInlineOpen || isTabOpen}
        aria-pressed={isInlineOpen || isTabOpen}
        onClick={onClick}
        onAuxClick={onClick}
        data-testid="document-open-button"
        href={url}
        target={documentId}
      >
        <DocumentIcon type={document.type} />
        <EllipsisTitle title={document.tittel}>{document.tittel}</EllipsisTitle>
      </StyledDocumentLink>
      {isExpanded ? <StyledTitleAction editMode={editMode} setEditMode={setEditMode} document={document} /> : null}
    </StyledDocumentTitle>
  );
};

const useMaxWidth = (document: IMainDocument): string => {
  const { value: fullTitle } = useArchivedDocumentsFullTitle();

  if (fullTitle) {
    return 'unset';
  }

  return document.parentId === null ? '712px' : '862px';
};
