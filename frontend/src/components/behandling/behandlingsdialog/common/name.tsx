import { Skeleton } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

interface Props {
  navIdent: string;
}

export const Name = ({ navIdent }: Props) => {
  const { data, isLoading } = useGetSignatureQuery(navIdent ?? skipToken);

  if (isLoading) {
    return <Skeleton variant="text" width={100} as="span" style={{ display: 'inline-block' }} />;
  }

  const name = data?.customLongName ?? data?.longName ?? navIdent;

  return name;
};
