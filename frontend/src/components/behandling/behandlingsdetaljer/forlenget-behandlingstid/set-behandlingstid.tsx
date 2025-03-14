import { BeregnetFrist } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/beregnet-frist';
import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { usePrevious } from '@app/hooks/use-previous';
import {
  useSetBehandlingstidUnitTypeMutation,
  useSetBehandlingstidUnitsMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES } from '@app/types/field-names';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR,
  BehandlingstidUnitType,
  isBehandlingstidUnitType,
} from '@app/types/svarbrev';
import { ErrorMessage, HStack, Heading, TextField, ToggleGroup, VStack } from '@navikt/ds-react';
import { addMonths, addWeeks, isAfter } from 'date-fns';
import { useEffect, useState } from 'react';

interface Props {
  typeId: BehandlingstidUnitType;
  units: number | null;
  varsletFrist: string | null;
  id: string;
  error: string | undefined;
  setError: (error: string | undefined) => void;
}

export const SetBehandlingstid = ({ id, typeId, units, varsletFrist, error, setError }: Props) => {
  const [setUnitType] = useSetBehandlingstidUnitTypeMutation({
    fixedCacheKey: id,
  });
  const [tempValue, setTempValue] = useState(units?.toString() ?? '');
  const [setUnits] = useSetBehandlingstidUnitsMutation({ fixedCacheKey: id });
  const prevVarsletFrist = usePrevious(varsletFrist);
  const { data: oppgave } = useOppgave();

  useEffect(() => {
    if (prevVarsletFrist === null && typeof varsletFrist === 'string') {
      setTempValue('');
    }
  }, [varsletFrist, prevVarsletFrist]);

  const parsed = Number.parseInt(tempValue, 10);
  const skip = Number.isNaN(parsed) || parsed === units || (tempValue === '' && units === null);
  useDebounce(() => setUnits({ varsletBehandlingstidUnits: parsed, id }), skip, parsed, 500);

  if (oppgave === undefined) {
    return null;
  }

  return (
    <HStack gap="2">
      <VStack gap="1" as="section">
        <Heading size="xsmall" style={{ fontSize: 16 }}>
          {UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.Behandlingstid]}
        </Heading>

        <HStack align="end" gap="2" as="section" id={UtvidetBehandlingstidFieldName.Behandlingstid}>
          <TextField
            label={`Antall ${BEHANDLINGSTID_UNIT_TYPE_NAMES[typeId]}`}
            hideLabel
            size="small"
            value={tempValue}
            type="number"
            min={1}
            style={{ width: 60 }}
            onChange={({ target }) => {
              if (numberRegex.test(target.value) || target.value === '') {
                setTempValue(target.value);
              }

              const parsed = Number.parseInt(target.value, 10);

              if (Number.isNaN(parsed)) {
                return setError('Fristen må være et tall.');
              }

              setError(validate(parsed, typeId, oppgave.varsletFrist));
            }}
          />

          <ToggleGroup
            style={{ width: 180 }}
            value={typeId}
            size="small"
            variant="neutral"
            onChange={(typeId) => {
              if (!isBehandlingstidUnitType(typeId)) {
                return;
              }

              setError(validate(units, typeId, oppgave.varsletFrist));

              setUnitType({ varsletBehandlingstidUnitTypeId: typeId, id }).unwrap();
            }}
          >
            {BEHANDLINGSTID_UNIT_TYPES.map((type) => (
              <ToggleGroup.Item
                key={type}
                value={type}
                label={
                  parsed === 1 ? BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR[type] : BEHANDLINGSTID_UNIT_TYPE_NAMES[type]
                }
              />
            ))}
          </ToggleGroup>
        </HStack>
        {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </VStack>
      <BeregnetFrist units={parsed} typeId={typeId} />
    </HStack>
  );
};

const numberRegex = /^[0-9]+$/;
const NOW = new Date();
const maxDate = addMonths(NOW, 4);

const getWithinMaxDate = (units: number, type: BehandlingstidUnitType) => {
  switch (type) {
    case BehandlingstidUnitType.WEEKS:
      return !isAfter(addWeeks(NOW, units), maxDate);
    case BehandlingstidUnitType.MONTHS:
      return !isAfter(addMonths(NOW, units), maxDate);
  }
};

const getWithinMinDate = (units: number, type: BehandlingstidUnitType, existingVarsletFrist: string | null) => {
  if (existingVarsletFrist === null) {
    return true;
  }

  switch (type) {
    case BehandlingstidUnitType.WEEKS:
      return isAfter(addWeeks(NOW, units), new Date(existingVarsletFrist));
    case BehandlingstidUnitType.MONTHS:
      return isAfter(addMonths(NOW, units), new Date(existingVarsletFrist));
  }
};

const validate = (
  units: number | null,
  type: BehandlingstidUnitType,
  varsletFrist: string | null,
): string | undefined => {
  if (units === null) {
    return undefined;
  }

  const withinMinDate = getWithinMinDate(units, type, varsletFrist);

  if (!withinMinDate) {
    return 'Fristen kan ikke være før forrige varslet frist';
  }

  const withinMaxDate = getWithinMaxDate(units, type);

  if (!withinMaxDate) {
    return 'Fristen kan ikke være mer enn fire måneder frem i tid';
  }

  return undefined;
};
