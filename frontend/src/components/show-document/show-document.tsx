import { skipToken } from '@reduxjs/toolkit/dist/query';
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
import { DocumentTypeEnum, IShownDocument } from './types';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oppgaveId = useOppgaveId();
  const { shownDocument } = useContext(ShownDocumentContext);

  if (shownDocument === null || oppgaveId === skipToken) {
    return null;
  }

  const url = getDocumentUrl(oppgaveId, shownDocument);
  const { title } = shownDocument;

  const onClick = () => {
    setIsLoading(true);
    setVersion(Date.now());
  };

  return (
    <Container width={pdfWidth} data-testid="show-document">
      <Header>
        <HeaderSubContainer>
          <StyledHeaderButton onClick={close} title="Lukk forhåndsvisning">
            <StyledCancelIcon title="Lukk forhåndsvisning" />
          </StyledHeaderButton>
          <StyledHeaderLink href={url} target="_blank" title="Åpne i ny fane" rel="noreferrer">
            <StyledExtLinkIcon title="Ekstern lenke" />
          </StyledHeaderLink>
          <StyledDocumentTitle>{title}</StyledDocumentTitle>
        </HeaderSubContainer>
        <HeaderSubContainer>
          <StyledHeaderButton onClick={decrease} title="Zoom ut på PDF">
            <StyledZoomOutIcon title="Zoom ut på PDF" />
          </StyledHeaderButton>
          <StyledHeaderButton onClick={increase} title="Zoom inn på PDF">
            <StyledZoomInIcon title="Zoom inn på PDF" />
          </StyledHeaderButton>
          <ReloadButton document={shownDocument} isLoading={isLoading} onClick={onClick} />
        </HeaderSubContainer>
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
  document: IShownDocument;
  isLoading: boolean;
  onClick: () => void;
}

const ReloadButton = ({ document, isLoading, onClick }: ReloadButtonProps) => {
  if (document.type !== DocumentTypeEnum.SMART) {
    return null;
  }

  return (
    <StyledHeaderButton onClick={onClick} title="Oppdater" disabled={isLoading}>
      <StyledRefreshIcon title="Oppdater" $isLoading={isLoading} />
    </StyledHeaderButton>
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
