import { AvsenderMottakerFilter } from '@/components/documents/journalfoerte-documents/header/avsender-mottaker';
import { DatoOpprettet } from '@/components/documents/journalfoerte-documents/header/dato-opprettet';
import { DatoSortering } from '@/components/documents/journalfoerte-documents/header/dato-sortering';
import { Saksnummer } from '@/components/documents/journalfoerte-documents/header/saksnummer';
import { Tema } from '@/components/documents/journalfoerte-documents/header/tema';
import { Type } from '@/components/documents/journalfoerte-documents/header/type';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useArchivedDocumentsColumns } from '@/hooks/settings/use-archived-documents-setting';
import { useGetArkiverteDokumenterQuery } from '@/redux-api/oppgaver/queries/documents';

type Props = ReturnType<typeof useFilters>;

export const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
  sort,
  setSort,
}: Props) => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetArkiverteDokumenterQuery(oppgaveId);
  const { columns } = useArchivedDocumentsColumns();

  return (
    <>
      {columns.TEMA ? <Tema setSelectedTemaer={setSelectedTemaer} selectedTemaer={selectedTemaer} /> : null}

      {columns.DATO_OPPRETTET ? <DatoOpprettet sort={sort} setSort={setSort} /> : null}

      {columns.DATO_SORTERING ? <DatoSortering sort={sort} setSort={setSort} /> : null}

      {columns.AVSENDER_MOTTAKER ? (
        <AvsenderMottakerFilter
          avsenderMottakerList={data?.avsenderMottakerList ?? []}
          setSelectedAvsenderMottakere={setSelectedAvsenderMottakere}
          selectedAvsenderMottakere={selectedAvsenderMottakere}
        />
      ) : null}

      {columns.SAKSNUMMER ? (
        <Saksnummer
          sakList={data?.sakList ?? []}
          selectedSaksIds={selectedSaksIds}
          setSelectedSaksIds={setSelectedSaksIds}
        />
      ) : null}

      {columns.TYPE ? <Type setSelectedTypes={setSelectedTypes} selectedTypes={selectedTypes} /> : null}
    </>
  );
};
