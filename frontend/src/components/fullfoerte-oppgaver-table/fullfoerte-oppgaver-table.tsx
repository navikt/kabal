import { Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetMineFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

const TEST_ID = 'fullfoerte-oppgaver-table';

const EMPTY_ARRAY: string[] = [];

export const FullfoerteOppgaverTable = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    sortering: SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
    rekkefoelge: SortOrderEnum.SYNKENDE,
    typer: [],
    ytelser: EMPTY_ARRAY,
    hjemler: EMPTY_ARRAY,
    tildelteSaksbehandlere: EMPTY_ARRAY,
  });

  const { data, isLoading, isFetching, isError, refetch } = useGetMineFerdigstilteOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Fullførte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        data-testid={TEST_ID}
        settingsKey={OppgaveTableRowsPerPage.MINE_FERDIGE}
        behandlinger={data?.behandlinger}
        params={params}
        setParams={setParams}
        zebraStripes
      />
    </section>
  );
};
