import { skipToken } from '@reduxjs/toolkit/query';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

interface Props {
  navIdent: string | null;
}

export const Name = ({ navIdent }: Props) => {
  const { data: signature, isLoading: signatureIsLoading } = useGetSignatureQuery(navIdent ?? skipToken);

  if (navIdent === null) {
    return null;
  }

  if (signatureIsLoading) {
    return <LoadingCellContent />;
  }

  return signature?.customLongName ?? signature?.longName ?? 'Ukjent';
};
