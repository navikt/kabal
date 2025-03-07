import { isoDateToPretty } from '@app/domain/date';
import { formatIdNumber } from '@app/functions/format-id';
import { HistoryEventTypes, type IPart, type IVarsletBehandlingstidEvent } from '@app/types/oppgavebehandling/response';
import {
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR,
  type BehandlingstidUnitType,
} from '@app/types/svarbrev';
import { ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';
import { Line, employeeName, toKey } from './common';
import { HistoryEvent } from './event';

export const getVarsletBehandlingstidEvent = (props: IVarsletBehandlingstidEvent) => (
  <VarsletBehandlingstid key={toKey(props)} {...props} />
);

const VarsletBehandlingstid = (props: IVarsletBehandlingstidEvent) => (
  <HistoryEvent
    tag="Varslet behandlingstid"
    type={HistoryEventTypes.VARSLET_BEHANDLINGSTID}
    timestamp={props.timestamp}
    icon={ClockIcon}
  >
    <Line>{employeeName(props.actor)} satt varslet behandlingstid.</Line>

    <ChangedFrist {...props} />
    <ChangedMottakere {...props} />
  </HistoryEvent>
);

const ChangedMottakere = ({ event }: IVarsletBehandlingstidEvent) => {
  if (event === null) {
    return null;
  }

  const to: IPart[] = event.mottakere ?? [];

  return (
    <VStack gap="1" as="section" aria-label="Mottakere">
      Mottakere:
      <Mottakere mottakere={to} />
    </VStack>
  );
};

const Mottakere = ({ mottakere }: { mottakere: IPart[] }) => {
  if (mottakere.length === 0) {
    return <BodyShort size="small">Ingen</BodyShort>;
  }

  return (
    <ul className="m-0 list-disc pl-5">
      {mottakere.map((p) => (
        <ListItemPart key="id" {...p} />
      ))}
    </ul>
  );
};

const ListItemPart = ({ id, name }: IPart) => (
  <li className="m-0 font-normal">
    {name} ({formatIdNumber(id)})
  </li>
);

const ChangedFrist = ({ previous, event }: IVarsletBehandlingstidEvent) => {
  if (event === null) {
    return null;
  }

  const prevUnits = previous.event.varsletBehandlingstidUnits;
  const prevType = previous.event.varsletBehandlingstidUnitTypeId;
  const newUnits = event.varsletBehandlingstidUnits;
  const newType = event.varsletBehandlingstidUnitTypeId;
  const newFrist = event.varsletFrist;

  const changedRelative = newUnits !== prevUnits || newType !== prevType;

  if (changedRelative && (newUnits !== null || newType !== null)) {
    const toDate = newFrist === null ? null : ` (${isoDateToPretty(newFrist)})`;

    return (
      <Line>
        Varslet frist:{' '}
        <b>
          {getUnits(newUnits, newType)}
          {toDate}
        </b>
      </Line>
    );
  }

  if (newFrist !== null) {
    return (
      <Line>
        Varslet frist: <b>{isoDateToPretty(newFrist)}</b>
      </Line>
    );
  }
};

const getUnits = (units: number | null, unitTypeId: BehandlingstidUnitType | null) => {
  if (units !== null && unitTypeId !== null) {
    return `${units} ${units === 1 ? BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR[unitTypeId] : BEHANDLINGSTID_UNIT_TYPE_NAMES[unitTypeId]}`;
  }

  if (units === null && unitTypeId !== null) {
    return `<Antall ikke satt> ${BEHANDLINGSTID_UNIT_TYPE_NAMES[unitTypeId]}`;
  }

  if (units !== null && unitTypeId === null) {
    return `${units} <Enhet ikke satt>`;
  }

  if (units === null && unitTypeId === null) {
    return '<Ikke satt>';
  }
};
