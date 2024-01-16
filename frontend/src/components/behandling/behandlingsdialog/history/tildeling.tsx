/* eslint-disable max-lines */
import { ArrowUndoIcon, PlusIcon } from '@navikt/aksel-icons';
import { Label, Tag } from '@navikt/ds-react';
import React, { useId } from 'react';
import { styled } from 'styled-components';
import { Line, getActorName, getName, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import { useInnsendingshjemlerMap } from '@app/simple-api-state/use-kodeverk';
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
  actor: string | null;
  previousSaksbehandler: string | null;
  timestamp: string;
}

const ToSelf = ({ actor, previousSaksbehandler, timestamp }: ToSelfProps) => (
  <HistoryEvent tag="Tildeling" type={HistoryEventTypes.TILDELING} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {getActorName(actor)} tildelte seg saken fra {getName(previousSaksbehandler)}.
    </Line>
  </HistoryEvent>
);

interface ToOtherProps {
  actor: string | null;
  saksbehandler: string | null;
  timestamp: string;
}

const ToOther = ({ actor, saksbehandler, timestamp }: ToOtherProps) => (
  <HistoryEvent tag="Tildeling" type={HistoryEventTypes.TILDELING} timestamp={timestamp} icon={PlusIcon}>
    <Line>
      {getActorName(actor)} tildelte saken til {getName(saksbehandler)}.
    </Line>
  </HistoryEvent>
);

interface FromSelfProps {
  actor: string | null;
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
  actor: string | null;
  previousSaksbehandler: string | null;
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
      {getActorName(actor)} flyttet saken fra {getName(previousSaksbehandler)} til felles kø.
    </Line>
  </HistoryEvent>
);

const getReason = (
  reasonId: FradelReason | null,
  actor: string | null,
  oldHjemler: string[] | null,
  newHjemler: string[] | null,
  labelId: string,
) => {
  switch (reasonId) {
    case null:
      return (
        <Line>
          {getActorName(actor)} la saken tilbake i <b>felles kø</b>. Årsak: <b>Ukjent</b>.
        </Line>
      );
    case FradelReason.ANNET:
      return (
        <Line>
          {getActorName(actor)} la saken tilbake i <b>felles kø</b>. Årsak: <b>Annet</b>.
        </Line>
      );
    case FradelReason.INHABIL:
      return (
        <Line>
          {getActorName(actor)} la saken tilbake i <b>felles kø</b>. Årsak: <b>Inhabilitet</b>.
        </Line>
      );
    case FradelReason.FEIL_HJEMMEL: {
      return (
        <>
          <Line>
            {getActorName(actor)} la saken tilbake i <b>felles kø</b>.
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
          {getActorName(actor)} la saken tilbake i <b>felles kø</b> som leder.
        </Line>
      );
    case FradelReason.LENGRE_FRAVÆR:
      return (
        <Line>
          {getActorName(actor)} la saken tilbake i <b>felles kø</b>. Årsak: <b>Lengre fravær</b>.
        </Line>
      );
    case FradelReason.MANGLER_KOMPETANSE:
      return (
        <Line>
          {getActorName(actor)} la saken tilbake i <b>felles kø</b>. Årsak: <b>Manglende kompetanse</b>.
        </Line>
      );
  }
};

const FlexRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
