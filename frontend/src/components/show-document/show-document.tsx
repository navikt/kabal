import React, { useEffect, useMemo, useState } from 'react';
import {
  Beholder,
  Header,
  PDF,
  StyledCancelIcon,
  StyledExtLinkIcon,
  StyledHeaderButton,
  StyledZoomInIcon,
  StyledZoomOutIcon,
} from './styled-components';
import { IShownDokument } from './types';

const MIN_PDF_WIDTH = 760;
const MAX_PDF_WIDTH = 1960;
const ZOOM_STEP = 150;

interface ShowDokumentProps {
  klagebehandlingId: string;
  dokument: IShownDokument | null;
  close: () => void;
}

export const ShowDokument = ({ klagebehandlingId, dokument, close }: ShowDokumentProps) => {
  const url = useMemo(
    () =>
      `/api/klagebehandlinger/${klagebehandlingId}/journalposter/${dokument?.journalpostId}/dokumenter/${dokument?.dokumentInfoId}`,
    [dokument, klagebehandlingId]
  );

  const [pdfWidth, setPdfWidth] = useState<number>(getSavedPdfWidth);
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));

  useEffect(() => localStorage.setItem('valgtBreddeForhandsvisning', pdfWidth.toString()), [pdfWidth]);

  if (dokument === null) {
    return null;
  }

  return (
    <Beholder width={pdfWidth}>
      <Header>
        {dokument.tittel}
        <div>
          <HeaderButton onClick={decrease} text="Zoom ut på PDF">
            <StyledZoomOutIcon alt="Zoom ut på PDF" />
          </HeaderButton>
          <HeaderButton onClick={increase} text="Zoom inn på PDF">
            <StyledZoomInIcon alt="Zoom inn på PDF" />
          </HeaderButton>
          <a href={url} target={'_blank'} title="Åpne i ny fane" rel="noreferrer">
            <StyledExtLinkIcon alt="Ekstern lenke" />
          </a>
          <HeaderButton onClick={close} text="Lukk forhåndsvisning">
            <StyledCancelIcon alt="Lukk forhåndsvisning" />
          </HeaderButton>
        </div>
      </Header>
      <PDF
        data={`${url}#toolbar=0&view=fitH&zoom=page-width`}
        role="document"
        type="application/pdf"
        name={dokument.tittel ?? undefined}
      />
    </Beholder>
  );
};

const getSavedPdfWidth = () => {
  const localStorageVerdi = localStorage.getItem('valgtBreddeForhandsvisning');
  if (localStorageVerdi === null) {
    return MIN_PDF_WIDTH;
  }
  const parsed = Number.parseInt(localStorageVerdi, 10);
  return Number.isNaN(parsed) ? MIN_PDF_WIDTH : parsed;
};

interface HeaderButtonProps {
  text: string;
  onClick: () => void;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ text, onClick, children }) => (
  <StyledHeaderButton onClick={onClick} title={text}>
    {children}
  </StyledHeaderButton>
);
