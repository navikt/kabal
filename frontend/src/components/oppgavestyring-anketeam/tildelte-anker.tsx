import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetAnketeamTildelteOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
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

export const TildelteAnkerTable = () => {
  const hasAccess = useHasRole(Role.KABAL_OPPGAVESTYRING_ANKETEAM);

  if (!hasAccess) {
    return null;
  }

  return <TildelteAnkerTableInternal />;
};

const TildelteAnkerTableInternal = () => {
  const params = useOppgaveTableState(OppgaveTableKey.ANKETEAM_TILDELTE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const { data, ...props } = useGetAnketeamTildelteOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="Tildelte" size="small">
      <OppgaveTable
        {...props}
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ANKETEAM_TILDELTE}
        tableKey={OppgaveTableKey.ANKETEAM_TILDELTE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </SectionWithHeading>
  );
};
