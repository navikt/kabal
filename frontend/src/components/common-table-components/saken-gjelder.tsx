import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { useGetSakenGjelderQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Tooltip } from '@navikt/ds-react';

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
    <Tooltip content={name}>
      <span className="inline-block min-w-full max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
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
