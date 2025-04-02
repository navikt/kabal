import { Header, StyledDocumentTitle } from '@app/components/view-pdf/header';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { useShownDocumentMetadata } from '@app/components/view-pdf/use-shown-document-metadata';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useHandleTab } from '@app/hooks/use-handle-tab';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { ExternalLinkIcon, XMarkIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, type ButtonProps, Loader, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { NoFlickerReloadPdf, useNoFlickerReloadPdf } from './no-flicker-reload';
import { useMergedDocument } from './use-merged-document';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

export const ViewPDF = () => {
  const { value: pdfWidth = MIN_PDF_WIDTH, setValue: setPdfWidth } = useDocumentsPdfWidth();
  const { remove: close } = useDocumentsPdfViewed();
  const title = useShownDocuments();
  const { value } = useDocumentsPdfViewed();
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const oppgaveId = useOppgaveId();
  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(value.documents);
  const { inlineUrl, tabUrl, tabId } = useShownDocumentMetadata(oppgaveId, mergedDocument, value);
  const { onLoaded, onReload, setVersions, versions } = useNoFlickerReloadPdf(inlineUrl, setIsLoading);
  const handleTab = useHandleTab(tabUrl, tabId);

  useMarkVisited(tabUrl);

  useEffect(() => {
    setVersions([]);
    onReload();
  }, [onReload, setVersions]);

  const onNewTabClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (e.button !== 1 && e.button !== 0) {
      return;
    }

    e.preventDefault();

    handleTab();
  };

  if (value.documents.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (mergedDocumentIsError || inlineUrl === undefined) {
    return (
      <Container minWidth={pdfWidth}>
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </Container>
    );
  }

  if (mergedDocumentIsLoading) {
    return (
      <Container minWidth={pdfWidth}>
        <Loader title="Laster dokument" size="3xlarge" />
      </Container>
    );
  }

  return (
    <Container minWidth={pdfWidth}>
      <Header>
        <Button onClick={close} title="Lukk forhåndsvisning" icon={<XMarkIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={decrease} title="Smalere PDF" icon={<ZoomMinusIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={increase} title="Bredere PDF" icon={<ZoomPlusIcon aria-hidden />} {...BUTTON_PROPS} />
        <ReloadButton showDocumentList={value.documents} isLoading={isLoading} onClick={onReload} />
        <StyledDocumentTitle>{title ?? mergedDocument?.title ?? 'Ukjent dokument'}</StyledDocumentTitle>
        <Button
          as="a"
          href={tabUrl}
          target={tabId}
          title="Åpne i ny fane"
          icon={<ExternalLinkIcon aria-hidden />}
          onClick={onNewTabClick}
          onAuxClick={onNewTabClick}
          {...BUTTON_PROPS}
        />
      </Header>
      <NoFlickerReloadPdf versions={versions} isLoading={isLoading} onVersionLoaded={onLoaded} />
    </Container>
  );
};

const BUTTON_PROPS: ButtonProps = {
  size: 'xsmall',
  variant: 'tertiary-neutral',
};

interface ContainerProps {
  minWidth: number;
  children: React.ReactNode | React.ReactNode[];
}

const Container = ({ minWidth, children }: ContainerProps) => (
  <VStack
    asChild
    minWidth={`${minWidth}px`}
    className="snap-start"
    align="center"
    justify="center"
    data-testid="show-document"
  >
    <Box as="section" background="bg-default" shadow="medium" borderRadius="medium" position="relative" height="100%">
      {children}
    </Box>
  </VStack>
);
