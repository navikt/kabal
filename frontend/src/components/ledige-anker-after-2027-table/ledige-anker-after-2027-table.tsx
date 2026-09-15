import { BodyShort } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useTimingMeasurement } from '@/hooks/use-timing-measurement';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import {
  useGetAntallLedigeAnkerAfter2027MedUtgaatteFristerQuery,
  useGetLedigeAnkerAfter2027Query,
} from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { SaksTypeEnum } from '@/types/kodeverk';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForAnkerAfter2027,
  ColumnKeyEnum.UserYtelser,
  ColumnKeyEnum.UserInnsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.OppgavestyringNonFilterable,
  ColumnKeyEnum.FradelingReason,
];

export const LedigeAnkerAfter2027Table = () => {
  const hasAccess = useHasRole(Role.ANKETEAM);

  if (!hasAccess) {
    return null;
  }

  return <LedigeAnkerAfter2027TableInternal />;
};

const LedigeAnkerAfter2027TableInternal = (): React.JSX.Element => {
  const params = useOppgaveTableState(OppgaveTableKey.LEDIGE_ANKER_AFTER_2027, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const queryParams: typeof skipToken | CommonOppgaverParams =
    settingsData === undefined ? skipToken : { ...params, typer: getTypes(params.typer) };

  const { data, isFetching, isLoading, isError, refetch } = useGetLedigeAnkerAfter2027Query(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: utgaatte } = useGetAntallLedigeAnkerAfter2027MedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : queryParams,
  );

  useTimingMeasurement('ledige_anker_after_2027_list_load_ms', !isLoading && !isLoadingSettings);

  return (
    <SectionWithHeading heading="Ledige anker" size="small" level="1">
      <OppgaveTable
        zebraStripes
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.LEDIGE_ANKER_AFTER_2027}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
        tableKey={OppgaveTableKey.LEDIGE_ANKER_AFTER_2027}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
      <BodyShort size="small" className="mt-4">
        Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}
      </BodyShort>
    </SectionWithHeading>
  );
};

// Ensure types only includes ANKE_AFTER_2027 and ANKE_I_TRYGDERETTEN_AFTER_2027.
// The API will return oppgaver with other types if no filter is specified.
const getTypes = (originalTypes: SaksTypeEnum[] = []): SaksTypeEnum[] => {
  if (originalTypes.length === 0) {
    return [SaksTypeEnum.ANKE_AFTER_2027, SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027];
  }

  return originalTypes.filter(
    (type) => type === SaksTypeEnum.ANKE_AFTER_2027 || type === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027,
  );
};
