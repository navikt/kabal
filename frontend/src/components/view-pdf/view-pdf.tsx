import { TabContext } from '@app/components/documents/tab-context';
import { PdfDocumentViewer } from '@app/components/pdf/pdf-document-viewer';
import { toast } from '@app/components/toast/store';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { Skjerming, VariantFormat } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { Alert, Box, Loader, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useMergedDocument } from './use-merged-document';
import { useShownDocumentMetadata } from './use-shown-document-metadata';

export const ViewPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { remove: closePdfViewer } = useDocumentsPdfViewed();
  const { showDocumentList, title, isLoading } = useShownDocuments();
  const oppgaveId = useOppgaveId();
  const showsArchivedDocument = showDocumentList.some((doc) => doc.type === DocumentTypeEnum.JOURNALFOERT);
  const hasRedactedDocuments = showDocumentList.some(
    (doc) =>
      doc.type === DocumentTypeEnum.JOURNALFOERT &&
      doc.varianter.some(({ format }) => format === VariantFormat.SLADDET),
  );
  const hasAccessToArchivedDocuments = showDocumentList.some(
    (doc) =>
      doc.type === DocumentTypeEnum.JOURNALFOERT &&
      doc.varianter.some(({ hasAccess, format }) => hasAccess && format === VariantFormat.ARKIV),
  );
  const [showRedacted, setShowRedacted] = useState(hasRedactedDocuments);

  useEffect(() => {
    if (hasRedactedDocuments) {
      setShowRedacted(true);
    }
  }, [hasRedactedDocuments]);

  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(showDocumentList);
  const { inlineUrl, tabUrl, tabId } = useShownDocumentMetadata(oppgaveId, mergedDocument, showDocumentList);
  const format = showRedacted && hasRedactedDocuments ? VariantFormat.SLADDET : VariantFormat.ARKIV;

  useMarkVisited(tabUrl);

  const onNewTabClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      if (e.button !== 1 && e.button !== 0) {
        return;
      }

      e.preventDefault();

      if (tabId === undefined) {
        return;
      }

      const tabRef = getTabRef(tabId);

      // There is a reference to the tab and it is open.
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
    },
    [getTabRef, setTabRef, tabId, tabUrl],
  );

  if (showDocumentList.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (mergedDocumentIsError || inlineUrl === undefined) {
    return (
      <Container>
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </Container>
    );
  }

  if (mergedDocumentIsLoading || isLoading) {
    return (
      <Container>
        <Loader title="Laster dokument" size="3xlarge" />
      </Container>
    );
  }

  const showsPol = showDocumentList.some(
    (d) =>
      d.type === DocumentTypeEnum.JOURNALFOERT &&
      d.varianter.some((v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.POL),
  );

  const showsFeil = showDocumentList.some(
    (d) =>
      d.type === DocumentTypeEnum.JOURNALFOERT &&
      d.varianter.some((v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.FEIL),
  );

  const heading = title ?? mergedDocument?.title ?? 'Ukjent dokument';

  const newTabUrl =
    showsArchivedDocument && hasRedactedDocuments && hasAccessToArchivedDocuments
      ? `${tabUrl}?format=${format}`
      : tabUrl;

  return (
    <PdfDocumentViewer
      url={inlineUrl}
      onClose={closePdfViewer}
      title={heading}
      newTab={
        tabUrl !== undefined && tabId !== undefined
          ? {
              url: newTabUrl,
              id: tabId,
              onClick: onNewTabClick,
            }
          : undefined
      }
      variant={{
        showsArchivedDocument,
        showsPol,
        showsFeil,
        hasRedactedDocuments,
        hasAccessToArchivedDocuments,
        showRedacted,
        setShowRedacted,
      }}
    />
  );
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
