import { FilesIcon } from '@navikt/aksel-icons';
import { CopyButton as InternalCopyBytton } from '@navikt/ds-react';
import React from 'react';

interface Props {
  children?: string;
  text?: string | null;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const CopyButton = ({
  children,
  text,
  title = 'Klikk for å kopiere',
  className,
  icon = <FilesIcon aria-hidden />,
}: Props) => {
  if (text === null || typeof text === 'undefined' || text.length === 0) {
    return null;
  }

  return (
    <InternalCopyBytton
      className={className}
      activeText="Kopiert!"
      copyText={text}
      title={title}
      size="small"
      text={children}
      icon={icon}
    />
  );
};
