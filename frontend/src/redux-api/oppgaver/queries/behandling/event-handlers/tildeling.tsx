import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { QUEUE, SELF, employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { TildelingEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { INavEmployee } from '@app/types/bruker';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type ITildelingEvent } from '@app/types/oppgavebehandling/response';
import { FradelReason } from '@app/types/oppgaver';
/* eslint-disable max-lines */
import { Label, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const handleTildelingEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, fradelingReasonId, saksbehandler, hjemmelIdList }: TildelingEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (draft.saksbehandler === saksbehandler || draft.saksbehandler?.navIdent === saksbehandler?.navIdent) {
        draft.modified = timestamp;

        return draft;
      }

      if (userId !== actor.navIdent) {
        const content = getToastContent(
          actor,
          draft.saksbehandler,
          saksbehandler,
          userId,
          fradelingReasonId,
          draft.hjemmelIdList,
          hjemmelIdList,
          'tildeling',
        );

        if (content !== null) {
          toast.info(content);
        }
      }

      draft.saksbehandler = saksbehandler;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const previous = history.tildeling.at(0);

          if (previous === undefined) {
            history.tildeling = [
              {
                actor,
                timestamp,
                type: HistoryEventTypes.TILDELING,
                event: { saksbehandler, fradelingReasonId, hjemmelIdList },
                previous: {
                  actor: null,
                  timestamp,
                  event: { saksbehandler: null, fradelingReasonId: null, hjemmelIdList: null },
                  type: HistoryEventTypes.TILDELING,
                },
              },
            ];

            return history;
          }

          const tildelingEvent: ITildelingEvent = {
            actor,
            timestamp,
            event: { saksbehandler, fradelingReasonId, hjemmelIdList },
            type: HistoryEventTypes.TILDELING,
            previous,
          };

          history.tildeling = [tildelingEvent, ...history.tildeling];

          return history;
        }),
      );
    });
  };

const getToastContent = (
  actor: INavEmployee,
  from: INavEmployee | null,
  to: INavEmployee | null,
  userId: string,
  reasonId: FradelReason | null,
  oldHjemler: string[] | null,
  newHjemler: string[] | null,
  labelId: string,
): React.JSX.Element | null => {
  if (from === null && to === null) {
    return null;
  }

  if (from === null) {
    return (
      <InfoToast title="Tildelt">
        {employeeName(actor)} har tildelt saken til {SELF} fra {QUEUE}.
      </InfoToast>
    );
  }

  if (to === null) {
    const fromText =
      from === null ? null : (
        <>
          {' fra '}
          <b>{getFromText(userId, from)}</b>
        </>
      );

    switch (reasonId) {
      case null:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText}. Årsak: <b>Ukjent</b>.
          </InfoToast>
        );
      case FradelReason.ANNET:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText}. Årsak: <b>Annet</b>.
          </InfoToast>
        );
      case FradelReason.INHABIL:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText}. Årsak: <b>Inhabilitet</b>.
          </InfoToast>
        );
      case FradelReason.FEIL_HJEMMEL: {
        return (
          <InfoToast title="Fradelt">
            <>
              {employeeName(actor)} la saken tilbake i {QUEUE}
              {fromText}.
            </>

            <FlexRowContainer>
              <Label size="small" htmlFor={labelId}>
                Årsak
              </Label>
              <Tag size="xsmall" variant="info-moderate" id={labelId}>
                Feil {oldHjemler !== null && oldHjemler.length === 1 ? 'hjemmel' : 'hjemler'}
              </Tag>
            </FlexRowContainer>

            <FlexRowContainer>
              <Label size="small" id={labelId}>
                Gamle
              </Label>
              {oldHjemler?.map((h) => (
                <Tag size="xsmall" variant="neutral" key={h} aria-labelledby={labelId}>
                  {h}
                </Tag>
              )) ?? (
                <Tag size="xsmall" variant="neutral" aria-labelledby={labelId}>
                  ingen
                </Tag>
              )}
            </FlexRowContainer>

            <FlexRowContainer>
              <Label size="small" id={labelId}>
                Nye
              </Label>
              {newHjemler?.map((h) => (
                <Tag size="xsmall" variant="success" key={h} aria-labelledby={labelId}>
                  {h}
                </Tag>
              )) ?? (
                <Tag size="xsmall" variant="neutral" aria-labelledby={labelId}>
                  ingen
                </Tag>
              )}
            </FlexRowContainer>
          </InfoToast>
        );
      }
      case FradelReason.LEDER:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText} som leder.
          </InfoToast>
        );
      case FradelReason.LENGRE_FRAVÆR:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText}. Årsak: <b>Lengre fravær</b>.
          </InfoToast>
        );
      case FradelReason.MANGLER_KOMPETANSE:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} la saken tilbake i {QUEUE}
            {fromText}. Årsak: <b>Manglende kompetanse</b>.
          </InfoToast>
        );
      case FradelReason.UTGÅTT:
        return (
          <InfoToast title="Fradelt">
            {employeeName(from)} jobber ikke lenger i NAV. Saken er lagt tilbake i {QUEUE}.
          </InfoToast>
        );
      case FradelReason.ANGRET:
        return (
          <InfoToast title="Fradelt">
            {employeeName(actor)} angret på tildelingen og la saken tilbake i {QUEUE}.
          </InfoToast>
        );
    }
  }

  const fromText = getFromText(userId, from);

  if (to.navIdent === actor.navIdent) {
    return (
      <InfoToast title="Tildeling endret">
        {employeeName(actor)} har tildelt saken til {SELF} fra {fromText}.
      </InfoToast>
    );
  }

  return (
    <InfoToast title="Tildeling endret">
      {employeeName(actor)} har tildelt saken til {getFromText(userId, to)} fra {fromText}.
    </InfoToast>
  );
};

const FlexRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;

const getFromText = (userId: string, employee: INavEmployee | null) => {
  if (employee === null) {
    return QUEUE;
  }

  return employee.navIdent === userId ? <b>deg</b> : employeeName(employee);
};
