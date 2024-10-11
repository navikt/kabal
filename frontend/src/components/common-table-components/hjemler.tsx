import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import {
  type HjemmelNameAndId,
  useInnsendingshjemlerFromIds,
  useRegistreringshjemlerFromIds,
} from '@app/hooks/use-kodeverk-ids';
import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  hjemmelIdList: string[];
}

export const Innsendingshjemler = ({ hjemmelIdList }: Props) => {
  const hjemmelList = useInnsendingshjemlerFromIds(hjemmelIdList);

  return <HjemmelList hjemmelList={hjemmelList} />;
};

export const Registreringshjemler = ({ hjemmelIdList }: Props) => {
  const hjemmelList = useRegistreringshjemlerFromIds(hjemmelIdList ?? []);

  return <HjemmelList hjemmelList={hjemmelList} />;
};

interface HjemmelNamesProps {
  hjemmelList: HjemmelNameAndId[] | undefined;
}

const HjemmelList = ({ hjemmelList }: HjemmelNamesProps) =>
  hjemmelList === undefined ? (
    <LoadingCellContent />
  ) : (
    <Container>
      {hjemmelList.map(({ id, name }) => (
        <Tag variant="alt1" key={id}>
          {name}
        </Tag>
      ))}
    </Container>
  );

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;
