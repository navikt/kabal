import { ExternalLinkIcon, XMarkIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { Container } from '@app/components/view-pdf/container';
import { Header, StyledDocumentTitle } from '@app/components/view-pdf/header';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import {
  getJournalfoertDocumentInlineUrl,
  getMergedDocumentInlineUrl,
  getNewDocumentInlineUrl,
} from '@app/domain/inline-document-url';
import {
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { NoFlickerReloadPdf } from './no-flicker-reload';
import { useMergedDocument } from './use-merged-document';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

export const ViewPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value: pdfWidth = MIN_PDF_WIDTH, setValue: setPdfWidth } = useDocumentsPdfWidth();
  const { remove: close } = useDocumentsPdfViewed();
  const { showDocumentList, title } = useShownDocuments();

  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));

  const [version, setVersion] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oppgaveId = useOppgaveId();

  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(showDocumentList);

  type DocumentData =
    | { inlineUrl: string; tabUrl: string; documentId: string }
    | { inlineUrl: undefined; tabUrl: undefined; documentId: undefined };

  const { inlineUrl, tabUrl, documentId } = useMemo<DocumentData>(() => {
    if (mergedDocument !== undefined) {
      return {
        tabUrl: getMergedDocumentTabUrl(mergedDocument.reference),
        inlineUrl: getMergedDocumentInlineUrl(mergedDocument.reference),
        documentId: getMergedDocumentTabId(mergedDocument.reference),
      };
    }

    const [onlyDocument] = showDocumentList;

    if (onlyDocument === undefined || oppgaveId === skipToken) {
      return { tabUrl: undefined, inlineUrl: undefined, documentId: undefined };
    }

    if (onlyDocument.type === DocumentTypeEnum.JOURNALFOERT) {
      return {
        tabUrl: getJournalfoertDocumentTabUrl(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
        inlineUrl: getJournalfoertDocumentInlineUrl(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
        documentId: getJournalfoertDocumentTabId(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
      };
    }

    return {
      tabUrl: getNewDocumentTabUrl(oppgaveId, onlyDocument.documentId),
      inlineUrl: getNewDocumentInlineUrl(oppgaveId, onlyDocument.documentId),
      documentId: getNewDocumentTabId(onlyDocument.documentId),
    };
  }, [mergedDocument, oppgaveId, showDocumentList]);

  useMarkVisited(tabUrl);

  const isTabOpen = useIsTabOpen(documentId);

  if (showDocumentList.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (mergedDocumentIsError || inlineUrl === undefined) {
    return (
      <ErrorOrLoadingContainer width={pdfWidth} data-testid="show-document">
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </ErrorOrLoadingContainer>
    );
  }

  if (mergedDocumentIsLoading) {
    return (
      <ErrorOrLoadingContainer width={pdfWidth} data-testid="show-document">
        <Loader title="Laster dokument" size="3xlarge" />
      </ErrorOrLoadingContainer>
    );
  }

  const onReloadClick = () => {
    setIsLoading(true);
    setVersion(Date.now());
  };

  const onNewTabClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (e.button !== 1 && e.button !== 0) {
      return;
    }

    e.preventDefault();

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

    const ref = window.open(tabUrl, documentId);

    if (ref === null) {
      toast.error('Kunne ikke åpne dokumentet i ny fane');

      return;
    }
    setTabRef(documentId, ref);
  };

  return (
    <Container width={pdfWidth} data-testid="show-document">
      <Header>
        <Button
          onClick={close}
          title="Lukk forhåndsvisning"
          icon={<XMarkIcon aria-hidden />}
          size="xsmall"
          variant="tertiary-neutral"
        />

        <Button
          onClick={decrease}
          title="Smalere PDF"
          icon={<ZoomMinusIcon aria-hidden />}
          size="xsmall"
          variant="tertiary-neutral"
        />

        <Button
          onClick={increase}
          title="Bredere PDF"
          icon={<ZoomPlusIcon aria-hidden />}
          size="xsmall"
          variant="tertiary-neutral"
        />

        <ReloadButton showDocumentList={showDocumentList} isLoading={isLoading} onClick={onReloadClick} />

        <StyledDocumentTitle>{title ?? mergedDocument?.title ?? 'Ukjent dokument'}</StyledDocumentTitle>

        <Button
          as="a"
          href={tabUrl}
          target={documentId}
          title="Åpne i ny fane"
          icon={<ExternalLinkIcon aria-hidden />}
          size="xsmall"
          variant="tertiary-neutral"
          onClick={onNewTabClick}
          onAuxClick={onNewTabClick}
        />
      </Header>
      <NoFlickerReloadPdf url={inlineUrl} version={version} onVersionLoaded={() => setIsLoading(false)} />
    </Container>
  );
};

const ErrorOrLoadingContainer = styled(Container)`
  align-items: center;
  justify-content: center;
`;
