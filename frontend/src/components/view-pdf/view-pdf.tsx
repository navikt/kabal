import { canOpenInKabal } from '@app/components/documents/filetype';
import { TabContext } from '@app/components/documents/tab-context';
import { KabalPdfViewer } from '@app/components/kabal-pdf-viewer';
import type { PdfEntry } from '@app/components/pdf/pdf-document-viewer';
import { toast } from '@app/components/toast/store';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { Variant } from '@app/components/view-pdf/variant';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Skjerming, VariantFormat } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument, type JournalfoertDokument } from '@app/types/documents/documents';
import { Alert, Box, Loader, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useMemo, useState } from 'react';
import type { IShownArchivedDocument, IShownDocument } from './types';
import { type DocumentMetadata, useShownDocumentMetadata } from './use-shown-document-metadata';

export const ViewPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { remove: closePdfViewer } = useDocumentsPdfViewed();
  const { showDocumentList, isLoading } = useShownDocuments();
  const oppgaveId = useOppgaveId();

  const { data: documentsInProgress = EMPTY_DOCUMENTS } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);
  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED;

  const [redactedState, setRedactedState] = useState<Map<string, boolean>>(new Map());

  const setShowRedactedForDoc = useCallback((tabId: string, showRedacted: boolean) => {
    setRedactedState((prev) => {
      const next = new Map(prev);
      next.set(tabId, showRedacted);

      return next;
    });
  }, []);

  const expandedDocumentList = useMemo(
    () => expandDocumentList(showDocumentList, documentsInProgress),
    [showDocumentList, documentsInProgress],
  );

  const documentMetadataList = useShownDocumentMetadata(oppgaveId, expandedDocumentList);

  const tabUrls = useMemo(() => documentMetadataList.map((meta) => meta.tabUrl), [documentMetadataList]);

  useMarkVisited(tabUrls);

  const pdfs: PdfEntry[] = useMemo(
    () =>
      documentMetadataList.map((meta, index) => {
        const doc = expandedDocumentList[index];

        if (doc === undefined) {
          return createFallbackEntry(meta);
        }

        const title = getDocumentTitle(doc, journalpostDocuments, documentsInProgress);
        const isArchived = doc.type === DocumentTypeEnum.JOURNALFOERT;

        const docHasRedacted = isArchived && doc.varianter.some(({ format: f }) => f === VariantFormat.SLADDET);
        const docHasAccessToArchive =
          isArchived && doc.varianter.some(({ hasAccess, format: f }) => hasAccess && f === VariantFormat.ARKIV);

        const docShowRedacted = redactedState.get(meta.tabId) ?? docHasRedacted;
        const docFormat = docShowRedacted && docHasRedacted ? VariantFormat.SLADDET : VariantFormat.ARKIV;

        const showsPol =
          isArchived &&
          doc.varianter.some((v) => v.hasAccess && v.format === docFormat && v.skjerming === Skjerming.POL);

        const showsFeil =
          isArchived &&
          doc.varianter.some((v) => v.hasAccess && v.format === docFormat && v.skjerming === Skjerming.FEIL);

        const newTabUrl =
          isArchived && docHasRedacted && docHasAccessToArchive ? `${meta.tabUrl}?format=${docFormat}` : meta.tabUrl;

        const { tabId } = meta;

        return {
          title,
          url: meta.inlineUrl,
          newTab: {
            url: newTabUrl,
            id: tabId,
            onClick: createNewTabClickHandler(tabId, newTabUrl, getTabRef, setTabRef),
          },
          headerExtra: isArchived ? (
            <Variant
              showsArchivedDocument
              showsPol={showsPol}
              showsFeil={showsFeil}
              hasRedactedDocuments={docHasRedacted}
              hasAccessToArchivedDocuments={docHasAccessToArchive}
              showRedacted={docShowRedacted}
              setShowRedacted={(value: boolean) => setShowRedactedForDoc(tabId, value)}
            />
          ) : undefined,
        };
      }),
    [
      documentMetadataList,
      expandedDocumentList,
      journalpostDocuments,
      documentsInProgress,
      redactedState,
      setShowRedactedForDoc,
      getTabRef,
      setTabRef,
    ],
  );

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

  return <KabalPdfViewer pdfs={pdfs} onClose={closePdfViewer} />;
};

const EMPTY_DOCUMENTS: IDocument[] = [];
const EMPTY_ARCHIVED: IArkivertDocument[] = [];

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

const createFallbackEntry = (meta: DocumentMetadata): PdfEntry => ({
  title: 'Ukjent dokument',
  url: meta.inlineUrl,
  newTab: {
    url: meta.tabUrl,
    id: meta.tabId,
  },
});

const createNewTabClickHandler = (
  tabId: string,
  tabUrl: string,
  getTabRef: (id: string) => WindowProxy | undefined,
  setTabRef: (id: string, ref: WindowProxy) => void,
): React.MouseEventHandler<HTMLButtonElement> => {
  return (e) => {
    if (e.button !== 1 && e.button !== 0) {
      return;
    }

    e.preventDefault();

    const tabRef = getTabRef(tabId);

    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    const ref = window.open(tabUrl, tabId);

    if (ref === null) {
      toast.error('Kunne ikke åpne dokumentet i ny fane');

      return;
    }

    setTabRef(tabId, ref);
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
