import { TabContext } from '@app/components/documents/tab-context';
import { Pdf } from '@app/components/pdf/pdf';
import { usePdfData } from '@app/components/pdf/use-pdf-data';
import { toast } from '@app/components/toast/store';
import { Header } from '@app/components/view-pdf/header';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { useShownDocumentMetadata } from '@app/components/view-pdf/use-shown-document-metadata';
import { Variant } from '@app/components/view-pdf/variant';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { Skjerming, VariantFormat } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ExternalLinkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, Loader, Tooltip, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMergedDocument } from './use-merged-document';

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
  const formatQuery = useMemo(() => ({ format }), [format]);
  const { loading, data, refresh, error } = usePdfData(inlineUrl, formatQuery);

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

  return (
    <Container>
      <Header>
        <HStack wrap={false} justify="start" align="center">
          <Button
            onClick={closePdfViewer}
            title="Lukk forhåndsvisning"
            icon={<XMarkIcon aria-hidden />}
            size="xsmall"
            variant="tertiary"
            data-color="neutral"
          />

          <ReloadButton isLoading={loading} onClick={refresh} />

          <h1 className="truncate pl-1 font-ax-bold text-base">
            {title ?? mergedDocument?.title ?? 'Ukjent dokument'}
          </h1>

          <Tooltip content="Åpne dokument i ny fane" describesChild>
            <Button
              as="a"
              href={
                showsArchivedDocument && hasRedactedDocuments && hasAccessToArchivedDocuments
                  ? `${tabUrl}?format=${format}`
                  : tabUrl
              }
              target={tabId}
              icon={<ExternalLinkIcon aria-hidden />}
              onClick={onNewTabClick}
              onAuxClick={onNewTabClick}
              size="xsmall"
              variant="tertiary"
              data-color="neutral"
            />
          </Tooltip>
        </HStack>

        <Variant
          showsArchivedDocument={showsArchivedDocument}
          showsPol={showsPol}
          showsFeil={showsFeil}
          hasRedactedDocuments={hasRedactedDocuments}
          hasAccessToArchivedDocuments={hasAccessToArchivedDocuments}
          showRedacted={showRedacted}
          setShowRedacted={setShowRedacted}
        />
      </Header>
      <Pdf data={data} loading={loading} error={error} refresh={refresh} />
    </Container>
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
