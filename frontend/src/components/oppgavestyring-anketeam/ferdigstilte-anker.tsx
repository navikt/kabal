import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetAnketeamFerdigstilteOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForAnkerAfter2027,
  ColumnKeyEnum.AllYtelser,
  ColumnKeyEnum.AllRegistreringshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.PreviousSaksbehandler,
  ColumnKeyEnum.Open,
];

export const FerdigstilteAnkerTable = () => {
  const hasAccess = useHasRole(Role.KABAL_OPPGAVESTYRING_ANKETEAM);

  if (!hasAccess) {
    return null;
  }

  return <FerdigstilteAnkerTableInternal />;
};

const FerdigstilteAnkerTableInternal = () => {
  const params = useOppgaveTableState(
    OppgaveTableKey.ANKETEAM_FERDIGE,
    SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
    SortOrderEnum.DESC,
  );

  const { data, ...props } = useGetAnketeamFerdigstilteOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="Fullførte" size="small">
      <OppgaveTable
        {...props}
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ANKETEAM_FERDIGE}
        tableKey={OppgaveTableKey.ANKETEAM_FERDIGE}
        defaultRekkefoelge={SortOrderEnum.DESC}
        defaultSortering={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
      />
    </SectionWithHeading>
  );
};
