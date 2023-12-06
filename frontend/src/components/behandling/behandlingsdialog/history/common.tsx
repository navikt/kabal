import React from 'react';
import { styled } from 'styled-components';
import { Name } from '@app/components/behandling/behandlingsdialog/common/name';
import { HistoryEventTypes, IHistory } from '@app/types/oppgavebehandling/response';

export const getName = (navIdent: string | null, fallback: string = 'felles kø') => (
  <b>{navIdent === null ? fallback : <Name navIdent={navIdent} />}</b>
);

export const toKey = (event: IHistory) => `${event.type}:${event.timestamp}`;

export const getActorName = (navIdent: string | null) => getName(navIdent, '[Ukjent bruker]');

export const Line = styled.p`
  margin: 0;
  padding: 0;
`;

export const Reason = styled.p`
  margin: 0;
  padding: 0;
  font-style: italic;
  padding-left: 4px;
  border-left: 4px solid var(--a-border-subtle);
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
};
