import { ExternalLinkIcon, XMarkIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, ButtonProps, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { Container, ErrorOrLoadingContainer } from '@app/components/view-pdf/container';
import { Header, StyledDocumentTitle } from '@app/components/view-pdf/header';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { useShownDocumentMetadata } from '@app/components/view-pdf/use-shown-document-metadata';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { NoFlickerReloadPdf, Version } from './no-flicker-reload';
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
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const oppgaveId = useOppgaveId();
  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(showDocumentList);
  const { inlineUrl, tabUrl, tabId } = useShownDocumentMetadata(oppgaveId, mergedDocument, showDocumentList);
  const isTabOpen = useIsTabOpen(tabId);

  useMarkVisited(tabUrl);

  const onLoaded = useCallback((versionId: number) => {
    setVersions((versionList) => {
      const _versions: Version[] = [];

      for (const version of versionList) {
        if (version.id === versionId) {
          _versions.push({ ...version, ready: true });
        } else if (!version.ready) {
          _versions.push(version);
        }
      }

      return _versions;
    });

    setIsLoading(false);
  }, []);

  const load = useCallback(async (url: string | undefined) => {
    if (url === undefined) {
      return;
    }

    setIsLoading(true);

    setVersions((v) => {
      const lastReady = v.findLast((e) => e.ready);
      const newData: Version = { url, ready: false, id: Date.now() };

      if (lastReady !== undefined) {
        return [lastReady, newData];
      }

      return [newData];
    });
  }, []);

  const onReloadClick = useCallback(() => load(inlineUrl), [inlineUrl, load]);

  useEffect(() => {
    setVersions([]);
    onReloadClick();
  }, [onReloadClick]);

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

      if (isTabOpen) {
        toast.warning('Dokumentet er allerede åpent i en annen fane');

        return;
      }

      const ref = window.open(tabUrl, tabId);

      if (ref === null) {
        toast.error('Kunne ikke åpne dokumentet i ny fane');

        return;
      }
      setTabRef(tabId, ref);
    },
    [getTabRef, isTabOpen, setTabRef, tabId, tabUrl],
  );

  if (showDocumentList.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (mergedDocumentIsError || inlineUrl === undefined) {
    return (
      <ErrorOrLoadingContainer style={{ minWidth: pdfWidth }} data-testid="show-document">
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </ErrorOrLoadingContainer>
    );
  }

  if (mergedDocumentIsLoading) {
    return (
      <ErrorOrLoadingContainer style={{ minWidth: pdfWidth }} data-testid="show-document">
        <Loader title="Laster dokument" size="3xlarge" />
      </ErrorOrLoadingContainer>
    );
  }

  return (
    <Container style={{ minWidth: pdfWidth }} data-testid="show-document">
      <Header>
        <Button onClick={close} title="Lukk forhåndsvisning" icon={<XMarkIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={decrease} title="Smalere PDF" icon={<ZoomMinusIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={increase} title="Bredere PDF" icon={<ZoomPlusIcon aria-hidden />} {...BUTTON_PROPS} />
        <ReloadButton showDocumentList={showDocumentList} isLoading={isLoading} onClick={onReloadClick} />
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
