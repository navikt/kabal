import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

interface Props {
  navIdent: string | null;
}

export const Name = ({ navIdent }: Props) => {
  const { data: signature, isLoading: signatureIsLoading } = useGetSignatureQuery(navIdent ?? skipToken);

  if (signatureIsLoading) {
    return <LoadingCellContent />;
  }

  const name = signature?.customLongName ?? signature?.longName ?? 'Ukjent';

  return name;
};
