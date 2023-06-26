import { ExternalLinkIcon, XMarkIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useShownDocument } from '@app/hooks/use-shown-document';
import { NoFlickerReloadPdf } from './no-flicker-reload';
import { useDocumentUrl } from './use-document-url';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

export const ViewPDF = () => {
  const { value: pdfWidth = MIN_PDF_WIDTH, setValue: setPdfWidth } = useDocumentsPdfWidth();
  const { remove: close } = useDocumentsPdfViewed();
  const { showDocumentList, title = 'Ukjent dokument' } = useShownDocument();

  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));

  const [version, setVersion] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oppgaveId = useOppgaveId();

  const { data: url, isError, isLoading: urlIsLoading, isUninitialized } = useDocumentUrl(oppgaveId, showDocumentList);

  if (showDocumentList.length === 0 || oppgaveId === skipToken || isUninitialized) {
    return null;
  }

  if (isError) {
    return (
      <ErrorOrLoadingContainer width={pdfWidth} data-testid="show-document">
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </ErrorOrLoadingContainer>
    );
  }

  if (urlIsLoading || typeof url === 'undefined') {
    return (
      <ErrorOrLoadingContainer width={pdfWidth} data-testid="show-document">
        <Loader title="Laster dokument" size="3xlarge" />
      </ErrorOrLoadingContainer>
    );
  }

  const onClick = () => {
    setIsLoading(true);
    setVersion(Date.now());
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

        <ReloadButton showDocumentList={showDocumentList} isLoading={isLoading} onClick={onClick} />

        <StyledDocumentTitle>{title}</StyledDocumentTitle>

        <Button
          as="a"
          href={url}
          target="_blank"
          title="Åpne i ny fane"
          rel="noreferrer"
          icon={<ExternalLinkIcon aria-hidden />}
          size="xsmall"
          variant="tertiary-neutral"
        />
      </Header>
      <NoFlickerReloadPdf
        url={url}
        version={version}
        name={title ?? undefined}
        onVersionLoaded={() => setIsLoading(false)}
      />
    </Container>
  );
};

interface ContainerProps {
  width: number;
}

const Container = styled.section<ContainerProps>`
  display: flex;
  flex-direction: column;
  min-width: ${(props) => props.width}px;
  margin: 4px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
  height: 100%;
  scroll-snap-align: start;
`;

const ErrorOrLoadingContainer = styled(Container)`
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  background: var(--a-green-100);
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 1;
  column-gap: 4px;
`;

const StyledDocumentTitle = styled.h1`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  padding-left: 8px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
