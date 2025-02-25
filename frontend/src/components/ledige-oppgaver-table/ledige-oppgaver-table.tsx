import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetLedigeOppgaverQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { BodyShort, Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { styled } from 'styled-components';

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
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    sortering: SortFieldEnum.FRIST,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const queryParams: typeof skipToken | CommonOppgaverParams = typeof settingsData === 'undefined' ? skipToken : params;

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
        params={params}
        setParams={setParams}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.LEDIGE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
      />
      <StyledCount size="small">Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</StyledCount>
    </section>
  );
};

const StyledCount = styled(BodyShort)`
  margin-top: 1rem;
`;
