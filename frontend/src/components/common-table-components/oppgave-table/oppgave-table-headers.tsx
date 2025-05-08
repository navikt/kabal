import { DateColumnHeader } from '@app/components/common-table-components/oppgave-table/date-column-header';
import { Registreringshjemler } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import type { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import { type CommonOppgaverParams, SortFieldEnum } from '@app/types/oppgaver';
import { Table, type TableProps } from '@navikt/ds-react';
import { EnhetHjemmel } from './filter-dropdowns/enhet-hjemmel';
import { Hjemmel } from './filter-dropdowns/hjemmel';
import { Medunderskriver } from './filter-dropdowns/medunderskriver';
import { Rol } from './filter-dropdowns/rol';
import { RolHjemmel } from './filter-dropdowns/rol-hjemmel';
import { RolYtelse } from './filter-dropdowns/rol-ytelse';
import { Saksbehandler } from './filter-dropdowns/saksbehandler';
import { Sakstype, SakstypeWithAnkeITrygderetten } from './filter-dropdowns/sakstype';
import { Ytelse } from './filter-dropdowns/ytelse';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => (
    <Table.ColumnHeader className="whitespace-nowrap" key={key}>
      {TABLE_HEADERS[key]}
    </Table.ColumnHeader>
  ));

interface TableFilterHeadersProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
}

type Props = TableFilterHeadersProps & TablePlainHeadersProps;

export const TableFilterHeaders = ({ columnKeys, onSortChange, params, setParams }: Props) =>
  columnKeys.map((key) => {
    if (params === undefined || setParams === undefined) {
      return (
        <Table.ColumnHeader className="whitespace-nowrap" key={key}>
          {TABLE_HEADERS[key]}
        </Table.ColumnHeader>
      );
    }

    const baseColumnHeaderProps = { params, setParams, onSortChange };

    switch (key) {
      case ColumnKeyEnum.Type:
        return <Sakstype key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.TypeWithAnkeITrygderetten:
        return <SakstypeWithAnkeITrygderetten key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Ytelse:
        return <Ytelse key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Innsendingshjemler:
        return <Hjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.EnhetInnsendingshjemler:
        return <EnhetHjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Registreringshjemler:
        return <Registreringshjemler key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Age:
        return (
          <Table.ColumnHeader className="whitespace-nowrap" key={key} sortable sortKey={SortFieldEnum.ALDER}>
            {TABLE_HEADERS[key]}
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <DateColumnHeader
            key={key}
            {...baseColumnHeaderProps}
            fromKey="fristFrom"
            toKey="fristTo"
            sortKey={SortFieldEnum.FRIST}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.VarsletFrist:
        return (
          <VarsletFrist key={key} {...baseColumnHeaderProps}>
            {TABLE_HEADERS[key]}
          </VarsletFrist>
        );
      case ColumnKeyEnum.PaaVentTil:
        return (
          <Table.ColumnHeader className="whitespace-nowrap" key={key} sortable sortKey={SortFieldEnum.PAA_VENT_TO}>
            {TABLE_HEADERS[key]}
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.TildelingWithFilter:
      case ColumnKeyEnum.Oppgavestyring:
        return <Saksbehandler key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Medunderskriver:
        return <Medunderskriver key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Finished:
        return (
          <DateColumnHeader
            {...baseColumnHeaderProps}
            key={key}
            fromKey="ferdigstiltFrom"
            toKey="ferdigstiltTo"
            sortKey={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.Returnert:
        return (
          <DateColumnHeader
            {...baseColumnHeaderProps}
            key={key}
            fromKey="returnertFrom"
            toKey="returnertTo"
            sortKey={SortFieldEnum.RETURNERT_FRA_ROL}
          >
            {TABLE_HEADERS[key]}
          </DateColumnHeader>
        );
      case ColumnKeyEnum.Rol:
        return <Rol key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.RolYtelse:
        return <RolYtelse key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.RolInnsendingshjemler:
        return <RolHjemmel key={key} columnKey={key} params={params} setParams={setParams} />;
      case ColumnKeyEnum.Navn:
      case ColumnKeyEnum.Fnr:
      case ColumnKeyEnum.FlowStates:
      case ColumnKeyEnum.Open:
      case ColumnKeyEnum.OpenWithYtelseAccess:
      case ColumnKeyEnum.Tildeling:
      case ColumnKeyEnum.OppgavestyringNonFilterable:
      case ColumnKeyEnum.Utfall:
      case ColumnKeyEnum.PaaVentReason:
      case ColumnKeyEnum.Feilregistrering:
      case ColumnKeyEnum.Feilregistrert:
      case ColumnKeyEnum.Saksnummer:
      case ColumnKeyEnum.RolTildeling:
      case ColumnKeyEnum.RelevantOppgaver:
      case ColumnKeyEnum.FradelingReason:
      case ColumnKeyEnum.PreviousSaksbehandler:
      case ColumnKeyEnum.DatoSendtTilTr:
        return (
          <Table.ColumnHeader className="whitespace-nowrap" key={key}>
            {TABLE_HEADERS[key]}
          </Table.ColumnHeader>
        );
    }

    return <Table.ColumnHeader className="whitespace-nowrap" key={key} />;
  });

const VarsletFrist = ({ children, ...props }: TableFilterHeadersProps & { children: string }) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return (
    <DateColumnHeader
      {...props}
      fromKey="varsletFristFrom"
      toKey="varsletFristTo"
      sortKey={SortFieldEnum.VARSLET_FRIST}
      interactive={isMerkantil}
    >
      {children}
    </DateColumnHeader>
  );
};
