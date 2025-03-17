import { ALL, Filter } from '@app/components/behandling/behandlingsdialog/history/filter';
import { getForlengetBehandlingstidEvent } from '@app/components/behandling/behandlingsdialog/history/forlenget-behandlingstid';
import { getFullmektig } from '@app/components/behandling/behandlingsdialog/history/fullmektig';
import { MissingHistoryWarning } from '@app/components/behandling/behandlingsdialog/history/history-warning';
import { getKlager } from '@app/components/behandling/behandlingsdialog/history/klager';
import { getMedunderskriverEvent } from '@app/components/behandling/behandlingsdialog/history/medunderskriver';
import { getROLEvent } from '@app/components/behandling/behandlingsdialog/history/rol';
import { getSattPaaVent } from '@app/components/behandling/behandlingsdialog/history/satt-paa-vent';
import { getTildelingEvent } from '@app/components/behandling/behandlingsdialog/history/tildeling';
import { getVarsletBehandlingstidEvent } from '@app/components/behandling/behandlingsdialog/history/varslet-behandlingstid';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetHistoryQuery } from '@app/redux-api/oppgaver/queries/history';
import { HistoryEventTypes, type IHistory, type IHistoryResponse } from '@app/types/oppgavebehandling/response';
import { Heading, Select, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { getFeilregistrertEvent } from './feilregistrert';
import { getFerdigstiltEvent } from './ferdigstilt';

export const EventHistory = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetHistoryQuery(oppgaveId);

  if (isLoading || data === undefined) {
    return (
      <VStack gap="2" as="section">
        <Heading level="1" size="xsmall">
          Hendelseslogg
        </Heading>

        <Select label="Filter" size="small" hideLabel disabled value={ALL}>
          <option value={ALL}>Alle hendelser</option>
        </Select>

        <span className="block italic">Laster hendelser...</span>
      </VStack>
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
      varsletBehandlingstid: toNodes(data.varsletBehandlingstid, getVarsletBehandlingstidEvent),
      forlengetBehandlingstid: toNodes(data.forlengetBehandlingstid, getForlengetBehandlingstidEvent),
    }),
    [data],
  );

  const filteredNodes = useMemo(() => {
    const {
      feilregistrert,
      ferdigstilt,
      klager,
      medunderskriver,
      rol,
      sattPaaVent,
      tildeling,
      fullmektig,
      varsletBehandlingstid,
      forlengetBehandlingstid,
    } = nodeCategories;

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
        ...varsletBehandlingstid,
        ...forlengetBehandlingstid,
      ]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .map(({ node }) => node);
    }

    return nodeCategories[filter].toSorted((a, b) => b.timestamp.localeCompare(a.timestamp)).map(({ node }) => node);
  }, [filter, nodeCategories]);

  const { counts, totalCount } = useMemo(() => {
    const {
      tildeling,
      medunderskriver,
      rol,
      klager,
      sattPaaVent,
      fullmektig,
      ferdigstilt,
      feilregistrert,
      varsletBehandlingstid,
      forlengetBehandlingstid,
    } = nodeCategories;

    const _counts: Record<HistoryEventTypes, number> = {
      [HistoryEventTypes.TILDELING]: tildeling.length,
      [HistoryEventTypes.MEDUNDERSKRIVER]: medunderskriver.length,
      [HistoryEventTypes.ROL]: rol.length,
      [HistoryEventTypes.KLAGER]: klager.length,
      [HistoryEventTypes.SATT_PAA_VENT]: sattPaaVent.length,
      [HistoryEventTypes.FULLMEKTIG]: fullmektig.length,
      [HistoryEventTypes.FERDIGSTILT]: ferdigstilt.length,
      [HistoryEventTypes.FEILREGISTRERT]: feilregistrert.length,
      [HistoryEventTypes.VARSLET_BEHANDLINGSTID]: varsletBehandlingstid.length,
      [HistoryEventTypes.FORLENGET_BEHANDLINGSTID]: forlengetBehandlingstid.length,
    };
    const _totalCount =
      tildeling.length +
      medunderskriver.length +
      rol.length +
      klager.length +
      sattPaaVent.length +
      fullmektig.length +
      ferdigstilt.length +
      feilregistrert.length +
      varsletBehandlingstid.length;

    return { counts: _counts, totalCount: _totalCount };
  }, [nodeCategories]);

  return (
    <VStack gap="2" as="section">
      <Heading level="1" size="xsmall">
        Hendelseslogg ({totalCount})
      </Heading>

      <Filter filter={filter} setFilter={setFilter} counts={counts} totalCount={totalCount} />

      <ul className="m-0 flex list-none flex-col gap-y-2 p-0">
        {filteredNodes}
        <MissingHistoryWarning />
      </ul>
    </VStack>
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
