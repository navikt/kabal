import { Table, TableProps } from '@navikt/ds-react';
import React from 'react';
import { FinishedColumnHeader } from '@app/components/common-table-components/oppgave-table/finished-column-header';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import {
  kodeverkSimpleValuesToDropdownOptions,
  kodeverkValuesToDropdownOptions,
} from '@app/components/filter-dropdown/functions';
import { useAvailableHjemler } from '@app/hooks/use-available-hjemler';
import { useSaksbehandlereInEnhet } from '@app/hooks/use-saksbehandlere-in-enhet';
import { useSettingsHjemler } from '@app/hooks/use-settings-hjemler';
import { useSettingsTypes } from '@app/hooks/use-settings-types';
import { useSettingsYtelser } from '@app/hooks/use-settings-ytelser';
import { useUser } from '@app/simple-api-state/use-user';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { CommonOppgaverParams, SortFieldEnum } from '@app/types/oppgaver';

interface TablePlainHeadersProps {
  columnKeys: ColumnKeyEnum[];
}

export const TablePlainHeaders = ({ columnKeys }: TablePlainHeadersProps) =>
  columnKeys.map((key) => <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>);

interface TableFilterHeadersProps extends TablePlainHeadersProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
}

export const TableFilterHeaders = ({ columnKeys, onSortChange, params, setParams }: TableFilterHeadersProps) => {
  const { data: bruker } = useUser();

  const sakstyper = useSettingsTypes();
  const ytelseOptions = useSettingsYtelser();
  const hjemlerOptions = useSettingsHjemler();
  const enhetHjemlerOptions = useAvailableHjemler();
  const saksbehandlerOptions = useSaksbehandlereInEnhet(bruker?.ansattEnhet.id);

  return columnKeys.map((key) => {
    if (params === undefined || setParams === undefined) {
      return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }

    switch (key) {
      case ColumnKeyEnum.Type:
        return (
          <Table.ColumnHeader key={key}>
            <FilterDropdown<SaksTypeEnum>
              selected={params.typer ?? []}
              onChange={(typer) => setParams({ ...params, typer })}
              options={kodeverkSimpleValuesToDropdownOptions(sakstyper)}
            >
              {TABLE_HEADERS[key]}
            </FilterDropdown>
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Ytelse:
        return (
          <Table.ColumnHeader key={key}>
            <FilterDropdown
              selected={params.ytelser ?? []}
              onChange={(ytelser) => setParams({ ...params, ytelser })}
              options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
            >
              {TABLE_HEADERS[key]}
            </FilterDropdown>
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Hjemmel:
        return (
          <Table.ColumnHeader key={key}>
            <FilterDropdown
              selected={params.hjemler ?? []}
              onChange={(hjemler) => setParams({ ...params, hjemler })}
              options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
            >
              {TABLE_HEADERS[key]}
            </FilterDropdown>
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.EnhetHjemmel:
        return (
          <Table.ColumnHeader key={key}>
            <FilterDropdown
              selected={params.hjemler ?? []}
              onChange={(hjemler) => setParams({ ...params, hjemler })}
              options={kodeverkValuesToDropdownOptions(enhetHjemlerOptions)}
            >
              {TABLE_HEADERS[key]}
            </FilterDropdown>
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Age:
        return (
          <Table.ColumnHeader key={key} sortable sortKey={SortFieldEnum.ALDER}>
            Alder
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Deadline:
        return (
          <Table.ColumnHeader key={key} sortable sortKey={SortFieldEnum.FRIST}>
            Frist
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Oppgavestyring:
        return (
          <Table.ColumnHeader key={key}>
            <FilterDropdown
              selected={params.tildelteSaksbehandlere ?? []}
              onChange={(tildelteSaksbehandlere) => setParams({ ...params, tildelteSaksbehandlere })}
              options={kodeverkSimpleValuesToDropdownOptions(saksbehandlerOptions)}
            >
              {TABLE_HEADERS[key]}
            </FilterDropdown>
          </Table.ColumnHeader>
        );
      case ColumnKeyEnum.Finished:
        return <FinishedColumnHeader key={key} params={params} setParams={setParams} onSortChange={onSortChange} />;
      default:
        return <Table.ColumnHeader key={key}>{TABLE_HEADERS[key]}</Table.ColumnHeader>;
    }
  });
};
