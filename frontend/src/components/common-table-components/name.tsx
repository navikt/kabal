import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

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

  const name = signature?.customLongName ?? signature?.longName ?? 'Ukjent';

  return (
    <Tooltip content={name}>
      <span className="truncate">{name}</span>
    </Tooltip>
  );
};
