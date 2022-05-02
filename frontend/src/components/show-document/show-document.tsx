import React, { useContext, useEffect, useState } from 'react';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { ShownDocumentContext } from '../documents/context';
import { getDocumentUrl } from './document-url';
import { NoFlickerReloadPdf } from './no-flicker-reload';
import {
  Container,
  Header,
  HeaderSubContainer,
  StyledCancelIcon,
  StyledDocumentTitle,
  StyledExtLinkIcon,
  StyledHeaderButton,
  StyledHeaderLink,
  StyledRefreshIcon,
  StyledZoomInIcon,
  StyledZoomOutIcon,
} from './styled-components';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

interface ShowDokumentProps {
  close: () => void;
}

const PDF_WITH_LOCAL_STORAGE_KEY = 'documentWidth';

export const ShowDocument = ({ close }: ShowDokumentProps) => {
  const [pdfWidth, setPdfWidth] = useState<number>(getSavedPdfWidth);
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));

  useEffect(() => localStorage.setItem(PDF_WITH_LOCAL_STORAGE_KEY, pdfWidth.toString()), [pdfWidth]);

  const [version, setVersion] = useState<number>(Date.now());
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const oppgaveId = useOppgaveId();
  const { shownDocument } = useContext(ShownDocumentContext);

  if (shownDocument === null) {
    return null;
  }

  const url = getDocumentUrl(oppgaveId, shownDocument);
  const { title } = shownDocument;

  return (
    <Container width={pdfWidth} data-testid="show-document">
      <Header>
        <HeaderSubContainer>
          <StyledHeaderButton onClick={decrease} title="Zoom ut på PDF">
            <StyledZoomOutIcon title="Zoom ut på PDF" />
          </StyledHeaderButton>
          <StyledHeaderButton onClick={increase} title="Zoom inn på PDF">
            <StyledZoomInIcon title="Zoom inn på PDF" />
          </StyledHeaderButton>
          <StyledHeaderLink href={url} target="_blank" title="Åpne i ny fane" rel="noreferrer">
            <StyledExtLinkIcon title="Ekstern lenke" />
          </StyledHeaderLink>
          <StyledDocumentTitle>{title}</StyledDocumentTitle>
          <StyledHeaderButton
            onClick={() => {
              setIsLoaded(false);
              setVersion(Date.now());
            }}
            title="Oppdater"
          >
            <StyledRefreshIcon title="Oppdater" $isLoading={!isLoaded} />
          </StyledHeaderButton>
        </HeaderSubContainer>
        <HeaderSubContainer>
          <StyledHeaderButton onClick={close} title="Lukk forhåndsvisning">
            <StyledCancelIcon title="Lukk forhåndsvisning" />
          </StyledHeaderButton>
        </HeaderSubContainer>
      </Header>
      <NoFlickerReloadPdf
        url={url}
        version={version}
        name={title ?? undefined}
        onVersionLoaded={() => setIsLoaded(true)}
      />
    </Container>
  );
};

const getSavedPdfWidth = () => {
  const localStorageValue = localStorage.getItem(PDF_WITH_LOCAL_STORAGE_KEY);

  if (localStorageValue === null) {
    return MIN_PDF_WIDTH;
  }

  const parsed = Number.parseInt(localStorageValue, 10);
  return Number.isNaN(parsed) ? MIN_PDF_WIDTH : parsed;
};
