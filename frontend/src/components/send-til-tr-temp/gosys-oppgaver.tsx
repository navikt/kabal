import { Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { Row } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import {
  getDirection,
  Header,
  isKeyofGosysOppgave,
  type ScopedSortState,
  sortData,
} from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/select-gosys-oppgave';
import { TableHeader } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/table-header';
import { useSearchEnheterQuery } from '@/redux-api/search';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  gosysOppgaver: ListGosysOppgave[] | undefined;
  selectedGosysOppgave?: ListGosysOppgave;
  showFerdigstilt?: boolean;
  fallback?: string;
  refetch?: () => void;
  isFetching?: boolean;
  onSelect?: (gosysOppgave: ListGosysOppgave) => void;
}

export const GosysOppgaver = ({
  gosysOppgaver,
  selectedGosysOppgave,
  showFerdigstilt = false,
  fallback,
  refetch,
  isFetching,
  onSelect,
}: Props) => {
  const { data: enheter = [] } = useSearchEnheterQuery({});
  const [sort, setSort] = useState<ScopedSortState>({ direction: 'ascending', orderBy: 'opprettetTidspunkt' });

  const handleSort = (sortKey: string) => {
    if (!isKeyofGosysOppgave(sortKey)) {
      return;
    }

    setSort({ orderBy: sortKey, direction: getDirection(sort, sortKey) });
  };

  const sortedOppgaver: ListGosysOppgave[] = useMemo(
    () => sortData([...(gosysOppgaver ?? [])], sort, enheter),
    [gosysOppgaver, sort, enheter],
  );

  if (gosysOppgaver?.length === 0 && fallback !== undefined) {
    return (
      <section>
        <Header refetch={refetch} isFetching={isFetching}>
          {fallback}
        </Header>
        <span className="italic">{fallback}</span>
      </section>
    );
  }

  return (
    <Table size="small" zebraStripes onSortChange={handleSort} sort={sort}>
      <TableHeader showFerdigstilt={showFerdigstilt} />
      <Table.Body>
        {sortedOppgaver.map((d) => (
          <Row
            key={d.id}
            gosysOppgave={d}
            selectedGosysOppgave={selectedGosysOppgave}
            showFerdigstilt={showFerdigstilt}
            onSelectGosysOppgave={onSelect}
            canEdit={true}
          />
        ))}
      </Table.Body>
    </Table>
  );
};
