import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useSakstyper } from '@app/hooks/use-kodeverk-value';
import { useGetEnhetensUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import {
  CommonOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  SortFieldEnum,
  SortOrderEnum,
} from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Medunderskriverflyt,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Oppgavestyring,
];

export const EnhetensOppgaverTable = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    tildeltSaksbehandler: [],
    rekkefoelge: SortOrderEnum.STIGENDE,
    sortering: SortFieldEnum.FRIST,
  });

  const types = useSakstyper();

  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined' || typeof types === 'undefined'
      ? skipToken
      : { ...params, enhetId: bruker.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetEnhetensUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <div>
      <Heading size="medium">Tildelte oppgaver - {bruker?.ansattEnhet.navn}</Heading>
      <OppgaveTable
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        data-testid="enhetens-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ENHETENS_UFERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
      />
    </div>
  );
};
