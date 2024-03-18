/* eslint-disable max-lines */
import { ArrowUndoIcon, PlusIcon } from '@navikt/aksel-icons';
import { Label, Tag } from '@navikt/ds-react';
import React, { useId } from 'react';
import { styled } from 'styled-components';
import { Line, QUEUE, employeeName, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import { useInnsendingshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import { INavEmployee } from '@app/types/bruker';
import { HistoryEventTypes, ITildelingEvent } from '@app/types/oppgavebehandling/response';
import { FradelReason } from '@app/types/oppgaver';

export const getTildelingEvent = (e: ITildelingEvent) => {
  const key = toKey(e);
  const { actor, event, previous, timestamp } = e;
  const { saksbehandler } = event;

  const isFradeling = 'fradelingReasonId' in event;
  const toSelf = saksbehandler === actor;
  const previousSaksbehandler = previous.event.saksbehandler;

  if (toSelf) {
    return <ToSelf actor={actor} previousSaksbehandler={previousSaksbehandler} timestamp={timestamp} key={key} />;
  }

  const toQueue = saksbehandler === null;
  const toOther = !toSelf && !toQueue;

  if (toOther) {
    return <ToOther actor={actor} saksbehandler={saksbehandler} timestamp={timestamp} key={key} />;
  }

  if (isFradeling) {
    const { fradelingReasonId, hjemmelIdList } = event;
    const fromSelf = previousSaksbehandler === actor;
    const fromQueue = previousSaksbehandler === null;
    const fromOther = !fromSelf && !fromQueue;

    if (fromSelf) {
      return (
        <FromSelf
          actor={actor}
          fradelingReasonId={fradelingReasonId}
          previousHjemmelIdList={previous.event.hjemmelIdList}
          hjemmelIdList={hjemmelIdList}
          timestamp={timestamp}
          key={key}
        />
      );
    }

    if (fromOther) {
      return (
        <FromOther actor={actor} previousSaksbehandler={previous.event.saksbehandler} timestamp={timestamp} key={key} />
      );
    }
  }

  return null;
};

interface ToSelfProps {
  actor: INavEmployee | null;
  previousSaksbehandler: INavEmployee | null;
  timestamp: string;
}

const ToSelf = ({ actor, previousSaksbehandler, timestamp }: ToSelfProps) => (
  <HistoryEvent tag="Tildeling" type={HistoryEventTypes.TILDELING} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {employeeName(actor)} tildelte seg saken fra {employeeName(previousSaksbehandler)}.
    </Line>
  </HistoryEvent>
);

interface ToOtherProps {
  actor: INavEmployee | null;
  saksbehandler: INavEmployee;
  timestamp: string;
}

const ToOther = ({ actor, saksbehandler, timestamp }: ToOtherProps) => (
  <HistoryEvent tag="Tildeling" type={HistoryEventTypes.TILDELING} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {employeeName(actor)} tildelte saken til {employeeName(saksbehandler)}.
    </Line>
  </HistoryEvent>
);

interface FromSelfProps {
  actor: INavEmployee | null;
  fradelingReasonId: FradelReason | null;
  previousHjemmelIdList: string[] | null;
  hjemmelIdList: string[] | null;
  timestamp: string;
}

const FromSelf = ({ actor, fradelingReasonId, previousHjemmelIdList, hjemmelIdList, timestamp }: FromSelfProps) => {
  const labelId = useId();
  const { data: innsendingshjemlerMap = {} } = useInnsendingshjemlerMap();

  const oldHjemler =
    previousHjemmelIdList === null ? null : previousHjemmelIdList.map((id) => innsendingshjemlerMap[id] ?? id);
  const newHjemler = hjemmelIdList?.map((id) => innsendingshjemlerMap[id] ?? id) ?? null;

  return (
    <HistoryEvent
      tag="Fradeling"
      type={HistoryEventTypes.TILDELING}
      color="--a-surface-warning-moderate"
      timestamp={timestamp}
      icon={ArrowUndoIcon}
    >
      {getReason(fradelingReasonId, actor, oldHjemler, newHjemler, labelId)}
    </HistoryEvent>
  );
};

interface FromOtherProps {
  actor: INavEmployee | null;
  previousSaksbehandler: INavEmployee | null;
  timestamp: string;
}

const FromOther = ({ actor, previousSaksbehandler, timestamp }: FromOtherProps) => (
  <HistoryEvent
    tag="Fradeling"
    type={HistoryEventTypes.TILDELING}
    color="--a-surface-warning-moderate"
    timestamp={timestamp}
    icon={ArrowUndoIcon}
  >
    <Line>
      {employeeName(actor)} flyttet saken fra {employeeName(previousSaksbehandler)} til {QUEUE}.
    </Line>
  </HistoryEvent>
);

const getReason = (
  reasonId: FradelReason | null,
  actor: INavEmployee | null,
  oldHjemler: string[] | null,
  newHjemler: string[] | null,
  labelId: string,
) => {
  switch (reasonId) {
    case null:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Ukjent</b>.
        </Line>
      );
    case FradelReason.ANNET:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Annet</b>.
        </Line>
      );
    case FradelReason.INHABIL:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Inhabilitet</b>.
        </Line>
      );
    case FradelReason.FEIL_HJEMMEL: {
      return (
        <>
          <Line>
            {employeeName(actor)} la saken tilbake i {QUEUE}.
          </Line>

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
        </>
      );
    }
    case FradelReason.LEDER:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE} som leder.
        </Line>
      );
    case FradelReason.LENGRE_FRAVÆR:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Lengre fravær</b>.
        </Line>
      );
    case FradelReason.MANGLER_KOMPETANSE:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Manglende kompetanse</b>.
        </Line>
      );
    case FradelReason.UTGÅTT:
      return (
        <Line>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Utgått</b>.
        </Line>
      );
    case FradelReason.ANGRET:
      return (
        <Line>
          {employeeName(actor)} angret på tildelingen og la saken tilbake i {QUEUE}.
        </Line>
      );
  }
};

const FlexRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
