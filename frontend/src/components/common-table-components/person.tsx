import { Loader } from '@navikt/ds-react';
import React from 'react';
import { CopyFnrButton } from '@app/components/copy-button/copy-fnr-button';
import { useGetSakenGjelderQuery } from '@app/redux-api/oppgaver/queries/behandling';

interface Props {
  oppgaveId: string;
}

const Loading = () => <Loader size="small" title="Laster..." />;

export const Name = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <Loading />;
  }

  return <>{data.name ?? 'Navn mangler'}</>;
};

export const Fnr = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <Loading />;
  }

  return <CopyFnrButton fnr={data.id} />;
};
