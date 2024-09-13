import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { formatIdNumber } from '@app/functions/format-id';
import type { INavEmployee } from '@app/types/bruker';
import { HistoryEventTypes, type IHistory, type IPart } from '@app/types/oppgavebehandling/response';
import { styled } from 'styled-components';

type KeySource = Pick<IHistory, 'type' | 'timestamp'>;

export const toKey = (event: KeySource) => `${event.type}:${event.timestamp}`;

export const employeeName = (employee: INavEmployee | null, fallback = '[Ukjent bruker]') => (
  <b>{formatEmployeeNameAndIdFallback(employee, fallback)}</b>
);

export const QUEUE = <b>felles kø</b>;
export const SELF = <b>seg selv</b>;

export const partName = ({ name, id }: IPart) => (
  <b>
    {name} ({formatIdNumber(id)})
  </b>
);

export const Line = styled.p`
  margin: 0;
  padding: 0;
`;

export const Reason = styled.p`
  margin: 0;
  padding: 0;
  font-style: italic;
  padding-left: var(--a-spacing-1);
  border-left: var(--a-spacing-1) solid var(--a-border-subtle);
`;

export const HISTORY_COLORS: Record<HistoryEventTypes, string> = {
  [HistoryEventTypes.TILDELING]: '--a-surface-alt-3-moderate',
  [HistoryEventTypes.KLAGER]: '--a-surface-alt-2-moderate',
  [HistoryEventTypes.FULLMEKTIG]: '--a-surface-info-moderate',
  [HistoryEventTypes.SATT_PAA_VENT]: '--a-gray-200',
  [HistoryEventTypes.ROL]: '--a-surface-alt-1-moderate',
  [HistoryEventTypes.MEDUNDERSKRIVER]: '--a-blue-200',
  [HistoryEventTypes.FERDIGSTILT]: '--a-surface-success-moderate',
  [HistoryEventTypes.FEILREGISTRERT]: '--a-surface-danger-moderate',
  [HistoryEventTypes.VARSLET_BEHANDLINGSTID]: '--a-surface-warning',
};
