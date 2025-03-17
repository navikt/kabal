import { BeregnetFrist } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/beregnet-frist';
import { MAX_MONTHS_FROM_TODAY } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/constants';
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
import { addMonths, addWeeks, isAfter, isValid } from 'date-fns';
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
            step={1}
            min={1}
            style={{ width: 70 }}
            onChange={({ target }) => {
              if (numberRegex.test(target.value) || target.value === '') {
                setTempValue(target.value);
              }

              const parsed = Number.parseInt(target.value, 10);

              if (!Number.isInteger(parsed)) {
                return setError(`Antall ${BEHANDLINGSTID_UNIT_TYPE_NAMES[typeId]} må være et heltall`);
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
const maxDate = addMonths(NOW, MAX_MONTHS_FROM_TODAY);

const validate = (
  units: number | null,
  type: BehandlingstidUnitType,
  varsletFrist: string | null,
): string | undefined => {
  if (units === null) {
    return undefined;
  }

  const rawDate = getRawDate(units, type);

  if (!isValid(rawDate)) {
    return 'Ugyldig verdi';
  }

  const withinMinDate = varsletFrist === null || isAfter(rawDate, new Date(varsletFrist));

  if (!withinMinDate) {
    return 'Fristen kan ikke være før forrige varslet frist';
  }

  const withinMaxDate = !isAfter(rawDate, maxDate);

  if (!withinMaxDate) {
    return 'Fristen kan ikke være mer enn fire måneder frem i tid';
  }

  return undefined;
};

const getRawDate = (units: number, typeId: BehandlingstidUnitType): Date => {
  switch (typeId) {
    case BehandlingstidUnitType.WEEKS:
      return addWeeks(NOW, units);
    case BehandlingstidUnitType.MONTHS:
      return addMonths(NOW, units);
  }
};
