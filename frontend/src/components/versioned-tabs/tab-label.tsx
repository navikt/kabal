import { Tag } from '@navikt/ds-react';
import React from 'react';

interface TabLabelProps {
  isDraft: boolean;
  isPublished: boolean;
  children: string | number;
}

export const TabLabel = ({ isDraft, isPublished, children }: TabLabelProps) => {
  if (isPublished) {
    return (
      <>
        <Tag size="xsmall" variant="info">
          Aktiv
        </Tag>{' '}
        Versjon {children}
      </>
    );
  }

  if (isDraft) {
    return (
      <>
        <Tag size="xsmall" variant="warning">
          Utkast
        </Tag>{' '}
        Versjon {children}
      </>
    );
  }

  return (
    <>
      <Tag size="xsmall" variant="neutral">
        Inaktiv
      </Tag>{' '}
      Versjon {children}
    </>
  );
};
