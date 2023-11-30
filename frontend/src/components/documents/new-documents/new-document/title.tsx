import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  StyledDocumentTitle,
  StyledTitleAction,
} from '@app/components/documents/new-documents/new-document/title-style';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SharedDocumentTitle } from '@app/components/documents/new-documents/shared/title';
import { SetFilename } from '@app/components/documents/set-filename';
import {
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { TitleAction } from './title-action';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = memo(
  ({ document }: Props) => {
    const [editMode, _setEditMode] = useState(false);
    const { setDraggingEnabled } = useContext(DragAndDropContext);
    const oppgaveId = useOppgaveId();
    const [setTitle] = useSetTitleMutation();

    const [url, documentId] = useMemo<[string, string] | [undefined, undefined]>(() => {
      if (document.type !== DocumentTypeEnum.JOURNALFOERT) {
        if (oppgaveId === skipToken) {
          return [undefined, undefined];
        }

        return [getNewDocumentTabUrl(oppgaveId, document.id), document.id];
      }

      const { dokumentInfoId, journalpostId } = document.journalfoertDokumentReference;

      return [
        getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId),
        getJournalfoertDocumentTabId(journalpostId, dokumentInfoId),
      ];
    }, [document, oppgaveId]);

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
            autoFocus
            hideLabel
            tittel={document.tittel}
            close={() => setEditMode(false)}
            setFilename={(title) => {
              if (oppgaveId === skipToken) {
                return;
              }

              setTitle({ oppgaveId, dokumentId: document.id, title });
            }}
          />
          <TitleAction editMode={editMode} setEditMode={setEditMode} document={document} />
        </StyledDocumentTitle>
      );
    }

    if (url === undefined || documentId === undefined) {
      return null;
    }

    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      return (
        <SharedDocumentTitle
          title={document.tittel}
          url={url}
          icon={<DocumentIcon type={document.type} />}
          documentId={documentId}
          type={document.type}
          journalfoertDokumentReference={document.journalfoertDokumentReference}
        >
          <StyledTitleAction editMode={editMode} setEditMode={setEditMode} document={document} />
        </SharedDocumentTitle>
      );
    }

    return (
      <SharedDocumentTitle
        title={document.tittel}
        url={url}
        icon={<DocumentIcon type={document.type} />}
        documentId={documentId}
        type={document.type}
      >
        <StyledTitleAction editMode={editMode} setEditMode={setEditMode} document={document} />
      </SharedDocumentTitle>
    );
  },
  (prevProps, nextProps) =>
    prevProps.document.id === nextProps.document.id && prevProps.document.tittel === nextProps.document.tittel,
);

DocumentTitle.displayName = 'DocumentTitle';
