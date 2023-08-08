import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { TableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetEnhetensVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { CommonOppgaverParams, EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Oppgavestyring,
  ColumnKeyEnum.Open,
];

export const EnhetensOppgaverPaaVentTable = () => {
  const { data: bruker } = useUser();

  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    tildelteSaksbehandlere: [],
    rekkefoelge: SortOrderEnum.STIGENDE,
    sortering: SortFieldEnum.FRIST,
  });

  const queryParams: typeof skipToken | EnhetensOppgaverParams =
    typeof bruker === 'undefined' ? skipToken : { ...params, enhetId: bruker.ansattEnhet.id };

  const { data, isError, isFetching, isLoading, refetch } = useGetEnhetensVentendeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Oppgaver på vent</Heading>
      <OppgaveTable
        columns={COLUMNS}
        zebraStripes
        params={params}
        setParams={setParams}
        data-testid="enhetens-oppgaver-paa-vent-table"
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        behandlinger={data?.behandlinger}
        settingsKey={TableRowsPerPage.ENHETENS_VENTENDE}
      />
    </section>
  );
};
