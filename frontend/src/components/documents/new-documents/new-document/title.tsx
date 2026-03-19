import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { DocumentWarnings } from '@/components/documents/document-warnings';
import { DragAndDropContext } from '@/components/documents/drag-context';
import { TitleActions, type TitleActionsProps } from '@/components/documents/new-documents/new-document/title-actions';
import { StyledDocumentTitle } from '@/components/documents/new-documents/new-document/title-style';
import { DocumentIcon } from '@/components/documents/new-documents/shared/document-icon';
import { SharedDocumentTitle } from '@/components/documents/new-documents/shared/title';
import { SetFilename } from '@/components/documents/set-filename';
import { getJournalfoertDocumentTabId } from '@/domain/tabbed-document-url';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentTabUrl } from '@/hooks/use-document-tab-url';
import { useSetTitleMutation } from '@/redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum, type IDocument } from '@/types/documents/documents';

interface Props {
  document: IDocument;
  renameAccessError: string | null;
}

export const DocumentTitle = memo(
  ({ document, renameAccessError }: Props) => {
    const [editMode, _setEditMode] = useState(false);
    const { setDraggingEnabled } = useContext(DragAndDropContext);
    const oppgaveId = useOppgaveId();
    const [setTitle] = useSetTitleMutation();

    const { getNewTabUrl, getJournalfoertTabUrl } = useDocumentTabUrl();

    const [url, documentId] = useMemo<[string, string] | [undefined, undefined]>(() => {
      if (document.type !== DocumentTypeEnum.JOURNALFOERT) {
        if (oppgaveId === skipToken) {
          return [undefined, undefined];
        }

        return [getNewTabUrl(oppgaveId, document.id, document.parentId), document.id];
      }

      const { dokumentInfoId, journalpostId } = document.journalfoertDokumentReference;

      return [
        getJournalfoertTabUrl(journalpostId, dokumentInfoId),
        getJournalfoertDocumentTabId(journalpostId, dokumentInfoId),
      ];
    }, [document, oppgaveId, getNewTabUrl, getJournalfoertTabUrl]);

    const setEditMode = useCallback(
      (edit: boolean) => {
        _setEditMode(edit);
        setDraggingEnabled(!edit);
      },
      [setDraggingEnabled],
    );

    const titleActionsProps: TitleActionsProps = {
      document,
      setEditMode,
      editMode,
      renameAccessError,
    };

    if (editMode) {
      return (
        <StyledDocumentTitle>
          <SetFilename
            autoFocus
            hideLabel
            tittel={document.tittel}
            close={() => setEditMode(false)}
            setFilename={async (title) => {
              if (oppgaveId === skipToken) {
                return;
              }

              await setTitle({ oppgaveId, dokumentId: document.id, title });
            }}
          />
          <TitleActions {...titleActionsProps} />
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
          <DocumentWarnings varianter={document.journalfoertDokumentReference.varianter} />

          <TitleActions {...titleActionsProps} />
        </SharedDocumentTitle>
      );
    }

    return (
      <SharedDocumentTitle
        title={document.tittel}
        parentId={document.parentId}
        url={url}
        icon={<DocumentIcon type={document.type} />}
        documentId={documentId}
        type={document.type}
      >
        <TitleActions {...titleActionsProps} />
      </SharedDocumentTitle>
    );
  },
  (prevProps, nextProps) =>
    prevProps.document.id === nextProps.document.id &&
    prevProps.document.tittel === nextProps.document.tittel &&
    prevProps.renameAccessError === nextProps.renameAccessError,
);

DocumentTitle.displayName = 'DocumentTitle';
