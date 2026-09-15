import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetAnketeamLedigeOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForAnkerAfter2027,
  ColumnKeyEnum.AllYtelser,
  ColumnKeyEnum.AllInnsendingshjemler,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.FlowStatesWithoutSelf,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Medunderskriver,
  ColumnKeyEnum.Oppgavestyring,
];

export const LedigeAnkerTable = () => {
  const hasAccess = useHasRole(Role.KABAL_OPPGAVESTYRING_ANKETEAM);

  if (!hasAccess) {
    return null;
  }

  return <LedigeAnkerTableInternal />;
};

const LedigeAnkerTableInternal = () => {
  const params = useOppgaveTableState(OppgaveTableKey.ANKETEAM_LEDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const { data, ...props } = useGetAnketeamLedigeOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="Ledige anker" size="small">
      <OppgaveTable
        {...props}
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ANKETEAM_LEDIGE}
        tableKey={OppgaveTableKey.ANKETEAM_LEDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </SectionWithHeading>
  );
};
