import { ShortParamKey } from '@app/components/common-table-components/oppgave-table/state/short-names';
import { fromDateRangeParam } from '@app/components/common-table-components/oppgave-table/state/use-date-range';
import { fromSortingParam } from '@app/components/common-table-components/oppgave-table/state/use-sort-state';
import { fromArrayParam, fromTyperParam } from '@app/components/common-table-components/oppgave-table/state/use-state';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

export const useOppgaveTableState = (
  tableKey: OppgaveTableKey,
  defaultSortField: SortFieldEnum,
  defaultSortOrder: SortOrderEnum,
): CommonOppgaverParams => {
  const { search } = useLocation();

  const [params, setParams] = useState<CommonOppgaverParams>(() =>
    parseParams(new URLSearchParams(search), tableKey, defaultSortField, defaultSortOrder),
  );

  const prefix = useMemo(() => `${tableKey}.`, [tableKey]);

  useEffect(() => {
    const query = new URLSearchParams(search);

    if (query.keys().find((key) => key.startsWith(prefix))) {
      setParams(parseParams(query, tableKey, defaultSortField, defaultSortOrder));
    }
  }, [search, tableKey, prefix, defaultSortField, defaultSortOrder]);

  return params;
};

const parseParams = (
  query: URLSearchParams,
  tableKey: OppgaveTableKey,
  defaultSortField: SortFieldEnum,
  defaultSortOrder: SortOrderEnum,
) => {
  const [sortering = defaultSortField, rekkefoelge = defaultSortOrder] = fromSortingParam(
    query.get(`${tableKey}.${ShortParamKey.SORTERING}`),
  );

  const [ferdigstiltFrom, ferdigstiltTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.FERDIGSTILT}`));
  const [returnertFrom, returnertTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.RETURNERT}`));
  const [fristFrom, fristTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.FRIST}`));
  const [varsletFristFrom, varsletFristTo] = fromDateRangeParam(
    query.get(`${tableKey}.${ShortParamKey.VARSLET_FRIST}`),
  );

  return {
    typer: fromTyperParam(query.get(`${tableKey}.${ShortParamKey.TYPER}`)),
    ytelser: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.YTELSER}`)),
    hjemler: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.HJEMLER}`)),
    registreringshjemler: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.REGISTRERINGSHJEMLER}`)),
    tildelteSaksbehandlere: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`)),
    medunderskrivere: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`)),
    tildelteRol: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.TILDELTE_ROL}`)),
    sattPaaVentReasonIds: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.PAA_VENT_REASONS}`)),
    rekkefoelge,
    sortering,
    ferdigstiltFrom,
    ferdigstiltTo,
    returnertFrom,
    returnertTo,
    fristFrom,
    fristTo,
    varsletFristFrom,
    varsletFristTo,
  };
};
