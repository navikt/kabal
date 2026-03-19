import { BodyShort, Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetLedigeOppgaverQuery,
} from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.OppgavestyringNonFilterable,
  ColumnKeyEnum.FradelingReason,
];

export const LedigeOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (!hasAccess) {
    return null;
  }

  return <LedigeOppgaverTableInternal />;
};

const LedigeOppgaverTableInternal = (): React.JSX.Element => {
  const params = useOppgaveTableState(OppgaveTableKey.LEDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const queryParams: typeof skipToken | CommonOppgaverParams = settingsData === undefined ? skipToken : params;

  const { data, isFetching, isLoading, isError, refetch } = useGetLedigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: utgaatte } = useGetAntallLedigeOppgaverMedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : queryParams,
  );

  return (
    <section>
      <Heading level="1" size="small">
        Ledige oppgaver
      </Heading>
      <OppgaveTable
        data-testid="oppgave-table"
        zebraStripes
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.LEDIGE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
        tableKey={OppgaveTableKey.LEDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
      <BodyShort size="small" className="mt-4">
        Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}
      </BodyShort>
    </section>
  );
};
