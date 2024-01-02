import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useInnsendingshjemlerFromIds } from '@app/hooks/use-kodeverk-ids';

interface Props {
  hjemmelIdList: string[];
}

export const Hjemler = ({ hjemmelIdList }: Props) => {
  if (hjemmelIdList === null) {
    return null;
  }

  return <ResolvedHjemler hjemmelIdList={hjemmelIdList} />;
};

interface ResolvedProps {
  hjemmelIdList: string[];
}

const ResolvedHjemler = ({ hjemmelIdList }: ResolvedProps) => {
  const hjemmelNames = useInnsendingshjemlerFromIds(hjemmelIdList);

  if (hjemmelNames === undefined) {
    return <LoadingCellContent />;
  }

  return (
    <Container>
      {hjemmelNames.map((hjemmelName, index) => (
        <Tag variant="alt1" key={index}>
          {hjemmelName}
        </Tag>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;
