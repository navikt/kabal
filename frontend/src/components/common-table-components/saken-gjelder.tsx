import { Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { useGetSakenGjelderQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';

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
      <Name>{name}</Name>
    </Tooltip>
  );
};

const Name = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 20em;
  min-width: 100%;
`;

export const SakenGjelderFnr = ({ oppgaveId }: Props) => {
  const { data, isLoading } = useGetSakenGjelderQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return <LoadingCellContent />;
  }

  return <CopyIdButton id={data.id} />;
};
