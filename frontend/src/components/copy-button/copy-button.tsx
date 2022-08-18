import { CopyToClipboard } from '@navikt/ds-react-internal';
import React from 'react';

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
    <CopyToClipboard
      className={className}
      popoverText="Kopiert!"
      copyText={text}
      iconPosition="right"
      title={title}
      size="small"
    >
      {children}
    </CopyToClipboard>
  );
};
