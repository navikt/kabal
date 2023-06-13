import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useShownDocument } from '@app/hooks/use-shown-document';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { NoFlickerReloadPdf } from './no-flicker-reload';
import {
  Container,
  Ellipsis,
  ErrorOrLoadingContainer,
  Header,
  StyledCancelIcon,
  StyledDocumentTitle,
  StyledExtLinkIcon,
  StyledHeaderButton,
  StyledHeaderLink,
  StyledRefreshIcon,
  StyledZoomInIcon,
  StyledZoomOutIcon,
} from './styled-components';
import { IShownDocument } from './types';
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
        <StyledHeaderButton onClick={close} title="Lukk forhåndsvisning">
          <StyledCancelIcon title="Lukk forhåndsvisning" />
        </StyledHeaderButton>
        <StyledHeaderLink href={url} target="_blank" title="Åpne i ny fane" rel="noreferrer">
          <StyledExtLinkIcon title="Ekstern lenke" />
        </StyledHeaderLink>
        <StyledHeaderButton onClick={decrease} title="Zoom ut på PDF">
          <StyledZoomOutIcon title="Zoom ut på PDF" />
        </StyledHeaderButton>
        <StyledHeaderButton onClick={increase} title="Zoom inn på PDF">
          <StyledZoomInIcon title="Zoom inn på PDF" />
        </StyledHeaderButton>
        <ReloadButton showDocumentList={showDocumentList} isLoading={isLoading} onClick={onClick} />
        <StyledDocumentTitle>
          <Ellipsis>{title}</Ellipsis>
        </StyledDocumentTitle>
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

interface ReloadButtonProps {
  showDocumentList: IShownDocument[];
  isLoading: boolean;
  onClick: () => void;
}

const ReloadButton = ({ showDocumentList, isLoading, onClick }: ReloadButtonProps) => {
  if (!showDocumentList.some((v) => v.type === DocumentTypeEnum.SMART)) {
    return null;
  }

  return (
    <StyledHeaderButton onClick={onClick} title="Oppdater" disabled={isLoading}>
      <StyledRefreshIcon title="Oppdater" $isLoading={isLoading} />
    </StyledHeaderButton>
  );
};
