import { employeeName, QUEUE, toKey } from '@app/components/behandling/behandlingsdialog/history/common';
import { HistoryColor, HistoryEvent } from '@app/components/behandling/behandlingsdialog/history/event';
import { useInnsendingshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import type { INavEmployee } from '@app/types/bruker';
import { HistoryEventTypes, type ITildelingEvent } from '@app/types/oppgavebehandling/response';
import { FradelReason } from '@app/types/oppgaver';
import { ArrowUndoIcon, PlusIcon } from '@navikt/aksel-icons';
import { HStack, Label, Tag } from '@navikt/ds-react';
import type React from 'react';
import { useId } from 'react';

export const getTildelingEvent = (e: ITildelingEvent) => {
  const key = toKey(e);
  const { actor, event, previous, timestamp } = e;
  const { saksbehandler } = event;

  const isFradeling = 'fradelingReasonId' in event;
  const toSelf = saksbehandler?.navIdent === actor?.navIdent;
  const previousSaksbehandler = previous.event.saksbehandler;

  if (toSelf) {
    return <ToSelf actor={actor} previousSaksbehandler={previousSaksbehandler} timestamp={timestamp} key={key} />;
  }

  const toQueue = saksbehandler === null;
  const toOther = !(toSelf || toQueue);

  if (toOther) {
    return <ToOther actor={actor} saksbehandler={saksbehandler} timestamp={timestamp} key={key} />;
  }

  if (isFradeling) {
    const { fradelingReasonId, hjemmelIdList } = event;
    const fromSelf = previousSaksbehandler === actor;
    const fromQueue = previousSaksbehandler === null;
    const fromOther = !(fromSelf || fromQueue);

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
    <p>
      {employeeName(actor)} tildelte seg saken fra
      {previousSaksbehandler === null ? ' felles kø.' : ` ${employeeName(previousSaksbehandler)}.`}
    </p>
  </HistoryEvent>
);

interface ToOtherProps {
  actor: INavEmployee | null;
  saksbehandler: INavEmployee;
  timestamp: string;
}

const ToOther = ({ actor, saksbehandler, timestamp }: ToOtherProps) => (
  <HistoryEvent tag="Tildeling" type={HistoryEventTypes.TILDELING} timestamp={timestamp} icon={PlusIcon}>
    <p>
      {employeeName(actor)} tildelte saken til {employeeName(saksbehandler)}.
    </p>
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
      borderColor={HistoryColor.WARNING_STRONG}
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
    borderColor={HistoryColor.NEUTRAL_SUBTLE}
    timestamp={timestamp}
    icon={ArrowUndoIcon}
  >
    <p>
      {employeeName(actor)} flyttet saken fra {employeeName(previousSaksbehandler)} til {QUEUE}.
    </p>
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
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Ukjent</b>.
        </p>
      );
    case FradelReason.ANNET:
      return (
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Annet</b>.
        </p>
      );
    case FradelReason.INHABIL:
      return (
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Inhabilitet</b>.
        </p>
      );
    case FradelReason.FEIL_HJEMMEL: {
      return (
        <>
          <p>
            {employeeName(actor)} la saken tilbake i {QUEUE}.
          </p>

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
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE} som leder.
        </p>
      );
    case FradelReason.LENGRE_FRAVÆR:
      return (
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Lengre fravær</b>.
        </p>
      );
    case FradelReason.MANGLER_KOMPETANSE:
      return (
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Manglende kompetanse</b>.
        </p>
      );
    case FradelReason.UTGÅTT:
      return (
        <p>
          {employeeName(actor)} la saken tilbake i {QUEUE}. Årsak: <b>Utgått</b>.
        </p>
      );
    case FradelReason.ANGRET:
      return (
        <p>
          {employeeName(actor)} angret på tildelingen og la saken tilbake i {QUEUE}.
        </p>
      );
  }
};

interface FlexRowContainerProps {
  children: React.ReactNode;
}

const FlexRowContainer = ({ children }: FlexRowContainerProps) => (
  <HStack align="center" gap="1">
    {children}
  </HStack>
);
