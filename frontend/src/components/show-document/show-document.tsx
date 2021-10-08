import React, { useEffect, useState } from 'react';
import {
  Container,
  Header,
  PDF,
  StyledButtonContainer,
  StyledCancelIcon,
  StyledDocumentTitle,
  StyledExtLinkIcon,
  StyledHeaderButton,
  StyledHeaderLink,
  StyledZoomInIcon,
  StyledZoomOutIcon,
} from './styled-components';
import { IShownDokument } from './types';

const MIN_PDF_WIDTH = 760;
const MAX_PDF_WIDTH = 1960;
const ZOOM_STEP = 150;

interface ShowDokumentProps {
  document: IShownDokument | null;
  close: () => void;
}

const PDF_WITH_LOCAL_STORAGE_KEY = 'documentWidth';

export const ShowDocument = ({ document, close }: ShowDokumentProps) => {
  const [pdfWidth, setPdfWidth] = useState<number>(getSavedPdfWidth);
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));

  useEffect(() => localStorage.setItem(PDF_WITH_LOCAL_STORAGE_KEY, pdfWidth.toString()), [pdfWidth]);

  if (document === null) {
    return null;
  }

  const { title, url } = document;

  return (
    <Container width={pdfWidth}>
      <Header>
        <StyledDocumentTitle>{title}</StyledDocumentTitle>
        <StyledButtonContainer>
          <HeaderButton onClick={decrease} text="Zoom ut på PDF">
            <StyledZoomOutIcon alt="Zoom ut på PDF" />
          </HeaderButton>
          <HeaderButton onClick={increase} text="Zoom inn på PDF">
            <StyledZoomInIcon alt="Zoom inn på PDF" />
          </HeaderButton>
          <StyledHeaderLink href={url} target={'_blank'} title="Åpne i ny fane" rel="noreferrer">
            <StyledExtLinkIcon alt="Ekstern lenke" />
          </StyledHeaderLink>
          <HeaderButton onClick={close} text="Lukk forhåndsvisning">
            <StyledCancelIcon alt="Lukk forhåndsvisning" />
          </HeaderButton>
        </StyledButtonContainer>
      </Header>
      <PDF
        data={`${url}#toolbar=0&view=fitH&zoom=page-width`}
        role="document"
        type="application/pdf"
        name={title ?? undefined}
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

interface HeaderButtonProps {
  text: string;
  onClick: () => void;
  children: React.ReactNode;
}

const HeaderButton = ({ text, onClick, children }: HeaderButtonProps): JSX.Element => (
  <StyledHeaderButton onClick={onClick} title={text}>
    {children}
  </StyledHeaderButton>
);
