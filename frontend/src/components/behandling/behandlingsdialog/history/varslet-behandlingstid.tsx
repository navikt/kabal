import { PartNameAndIdentifikator } from '@app/components/part-name-and-identifikator/part-name-and-identifikator';
import { isoDateToPretty } from '@app/domain/date';
import { HistoryEventTypes, type IPart, type IVarsletBehandlingstidEvent } from '@app/types/oppgavebehandling/response';
import {
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR,
  type BehandlingstidUnitType,
} from '@app/types/svarbrev';
import { ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';
import { toKey } from './common';
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
    <p>Varslet behandlingstid ble satt.</p>

    <Begrunnelse {...props} />

    <ChangedFrist {...props} />
    <ChangedMottakere {...props} />
  </HistoryEvent>
);

const ChangedMottakere = ({ event }: IVarsletBehandlingstidEvent) => {
  if (event === null || event.doNotSendLetter) {
    return null;
  }

  const to: IPart[] = event.mottakere ?? [];

  return (
    <VStack gap="1" as="section" aria-label="Mottakere">
      Mottakere av varsel:
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

const ListItemPart = (part: IPart) => (
  <li className="m-0 font-normal">
    <PartNameAndIdentifikator {...part} />
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
      <p>
        Varslet frist:{' '}
        <b>
          {getUnits(newUnits, newType)}
          {toDate}
        </b>
      </p>
    );
  }

  if (newFrist !== null) {
    return (
      <p>
        Varslet frist: <b>{isoDateToPretty(newFrist)}</b>
      </p>
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

const Begrunnelse = ({ event }: IVarsletBehandlingstidEvent) => {
  if (event === null || event.reasonNoLetter === null) {
    return null;
  }

  return (
    <p>
      Begrunnelse for hvorfor det ikke ble sendt brev: <i>{event.reasonNoLetter}</i>
    </p>
  );
};
