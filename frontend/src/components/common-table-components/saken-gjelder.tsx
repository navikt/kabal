import React from 'react';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { CopyFnrButton } from '@app/components/copy-button/copy-fnr-button';
import { useGetSakenGjelderQuery } from '@app/redux-api/oppgaver/queries/behandling';

interface Props {
  oppgaveId: string;
}

export const SakenGjelderName = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <LoadingCellContent />;
  }

  return data.name ?? 'Navn mangler';
};

export const SakenGjelderFnr = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <LoadingCellContent />;
  }

  return <CopyFnrButton fnr={data.id} />;
};
