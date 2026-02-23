import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { filterTyper } from '@app/components/saker-i-tr/filter-typer';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetLedigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForSakerITR,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.DatoSendtTilTr,
  ColumnKeyEnum.FlowStatesWithoutSelf,
  ColumnKeyEnum.Tildeling,
];

export const SakerITRPåVentTable = () => {
  const params = useOppgaveTableState(OppgaveTableKey.SAKER_I_TR_VENTENDE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  // TODO wrong query
  const { data, isLoading, isFetching, isError, refetch } = useGetLedigeOppgaverQuery(
    { ...params, typer: filterTyper(params.typer) },
    { refetchOnFocus: true, refetchOnMountOrArgChange: true },
  );

  return (
    <section>
      <Heading size="small">Oppgaver på vent</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid="saker-i-tr-på-vent-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.SAKER_I_TR_VENTENDE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        tableKey={OppgaveTableKey.SAKER_I_TR_VENTENDE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </section>
  );
};
