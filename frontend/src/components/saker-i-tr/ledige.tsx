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
  ColumnKeyEnum.Oppgavestyring,
];

export const LedigeSakerITRTable = () => {
  const params = useOppgaveTableState(OppgaveTableKey.SAKER_I_TR_LEDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const { data, isLoading, isFetching, isError, refetch } = useGetLedigeOppgaverQuery(
    { ...params, typer: filterTyper(params.typer) },
    { refetchOnFocus: true, refetchOnMountOrArgChange: true },
  );

  return (
    <section>
      <Heading size="small">Ledige oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid="saker-i-tr-ledige-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.SAKER_I_TR_LEDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        tableKey={OppgaveTableKey.SAKER_I_TR_LEDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </section>
  );
};
