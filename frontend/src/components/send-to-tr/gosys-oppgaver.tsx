import { Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { TableHeader } from '@/components/gosys-oppgave-table/table-header';
import { TableRowContent } from '@/components/gosys-oppgave-table/table-row-content';
import { getDirection, isKeyofGosysOppgave, type ScopedSortState, sortGosysOppgaver } from '@/domain/gosys-oppgaver';
import { useSearchEnheterQuery } from '@/redux-api/search';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface GosysOppgaverProps {
  gosysOppgaver: ListGosysOppgave[] | undefined;
  selectedGosysOppgave?: ListGosysOppgave;
  onSelect: (gosysOppgave: ListGosysOppgave) => void;
}

export const GosysOppgaver = ({ gosysOppgaver, selectedGosysOppgave, onSelect }: GosysOppgaverProps) => {
  const { data: enheter = [] } = useSearchEnheterQuery({});
  const [sort, setSort] = useState<ScopedSortState>({ direction: 'ascending', orderBy: 'fristFerdigstillelse' });

  const handleSort = (sortKey: string) => {
    if (!isKeyofGosysOppgave(sortKey)) {
      return;
    }

    setSort({ orderBy: sortKey, direction: getDirection(sort, sortKey) });
  };

  const sortedOppgaver: ListGosysOppgave[] = useMemo(
    () => (gosysOppgaver === undefined ? [] : sortGosysOppgaver(gosysOppgaver, sort, enheter)),
    [gosysOppgaver, sort, enheter],
  );

  return (
    <Table size="small" zebraStripes onSortChange={handleSort} sort={sort} className="w-fit">
      <TableHeader sortable showFerdigstilt={false} />
      <Table.Body>
        {sortedOppgaver.map((g) => (
          <TableRowContent
            key={g.id}
            gosysOppgave={g}
            selected={selectedGosysOppgave?.id === g.id}
            showFerdigstilt={false}
            onSelect={onSelect}
            canEdit
            isLoading={false}
          />
        ))}
      </Table.Body>
    </Table>
  );
};
