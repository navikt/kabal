import { canOpenInKabal } from '@app/components/documents/filetype';
import { useMarkVisited } from '@app/components/file-viewer/use-mark-visited';
import { KabalFileViewer } from '@app/components/kabal-file-viewer';
import {
  getAttachmentsOverviewFileUrl,
  getJournalfoertDocumentFileUrl,
  getNewDocumentFileUrl,
} from '@app/domain/file-url';
import {
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabUrl,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, Variants } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument, type JournalfoertDokument } from '@app/types/documents/documents';
import { Alert, Box, Loader, VStack } from '@navikt/ds-react';
import type { FileEntry } from '@navikt/klage-file-viewer';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import type { IShownArchivedDocument, IShownDocument } from './types';
import { useFileViewerUrl } from './use-file-viewer-url';

export const FileViewer = () => {
  const { remove: closePdfViewer } = useFilesViewed();
  const { showDocumentList, isLoading } = useShownDocuments();
  const oppgaveId = useOppgaveId();

  const fileViewerUrl = useFileViewerUrl();

  const { data: documentsInProgress = EMPTY_DOCUMENTS } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);
  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED;

  const expandedDocumentList = useMemo(
    () => expandDocumentList(showDocumentList, documentsInProgress),
    [showDocumentList, documentsInProgress],
  );

  const { files, tabUrls } = useMemo(() => {
    if (oppgaveId === skipToken) {
      return EMPTY_FILES_AND_TAB_URLS;
    }

    const entries: FileEntry[] = [];
    const urls: string[] = [];

    for (const file of expandedDocumentList) {
      if (file.type === DocumentTypeEnum.JOURNALFOERT) {
        const fileUrl = getJournalfoertDocumentFileUrl(file.journalpostId, file.dokumentInfoId);
        const tabUrl = getJournalfoertDocumentTabUrl(file.journalpostId, file.dokumentInfoId);
        const title = getArchivedDocumentTitle(file, journalpostDocuments);
        urls.push(tabUrl);

        entries.push({
          variants: toFileEntryVariants(file.varianter),
          title,
          url: fileUrl,
          downloadUrl: fileUrl,
          newTabUrl: tabUrl,
        });

        continue;
      }

      if (file.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
        const fileUrl = getAttachmentsOverviewFileUrl(oppgaveId, file.documentId);
        const newTabUrl = getAttachmentsOverviewTabUrl(oppgaveId, file.documentId);
        const title = 'Vedleggsoversikt';

        urls.push(newTabUrl);

        entries.push({ variants: 'PDF', title, url: fileUrl, downloadUrl: fileUrl, newTabUrl });

        continue;
      }

      const fileUrl = getNewDocumentFileUrl(oppgaveId, file.documentId);
      const newTabUrl = getNewDocumentTabUrl(oppgaveId, file.documentId, file.parentId);
      const title = documentsInProgress.find((d) => d.id === file.documentId)?.tittel ?? 'Ukjent dokument';

      urls.push(newTabUrl);

      entries.push({ variants: 'PDF', title, url: fileUrl, downloadUrl: fileUrl, newTabUrl });
    }

    return { files: entries, tabUrls: urls };
  }, [oppgaveId, expandedDocumentList, journalpostDocuments, documentsInProgress]);

  useMarkVisited(tabUrls);

  if (showDocumentList.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <Loader title="Laster dokument" size="3xlarge" />
      </Container>
    );
  }

  if (files.length === 0) {
    return (
      <Container>
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </Container>
    );
  }

  return <KabalFileViewer files={files} onClose={closePdfViewer} newTabUrl={fileViewerUrl} />;
};

const EMPTY_DOCUMENTS: IDocument[] = [];
const EMPTY_ARCHIVED: IArkivertDocument[] = [];
const EMPTY_FILES_AND_TAB_URLS: { files: FileEntry[]; tabUrls: string[] } = { files: [], tabUrls: [] };

const expandDocumentList = (showDocumentList: IShownDocument[], documentsInProgress: IDocument[]): IShownDocument[] =>
  showDocumentList.flatMap((doc) => {
    if (doc.type !== DocumentTypeEnum.SMART && doc.type !== DocumentTypeEnum.UPLOADED) {
      return [doc];
    }

    if (doc.parentId !== null) {
      return [doc];
    }

    const attachments = documentsInProgress.filter((d) => d.parentId === doc.documentId);

    if (attachments.length === 0) {
      return [doc];
    }

    const attachmentDocs: IShownDocument[] = attachments.map(attachmentToShownDocument);

    const vedleggsoversikt: IShownDocument = {
      type: DocumentTypeEnum.VEDLEGGSOVERSIKT,
      documentId: doc.documentId,
      parentId: null,
    };

    return [doc, vedleggsoversikt, ...attachmentDocs];
  });

const isJournalfoertDocument = (doc: IDocument): doc is JournalfoertDokument =>
  doc.type === DocumentTypeEnum.JOURNALFOERT;

const attachmentToShownDocument = (doc: IDocument): IShownDocument => {
  if (isJournalfoertDocument(doc)) {
    return {
      type: DocumentTypeEnum.JOURNALFOERT,
      journalpostId: doc.journalfoertDokumentReference.journalpostId,
      dokumentInfoId: doc.journalfoertDokumentReference.dokumentInfoId,
      varianter: doc.journalfoertDokumentReference.varianter,
    };
  }

  return {
    type: doc.type,
    documentId: doc.id,
    parentId: doc.parentId,
  };
};

const getArchivedDocumentTitle = (doc: IShownArchivedDocument, journalpostDocuments: IArkivertDocument[]): string => {
  for (const jp of journalpostDocuments) {
    if (jp.journalpostId !== doc.journalpostId) {
      continue;
    }

    if (jp.dokumentInfoId === doc.dokumentInfoId) {
      return canOpenInKabal(jp.varianter) ? (jp.tittel ?? 'Ukjent dokument') : 'Ukjent dokument';
    }

    const vedlegg = jp.vedlegg.find((v) => v.dokumentInfoId === doc.dokumentInfoId);

    if (vedlegg === undefined || !canOpenInKabal(vedlegg.varianter)) {
      return 'Ukjent dokument';
    }

    return vedlegg.tittel ?? 'Ukjent dokument';
  }

  return 'Ukjent dokument';
};

const toFileEntryVariants = (variants: Variants): FileEntry['variants'] =>
  variants.length === 1 ? variants[0] : variants;

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

const Container = ({ children }: ContainerProps) => (
  <VStack
    asChild
    width="min-content"
    className="snap-start"
    align="center"
    justify="center"
    data-testid="show-document"
  >
    <Box as="section" background="default" shadow="dialog" borderRadius="4" position="relative">
      {children}
    </Box>
  </VStack>
);
