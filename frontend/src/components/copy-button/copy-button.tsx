import { CopyToClipboard } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  text?: string | null;
  title?: string;
  className?: string;
}

export const CopyButton = ({ children, text, title = 'Klikk for å kopiere', className }: Props) => {
  if (text === null || typeof text === 'undefined' || text.length === 0) {
    return null;
  }

  return (
    <StyledCopyButton className={className} popoverText="Kopiert!" copyText={text} iconPlacement="right" title={title}>
      {children}
    </StyledCopyButton>
  );
};

const StyledCopyButton = styled(CopyToClipboard)`
  &.navds-button__inner,
  &.navds-button svg {
    font-size: 16px;
  }
`;
