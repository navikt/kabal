import React from 'react';
import styled from 'styled-components';
import { ChevronIcon } from '../../icons/chevron';
import { DokumenterNav, DokumenterTittel } from './styled-components/header';
import { UploadFileButton } from './upload-file-button';

interface HeaderProps {
  settFullvisning: (fullvisning: boolean) => void;
  fullvisning: boolean;
  antall: number;
}

export const Header = React.memo<HeaderProps>(
  ({ fullvisning, settFullvisning, antall }) => (
    <DokumenterNav>
      <DokumenterTittel>Dokumenter</DokumenterTittel>
      <UploadFileButton show={fullvisning} />
      <VisTilknyttedeKnapp
        onClick={() => settFullvisning(!fullvisning)}
        data-testid="klagebehandling-documents-toggle-view-button"
      >
        <StyledChevronIcon alt={`${getText(fullvisning)} (${antall})`} open={fullvisning} />
      </VisTilknyttedeKnapp>
    </DokumenterNav>
  ),
  (previous, next) => previous.fullvisning === next.fullvisning && previous.antall === next.antall
);

Header.displayName = 'Header';

const getText = (fullvisning: boolean) => (fullvisning ? 'Vis kun tilknyttede' : 'Se alle dokumenter');

const VisTilknyttedeKnapp = styled.button`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: 32px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  margin-left: 32px;
`;

interface StyledChevronIcon {
  open: boolean;
}

const StyledChevronIcon = styled(ChevronIcon)<StyledChevronIcon>`
  will-change: transform;
  transition: 100ms ease-in-out transform;
  transform: ${({ open }) => (open ? 'rotate(0deg)' : 'rotate(180deg)')};
`;
