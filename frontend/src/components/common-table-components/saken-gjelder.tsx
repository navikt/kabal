import { Tooltip } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { CopyIdButton } from '@/components/copy-button/copy-id-button';
import { useGetSakenGjelderQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';

interface Props {
  oppgaveId: string;
}

export const SakenGjelderName = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <LoadingCellContent />;
  }

  const name = data.name ?? 'Navn mangler';

  return (
    <Tooltip content={name} delay={500}>
      <span className="inline-block min-w-full max-w-20 truncate text-ax-medium">{name}</span>
    </Tooltip>
  );
};

export const SakenGjelderFnr = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <LoadingCellContent />;
  }

  return <CopyIdButton id={data.identifikator} />;
};
