import { isoDateToPretty } from '@app/domain/date';
import { formatIdNumber } from '@app/functions/format-id';
import { HistoryEventTypes, type IPart, type IVarsletBehandlingstidEvent } from '@app/types/oppgavebehandling/response';
import { BEHANDLINGSTID_UNIT_TYPE_NAMES, type BehandlingstidUnitType } from '@app/types/svarbrev';
import { ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';
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

const ChangedMottakere = ({ previous, event }: IVarsletBehandlingstidEvent) => {
  if (event === null) {
    return null;
  }

  const from: IPart[] = previous.event.mottakere ?? [];
  const to: IPart[] = event.mottakere ?? [];

  const changedMottakere = to.length !== from.length || to.some((m) => !from.some((p) => p.id === m.id));

  if (!changedMottakere) {
    return null;
  }

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
    <StyledList>
      {mottakere.map((p) => (
        <ListItemPart key="id" {...p} />
      ))}
    </StyledList>
  );
};

const ListItemPart = ({ id, name }: IPart) => (
  <StyledListItem>
    {name} ({formatIdNumber(id)})
  </StyledListItem>
);

const ChangedFrist = ({ previous, event }: IVarsletBehandlingstidEvent) => {
  if (event === null) {
    return null;
  }

  const changedFrist =
    event.varsletBehandlingstidUnits !== previous.event.varsletBehandlingstidUnits ||
    event.varsletBehandlingstidUnitTypeId !== previous.event.varsletBehandlingstidUnitTypeId;

  if (!changedFrist) {
    return null;
  }

  const toDate = event.varsletFrist === null ? null : ` (${isoDateToPretty(event.varsletFrist)})`;

  return (
    <Line>
      Behandlingstid:{' '}
      <b>
        {getUnits(event.varsletBehandlingstidUnits, event.varsletBehandlingstidUnitTypeId)}
        {toDate}
      </b>
    </Line>
  );
};

const getUnits = (units: number | null, unitTypeId: BehandlingstidUnitType | null) => {
  if (units !== null && unitTypeId !== null) {
    return `${units} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[unitTypeId]}`;
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

const StyledList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  list-style-type: disc;
`;

const StyledListItem = styled.li`
  margin: 0;
  font-weight: normal;
`;
