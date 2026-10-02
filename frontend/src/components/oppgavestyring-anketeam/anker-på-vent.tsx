import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetAnketeamVentendeOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
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
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Medunderskriver,
  ColumnKeyEnum.Oppgavestyring,
];

export const AnkerPåVentTable = () => {
  const hasAccess = useHasRole(Role.KABAL_OPPGAVESTYRING_ANKETEAM);

  if (!hasAccess) {
    return null;
  }

  return <AnkerPåVentTableInternal />;
};

const AnkerPåVentTableInternal = () => {
  const params = useOppgaveTableState(OppgaveTableKey.ANKETEAM_VENTENDE, SortFieldEnum.PAA_VENT_TO, SortOrderEnum.ASC);

  const { data, ...props } = useGetAnketeamVentendeOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="På vent" size="small">
      <OppgaveTable
        {...props}
        columns={COLUMNS}
        zebraStripes
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ANKETEAM_VENTENDE}
        tableKey={OppgaveTableKey.ANKETEAM_VENTENDE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.PAA_VENT_TO}
      />
    </SectionWithHeading>
  );
};
