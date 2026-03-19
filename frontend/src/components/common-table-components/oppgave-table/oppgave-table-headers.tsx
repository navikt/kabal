import { Table, type TableProps } from '@navikt/ds-react';
import { DateColumnHeader } from '@/components/common-table-components/oppgave-table/date-column-header';
import { EnhetHjemmel } from '@/components/common-table-components/oppgave-table/filter-dropdowns/enhet-hjemmel';
import {
  HelperStatusWithoutSelf,
  HelperStatusWithSelf,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/helper-status';
import { Hjemmel } from '@/components/common-table-components/oppgave-table/filter-dropdowns/hjemmel';
import { Medunderskriver } from '@/components/common-table-components/oppgave-table/filter-dropdowns/medunderskriver';
import { PaaVentReasons } from '@/components/common-table-components/oppgave-table/filter-dropdowns/paa-vent-reason';
import { Registreringshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import { Rol } from '@/components/common-table-components/oppgave-table/filter-dropdowns/rol';
import { RolHjemmel } from '@/components/common-table-components/oppgave-table/filter-dropdowns/rol-hjemmel';
import { RolYtelse } from '@/components/common-table-components/oppgave-table/filter-dropdowns/rol-ytelse';
import { Saksbehandler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/saksbehandler';
import {
  Sakstype,
  SakstypeWithTrygderetten,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/sakstype';
import { Ytelse } from '@/components/common-table-components/oppgave-table/filter-dropdowns/ytelse';
import {
  useOppgaveTableFerdigstilt,
  useOppgaveTableFrist,
  useOppgaveTableReturnert,
  useOppgaveTableVarsletFrist,
} from '@/components/common-table-components/oppgave-table/state/use-date-range';
import type { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { SortHeader } from '@/components/common-table-components/sort-header';
import { ColumnKeyEnum, TABLE_HEADERS } from '@/components/common-table-components/types';
import { useHasRole } from '@/hooks/use-has-role';
import { Role } from '@/types/bruker';
import { SortFieldEnum, type SortOrderEnum } from '@/types/oppgaver';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>);

interface TableFilterHeadersProps {
  tableKey: OppgaveTableKey;
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  onSortChange: Exclude<TableProps['onSortChange'], undefined>;
}

type Props = TableFilterHeadersProps & TablePlainHeadersProps;

export const TableFilterHeaders = ({ columnKeys, tableKey, ...sortProps }: Props) =>
  columnKeys.map((key) => {
    switch (key) {
      case ColumnKeyEnum.Type:
        return <Sakstype key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.TypeWithTrygderetten:
        return <SakstypeWithTrygderetten key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Ytelse:
        return <Ytelse key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Innsendingshjemler:
        return <Hjemmel key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.EnhetInnsendingshjemler:
        return <EnhetHjemmel key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Registreringshjemler:
        return <Registreringshjemler key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Age:
        return (
          <SortHeader key={key} sortKey={SortFieldEnum.ALDER} {...sortProps}>
            {TABLE_HEADERS[key]}
          </SortHeader>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <Frist key={key} tableKey={tableKey} {...sortProps}>
            {TABLE_HEADERS[key]}
          </Frist>
        );
      case ColumnKeyEnum.VarsletFrist:
        return (
          <VarsletFrist key={key} {...sortProps} tableKey={tableKey}>
            {TABLE_HEADERS[key]}
          </VarsletFrist>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <SortHeader key={key} sortKey={SortFieldEnum.PAA_VENT_TO} {...sortProps}>
            {TABLE_HEADERS[key]}
          </SortHeader>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Oppgavestyring:
        return <Saksbehandler key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Medunderskriver:
        return <Medunderskriver key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Finished:
        return (
          <Finished key={key} tableKey={tableKey} {...sortProps}>
            {TABLE_HEADERS[key]}
          </Finished>
        );
      case ColumnKeyEnum.Returnert:
        return (
          <Returnert key={key} tableKey={tableKey} {...sortProps}>
            {TABLE_HEADERS[key]}
          </Returnert>
        );
      case ColumnKeyEnum.Rol:
        return <Rol key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.RolYtelse:
        return <RolYtelse key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.RolInnsendingshjemler:
        return <RolHjemmel key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.PaaVentReason:
        return <PaaVentReasons key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.FlowStatesWithSelf:
        return <HelperStatusWithSelf key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.FlowStatesWithoutSelf:
        return <HelperStatusWithoutSelf key={key} columnKey={key} tableKey={tableKey} />;
      case ColumnKeyEnum.Navn:
      case ColumnKeyEnum.Fnr:
      case ColumnKeyEnum.Open:
      case ColumnKeyEnum.OpenWithYtelseAccess:
      case ColumnKeyEnum.Tildeling:
      case ColumnKeyEnum.OppgavestyringNonFilterable:
      case ColumnKeyEnum.Utfall:
      case ColumnKeyEnum.Feilregistrert:
      case ColumnKeyEnum.Saksnummer:
      case ColumnKeyEnum.RolTildeling:
      case ColumnKeyEnum.RelevantOppgaver:
      case ColumnKeyEnum.FradelingReason:
      case ColumnKeyEnum.PreviousSaksbehandler:
      case ColumnKeyEnum.DatoSendtTilTr:
        return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }

    return <Table.ColumnHeader key={key} />;
  });

const Frist = ({ children, tableKey, ...props }: TableFilterHeadersProps & { children: string }) => {
  const { from, to, setDateRange } = useOppgaveTableFrist(tableKey);

  return (
    <DateColumnHeader {...props} from={from} to={to} setDateRange={setDateRange} sortKey={SortFieldEnum.FRIST}>
      {children}
    </DateColumnHeader>
  );
};

const VarsletFrist = ({ children, tableKey, ...props }: TableFilterHeadersProps & { children: string }) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { from, to, setDateRange } = useOppgaveTableVarsletFrist(tableKey);

  return (
    <DateColumnHeader
      {...props}
      from={from}
      to={to}
      setDateRange={setDateRange}
      sortKey={SortFieldEnum.VARSLET_FRIST}
      interactive={isMerkantil}
    >
      {children}
    </DateColumnHeader>
  );
};

const Finished = ({ children, tableKey, ...props }: TableFilterHeadersProps & { children: string }) => {
  const { from, to, setDateRange } = useOppgaveTableFerdigstilt(tableKey);

  return (
    <DateColumnHeader
      {...props}
      from={from}
      to={to}
      setDateRange={setDateRange}
      sortKey={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
    >
      {children}
    </DateColumnHeader>
  );
};

const Returnert = ({ children, tableKey, ...props }: TableFilterHeadersProps & { children: string }) => {
  const { from, to, setDateRange } = useOppgaveTableReturnert(tableKey);

  return (
    <DateColumnHeader
      {...props}
      from={from}
      to={to}
      setDateRange={setDateRange}
      sortKey={SortFieldEnum.RETURNERT_FRA_ROL}
    >
      {children}
    </DateColumnHeader>
  );
};
