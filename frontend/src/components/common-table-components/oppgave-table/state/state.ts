import { useLocation } from 'react-router';
import { ShortParamKey } from '@/components/common-table-components/oppgave-table/state/short-names';
import { fromDateRangeParam } from '@/components/common-table-components/oppgave-table/state/use-date-range';
import { fromSortingParam } from '@/components/common-table-components/oppgave-table/state/use-sort-state';
import { fromArrayParam, fromTyperParam } from '@/components/common-table-components/oppgave-table/state/use-state';
import type { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { usePrevious } from '@/hooks/use-previous';
import type {
  CommonOppgaverParams,
  FromDateSortKeys,
  SortFieldEnum,
  SortOrderEnum,
  ToDateSortKeys,
} from '@/types/oppgaver';

export const useOppgaveTableState = (
  tableKey: OppgaveTableKey,
  defaultSortField: SortFieldEnum,
  defaultSortOrder: SortOrderEnum,
): CommonOppgaverParams => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [sortering = defaultSortField, rekkefoelge = defaultSortOrder] = fromSortingParam(
    query.get(`${tableKey}.${ShortParamKey.SORTERING}`),
  );

  const [ferdigstiltFrom, ferdigstiltTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.FERDIGSTILT}`));
  const [returnertFrom, returnertTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.RETURNERT}`));
  const [fristFrom, fristTo] = fromDateRangeParam(query.get(`${tableKey}.${ShortParamKey.FRIST}`));
  const [varsletFristFrom, varsletFristTo] = fromDateRangeParam(
    query.get(`${tableKey}.${ShortParamKey.VARSLET_FRIST}`),
  );

  const prevFerdigstiltFrom = usePrevious(ferdigstiltFrom);
  const prevFerdigstiltTo = usePrevious(ferdigstiltTo);
  const prevReturnertFrom = usePrevious(returnertFrom);
  const prevReturnertTo = usePrevious(returnertTo);
  const prevFristFrom = usePrevious(fristFrom);
  const prevFristTo = usePrevious(fristTo);
  const prevVarsletFristFrom = usePrevious(varsletFristFrom);
  const prevVarsletFristTo = usePrevious(varsletFristTo);

  const params: CommonOppgaverParams = {
    typer: fromTyperParam(query.get(`${tableKey}.${ShortParamKey.TYPER}`)),
    ytelser: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.YTELSER}`)),
    hjemler: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.HJEMLER}`)),
    registreringshjemler: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.REGISTRERINGSHJEMLER}`)),
    tildelteSaksbehandlere: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`)),
    medunderskrivere: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`)),
    tildelteRol: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.TILDELTE_ROL}`)),
    sattPaaVentReasonIds: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.PAA_VENT_REASONS}`)),
    helperStatusList: fromArrayParam(query.get(`${tableKey}.${ShortParamKey.HELPER_STATUS}`)),
    rekkefoelge,
    sortering,
  };

  setDateParam(
    params,
    'ferdigstiltFrom',
    'ferdigstiltTo',
    ferdigstiltFrom,
    ferdigstiltTo,
    prevFerdigstiltFrom,
    prevFerdigstiltTo,
  );
  setDateParam(params, 'returnertFrom', 'returnertTo', returnertFrom, returnertTo, prevReturnertFrom, prevReturnertTo);
  setDateParam(params, 'fristFrom', 'fristTo', fristFrom, fristTo, prevFristFrom, prevFristTo);
  setDateParam(
    params,
    'varsletFristFrom',
    'varsletFristTo',
    varsletFristFrom,
    varsletFristTo,
    prevVarsletFristFrom,
    prevVarsletFristTo,
  );

  return params;
};

const setDateParam = (
  params: CommonOppgaverParams,
  fromKey: keyof FromDateSortKeys,
  toKey: keyof ToDateSortKeys,
  from: string | undefined,
  to: string | undefined,
  prevFrom: string | undefined,
  prevTo: string | undefined,
) => {
  // No change
  if (from === prevFrom && to === prevTo) {
    return;
  }

  // New complete date range set by user
  if (from !== undefined && to !== undefined) {
    params[fromKey] = from;
    params[toKey] = to;

    return;
  }

  // Reset
  if (from === undefined && to === undefined) {
    params[fromKey] = undefined;
    params[toKey] = undefined;

    return;
  }

  // User is not finished selecting a complete date range. Don't trigger a change until entire new range is set.
  if ((to === undefined && prevFrom !== undefined) || (from === undefined && prevTo !== undefined)) {
    params[fromKey] = prevFrom;
    params[toKey] = prevTo;

    return;
  }

  params[fromKey] = from;
  params[toKey] = to;
};
