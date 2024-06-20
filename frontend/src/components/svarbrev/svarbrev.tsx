import { Heading, Search, Table } from '@navikt/ds-react';
import { ReactNode, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { Row } from '@app/components/svarbrev/row';
import { SkeletonBody } from '@app/components/svarbrev/skeleton';
import { useGetSvarbrevSettingsQuery } from '@app/redux-api/svarbrev';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { SvarbrevSetting } from '@app/types/svarbrev';

const TableHeaders = () => (
  <StyledTableHeader>
    <Table.Row>
      <Table.HeaderCell>Aktiv</Table.HeaderCell>
      <Table.HeaderCell>Ytelse</Table.HeaderCell>
      <Table.HeaderCell>Saksbehandlingstid (uker)</Table.HeaderCell>
      <Table.HeaderCell style={{ width: '100%' }}>Tekst til svarbrev (valgfri)</Table.HeaderCell>
      <Table.HeaderCell>Sist endret</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </StyledTableHeader>
);

interface ContainerProps {
  children: ReactNode;
  filter: string;
  setFilter: (filter: string) => void;
}

const Container = ({ children, filter, setFilter }: ContainerProps) => (
  <StyledContainer>
    <Heading level="1" size="medium">
      Svarbrev
    </Heading>

    <Search
      placeholder="Filtrer på ytelse"
      label="Filtrer på ytelse"
      size="small"
      hideLabel
      onChange={setFilter}
      value={filter}
    />

    <StyledTable size="small" zebraStripes>
      <TableHeaders />
      {children}
    </StyledTable>
  </StyledContainer>
);

interface ScoredSvarbrevSetting extends SvarbrevSetting {
  score: number;
}

export const Svarbrev = () => {
  const { data: settings = [], isLoading } = useGetSvarbrevSettingsQuery();
  const { data: ytelser = [] } = useYtelserAll();
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (filter.length === 0) {
      return settings;
    }

    const scored: ScoredSvarbrevSetting[] = [];

    for (const s of settings) {
      const ytelseName = ytelser.find(({ id }) => id === s.ytelseId)?.navn ?? s.ytelseId;
      const score = fuzzySearch(splitQuery(filter), ytelseName);
      scored.push({ ...s, score });
    }

    return scored.filter((s) => s.score > 0).toSorted((a, b) => b.score - a.score);
  }, [settings, ytelser, filter]);

  if (isLoading) {
    return (
      <Container filter={filter} setFilter={setFilter}>
        <SkeletonBody />
      </Container>
    );
  }

  return (
    <Container filter={filter} setFilter={setFilter}>
      <Table.Body>
        {filtered.map((b) => (
          <Row key={b.id} {...b} />
        ))}
      </Table.Body>
    </Container>
  );
};

const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: 0;
  background-color: var(--a-surface-default);
  z-index: 1;
  white-space: nowrap;
`;

const StyledContainer = styled.div`
  max-width: 2000px;
  overflow: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledTable = styled(Table)`
  position: relative;
`;
