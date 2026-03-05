import { AvsenderMottakerFilter } from '@app/components/documents/journalfoerte-documents/header/avsender-mottaker';
import { DatoOpprettet } from '@app/components/documents/journalfoerte-documents/header/dato-opprettet';
import { DatoSortering } from '@app/components/documents/journalfoerte-documents/header/dato-sortering';
import { Saksnummer } from '@app/components/documents/journalfoerte-documents/header/saksnummer';
import { Tema } from '@app/components/documents/journalfoerte-documents/header/tema';
import { Type } from '@app/components/documents/journalfoerte-documents/header/type';
import type { useFilters } from '@app/components/documents/journalfoerte-documents/header/use-filters';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';

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
