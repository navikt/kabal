import { canOpenInKabal } from '@app/components/documents/filetype';
import { KabalPdfViewer } from '@app/components/kabal-pdf-viewer';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { Variant } from '@app/components/view-pdf/variant';
import {
  getAttachmentsOverviewInlineUrl,
  getJournalfoertDocumentInlineUrl,
  getNewDocumentInlineUrl,
} from '@app/domain/inline-document-url';
import {
  getAttachmentsOverviewTabId,
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Skjerming, VariantFormat } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument, type JournalfoertDokument } from '@app/types/documents/documents';
import { Alert, Box, Loader, VStack } from '@navikt/ds-react';
import type { PdfEntry } from '@navikt/klage-pdf-viewer';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState } from 'react';
import type { IShownArchivedDocument, IShownDocument } from './types';
import { useDocumentSetUrl } from './use-document-set-url';

export const ViewPDF = () => {
  const { remove: closePdfViewer } = useDocumentsPdfViewed();
  const { showDocumentList, isLoading } = useShownDocuments();
  const oppgaveId = useOppgaveId();

  const documentSetUrl = useDocumentSetUrl();

  const { data: documentsInProgress = EMPTY_DOCUMENTS } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);
  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED;

  const [redactedState, setRedactedState] = useState<Map<string, boolean>>(new Map());

  const setShowRedactedForDoc = useCallback((docKey: string, showRedacted: boolean) => {
    setRedactedState((prev) => {
      const next = new Map(prev);
      next.set(docKey, showRedacted);

      return next;
    });
  }, []);

  const expandedDocumentList = useMemo(
    () => expandDocumentList(showDocumentList, documentsInProgress),
    [showDocumentList, documentsInProgress],
  );

  const { pdfs, tabUrls } = useMemo(() => {
    if (oppgaveId === skipToken) {
      return EMPTY_PDFS_AND_TAB_URLS;
    }

    const entries: PdfEntry[] = [];
    const urls: string[] = [];

    for (const doc of expandedDocumentList) {
      const { inlineUrl, tabUrl, tabId, key } = getDocumentInfo(doc, oppgaveId);

      if (inlineUrl === undefined) {
        continue;
      }

      const title = getDocumentTitle(doc, journalpostDocuments, documentsInProgress);
      const isArchived = doc.type === DocumentTypeEnum.JOURNALFOERT;

      const docHasRedacted = isArchived && doc.varianter.some(({ format: f }) => f === VariantFormat.SLADDET);
      const docHasAccessToArchive =
        isArchived && doc.varianter.some(({ hasAccess, format: f }) => hasAccess && f === VariantFormat.ARKIV);

      const docShowRedacted = redactedState.get(key) ?? docHasRedacted;
      const docFormat = docShowRedacted && docHasRedacted ? VariantFormat.SLADDET : VariantFormat.ARKIV;

      const showsPol =
        isArchived && doc.varianter.some((v) => v.hasAccess && v.format === docFormat && v.skjerming === Skjerming.POL);

      const showsFeil =
        isArchived &&
        doc.varianter.some((v) => v.hasAccess && v.format === docFormat && v.skjerming === Skjerming.FEIL);

      const newTabUrl =
        isArchived && docHasRedacted && docHasAccessToArchive ? `${tabUrl}?format=${docFormat}` : tabUrl;

      urls.push(tabUrl);

      entries.push({
        title,
        url: inlineUrl,
        newTab: {
          url: newTabUrl,
          id: tabId,
        },
        headerExtra: isArchived ? (
          <Variant
            showsPol={showsPol}
            showsFeil={showsFeil}
            hasRedactedDocuments={docHasRedacted}
            hasAccessToArchivedDocuments={docHasAccessToArchive}
            showRedacted={docShowRedacted}
            setShowRedacted={(value: boolean) => setShowRedactedForDoc(key, value)}
          />
        ) : undefined,
      });
    }

    return { pdfs: entries, tabUrls: urls };
  }, [
    oppgaveId,
    expandedDocumentList,
    journalpostDocuments,
    documentsInProgress,
    redactedState,
    setShowRedactedForDoc,
  ]);

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

  if (pdfs.length === 0) {
    return (
      <Container>
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </Container>
    );
  }

  return <KabalPdfViewer pdfs={pdfs} onClose={closePdfViewer} documentSetUrl={documentSetUrl} />;
};

const EMPTY_DOCUMENTS: IDocument[] = [];
const EMPTY_ARCHIVED: IArkivertDocument[] = [];
const EMPTY_PDFS_AND_TAB_URLS: { pdfs: PdfEntry[]; tabUrls: string[] } = { pdfs: [], tabUrls: [] };

interface DocumentInfo {
  inlineUrl: string | undefined;
  tabUrl: string;
  tabId: string;
  key: string;
}

/** Returns the inline URL, tab URL, tab ID, and stable key for a document. */
const getDocumentInfo = (doc: IShownDocument, oppgaveId: string): DocumentInfo => {
  if (doc.type === DocumentTypeEnum.JOURNALFOERT) {
    return {
      inlineUrl: getJournalfoertDocumentInlineUrl(doc.journalpostId, doc.dokumentInfoId),
      tabUrl: getJournalfoertDocumentTabUrl(doc.journalpostId, doc.dokumentInfoId),
      tabId: getJournalfoertDocumentTabId(doc.journalpostId, doc.dokumentInfoId),
      key: `${doc.journalpostId}:${doc.dokumentInfoId}`,
    };
  }

  if (doc.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
    return {
      inlineUrl: getAttachmentsOverviewInlineUrl(oppgaveId, doc.documentId),
      tabUrl: getAttachmentsOverviewTabUrl(oppgaveId, doc.documentId),
      tabId: getAttachmentsOverviewTabId(doc.documentId),
      key: `vedleggsoversikt:${doc.documentId}`,
    };
  }

  return {
    inlineUrl: getNewDocumentInlineUrl(oppgaveId, doc.documentId),
    tabUrl: getNewDocumentTabUrl(oppgaveId, doc.documentId, doc.parentId),
    tabId: getNewDocumentTabId(doc.documentId, doc.parentId),
    key: doc.documentId,
  };
};

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

const getDocumentTitle = (
  doc: IShownDocument,
  journalpostDocuments: IArkivertDocument[],
  documentsInProgress: IDocument[],
): string => {
  if (doc.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
    return 'Vedleggsoversikt';
  }

  if (doc.type === DocumentTypeEnum.SMART || doc.type === DocumentTypeEnum.UPLOADED) {
    const found = documentsInProgress.find((d) => d.id === doc.documentId);

    return found?.tittel ?? 'Ukjent dokument';
  }

  if (doc.type === DocumentTypeEnum.JOURNALFOERT) {
    return getArchivedDocumentTitle(doc, journalpostDocuments);
  }

  return 'Ukjent dokument';
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
