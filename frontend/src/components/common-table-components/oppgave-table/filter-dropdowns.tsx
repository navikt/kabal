import { Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo } from 'react';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import {
  kodeverkSimpleValuesToDropdownOptions,
  kodeverkValuesToDropdownOptions,
} from '@app/components/filter-dropdown/functions';
import { IOption } from '@app/components/filter-dropdown/props';
import { useAvailableHjemler } from '@app/hooks/use-available-hjemler';
import { useSettingsHjemler } from '@app/hooks/use-settings-hjemler';
import { useSettingsTypes } from '@app/hooks/use-settings-types';
import { useSettingsYtelser } from '@app/hooks/use-settings-ytelser';
import {
  useGetMedunderskrivereForEnhetQuery,
  useGetSaksbehandlereInEnhetQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { INavEmployee } from '@app/types/oppgave-common';
import { CommonOppgaverParams } from '@app/types/oppgaver';

interface FilterDropdownProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  columnKey: ColumnKeyEnum;
}

export const EnhetHjemmel = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const enhetHjemlerOptions = useAvailableHjemler();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={kodeverkValuesToDropdownOptions(enhetHjemlerOptions)}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const Ytelse = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const ytelseOptions = useSettingsYtelser();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.ytelser ?? []}
        onChange={(ytelser) => setParams({ ...params, ytelser })}
        options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
        data-testid="filter-ytelse"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const Sakstype = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const sakstyper = useSettingsTypes();

  return (
    <Table.ColumnHeader>
      <FilterDropdown<SaksTypeEnum>
        selected={params.typer ?? []}
        onChange={(typer) => setParams({ ...params, typer })}
        options={kodeverkSimpleValuesToDropdownOptions(sakstyper)}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const Hjemmel = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const hjemlerOptions = useSettingsHjemler();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const Saksbehandler = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data: bruker } = useUser();
  const { data } = useGetSaksbehandlereInEnhetQuery(bruker?.ansattEnhet.id ?? skipToken);

  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.saksbehandlere), [data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.tildelteSaksbehandlere ?? []}
        onChange={(tildelteSaksbehandlere) => setParams({ ...params, tildelteSaksbehandlere })}
        options={options}
        data-testid="filter-saksbehandler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const Medunderskriver = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data: bruker } = useUser();
  const { data } = useGetMedunderskrivereForEnhetQuery(bruker?.ansattEnhet.id ?? skipToken);

  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.medunderskrivere), [data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.medunderskrivere ?? []}
        onChange={(medunderskrivere) => setParams({ ...params, medunderskrivere })}
        options={options}
        data-testid="filter-medunderskriver"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

const navEmployeesToOptions = (navEmployees: INavEmployee[] | undefined = []): IOption<string>[] =>
  navEmployees.map(({ navIdent, navn }) => ({ value: navIdent, label: navn }));
