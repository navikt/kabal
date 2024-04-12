import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useInnsendingshjemlerFromIds, useRegistreringshjemlerFromIds } from '@app/hooks/use-kodeverk-ids';

interface Props {
  hjemmelIdList: string[];
}

export const Innsendingshjemler = ({ hjemmelIdList }: Props) => {
  const hjemmelNames = useInnsendingshjemlerFromIds(hjemmelIdList);

  return <HjemmelNames hjemmelNames={hjemmelNames} />;
};

export const Registreringshjemler = ({ hjemmelIdList }: Props) => {
  const hjemmelNames = useRegistreringshjemlerFromIds(hjemmelIdList ?? []);

  return <HjemmelNames hjemmelNames={hjemmelNames} />;
};

interface HjemmelNamesProps {
  hjemmelNames: string[] | undefined;
}

const HjemmelNames = ({ hjemmelNames }: HjemmelNamesProps) =>
  hjemmelNames === undefined ? (
    <LoadingCellContent />
  ) : (
    <Container>
      {hjemmelNames.map((hjemmelName, index) => (
        <Tag variant="alt1" key={index}>
          {hjemmelName}
        </Tag>
      ))}
    </Container>
  );

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;
