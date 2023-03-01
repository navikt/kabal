import React from 'react';

interface PageInfoProps {
  total: number;
  fromNumber: number;
  toNumber: number;
}

export const PageInfo = ({ total, fromNumber, toNumber }: PageInfoProps): JSX.Element | null => {
  if (total === 0) {
    return null;
  }

  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} oppgaver`}</span>;
};
