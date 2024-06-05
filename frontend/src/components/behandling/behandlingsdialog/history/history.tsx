import { Heading, Select } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { ALL, Filter } from '@app/components/behandling/behandlingsdialog/history/filter';
import { getFullmektig } from '@app/components/behandling/behandlingsdialog/history/fullmektig';
import { MissingHistoryWarning } from '@app/components/behandling/behandlingsdialog/history/history-warning';
import { getKlager } from '@app/components/behandling/behandlingsdialog/history/klager';
import { getMedunderskriverEvent } from '@app/components/behandling/behandlingsdialog/history/medunderskriver';
import { getROLEvent } from '@app/components/behandling/behandlingsdialog/history/rol';
import { getSattPaaVent } from '@app/components/behandling/behandlingsdialog/history/satt-paa-vent';
import { getTildelingEvent } from '@app/components/behandling/behandlingsdialog/history/tildeling';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetHistoryQuery } from '@app/redux-api/oppgaver/queries/history';
import { HistoryEventTypes, IHistory, IHistoryResponse } from '@app/types/oppgavebehandling/response';
import { getFeilregistrertEvent } from './feilregistrert';
import { getFerdigstiltEvent } from './ferdigstilt';

export const EventHistory = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetHistoryQuery(oppgaveId);

  if (isLoading || data === undefined) {
    return (
      <Container>
        <Heading level="1" size="xsmall">
          Hendelseslogg
        </Heading>

        <Select label="Filter" size="small" hideLabel disabled value={ALL}>
          <option value={ALL}>Alle hendelser</option>
        </Select>

        <EmptyText>Laster hendelser...</EmptyText>
      </Container>
    );
  }

  return <LoadedEventHistory data={data} />;
};

interface EventHistoryProps {
  data: IHistoryResponse;
}

const LoadedEventHistory = ({ data }: EventHistoryProps) => {
  const [filter, setFilter] = useState<keyof IHistoryResponse | typeof ALL>(ALL);

  const nodeCategories: Record<keyof IHistoryResponse, NodesCategory[]> = useMemo(
    () => ({
      tildeling: toNodes(data.tildeling, getTildelingEvent),
      medunderskriver: toNodes(data.medunderskriver, getMedunderskriverEvent),
      rol: toNodes(data.rol, getROLEvent),
      klager: toNodes(data.klager, getKlager),
      sattPaaVent: toNodes(data.sattPaaVent, getSattPaaVent),
      fullmektig: toNodes(data.fullmektig, getFullmektig),
      ferdigstilt: toNodes(data.ferdigstilt, getFerdigstiltEvent),
      feilregistrert: toNodes(data.feilregistrert, getFeilregistrertEvent),
    }),
    [data],
  );

  const filteredNodes = useMemo(() => {
    const { feilregistrert, ferdigstilt, klager, medunderskriver, rol, sattPaaVent, tildeling, fullmektig } =
      nodeCategories;

    if (filter === ALL) {
      return [
        ...feilregistrert,
        ...ferdigstilt,
        ...klager,
        ...medunderskriver,
        ...rol,
        ...sattPaaVent,
        ...tildeling,
        ...fullmektig,
      ]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .map(({ node }) => node);
    }

    return nodeCategories[filter].toSorted((a, b) => b.timestamp.localeCompare(a.timestamp)).map(({ node }) => node);
  }, [filter, nodeCategories]);

  const { counts, totalCount } = useMemo(() => {
    const { tildeling, medunderskriver, rol, klager, sattPaaVent, fullmektig, ferdigstilt, feilregistrert } =
      nodeCategories;

    const _counts: Record<HistoryEventTypes, number> = {
      [HistoryEventTypes.TILDELING]: tildeling.length,
      [HistoryEventTypes.MEDUNDERSKRIVER]: medunderskriver.length,
      [HistoryEventTypes.ROL]: rol.length,
      [HistoryEventTypes.KLAGER]: klager.length,
      [HistoryEventTypes.SATT_PAA_VENT]: sattPaaVent.length,
      [HistoryEventTypes.FULLMEKTIG]: fullmektig.length,
      [HistoryEventTypes.FERDIGSTILT]: ferdigstilt.length,
      [HistoryEventTypes.FEILREGISTRERT]: feilregistrert.length,
    };
    const _totalCount =
      tildeling.length +
      medunderskriver.length +
      rol.length +
      klager.length +
      sattPaaVent.length +
      fullmektig.length +
      ferdigstilt.length +
      feilregistrert.length;

    return { counts: _counts, totalCount: _totalCount };
  }, [nodeCategories]);

  return (
    <Container>
      <Heading level="1" size="xsmall">
        Hendelseslogg ({totalCount})
      </Heading>

      <Filter filter={filter} setFilter={setFilter} counts={counts} totalCount={totalCount} />

      <List>
        {filteredNodes}
        <MissingHistoryWarning />
      </List>
    </Container>
  );
};

interface NodesCategory {
  node: React.ReactNode;
  timestamp: string;
}

type ToNodeFn<T extends IHistory> = (event: T) => React.ReactNode | null;

const toNodes = <T extends IHistory>(events: T[], toNode: ToNodeFn<T>): NodesCategory[] => {
  const renderedEvents: NodesCategory[] = [];

  for (const event of events) {
    const node = toNode(event);

    if (node !== null) {
      renderedEvents.push({ node, timestamp: event.timestamp });
    }
  }

  return renderedEvents;
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const EmptyText = styled.span`
  display: block;
  font-style: italic;
`;
