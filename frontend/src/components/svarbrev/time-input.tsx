import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  type BehandlingstidUnitType,
  isBehandlingstidUnitType,
} from '@app/types/svarbrev';
import { TextField, ToggleGroup } from '@navikt/ds-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  unit: BehandlingstidUnitType;
  setUnit: (unit: BehandlingstidUnitType) => void;
}

export const TimeInput = ({ value, onChange, unit, setUnit }: Props) => (
  <>
    <TextField
      size="small"
      type="number"
      inputMode="numeric"
      min={1}
      value={value}
      onChange={({ target }) => onChange(Number.parseInt(target.value, 10))}
      label="Saksbehandlingstid"
      hideLabel
      className="w-15"
    />

    <ToggleGroup
      value={unit}
      onChange={(v) => setUnit(isBehandlingstidUnitType(v) ? v : unit)}
      size="small"
      variant="neutral"
    >
      {BEHANDLINGSTID_UNIT_TYPES.map((type) => (
        <ToggleGroup.Item key={type} value={type} label={BEHANDLINGSTID_UNIT_TYPE_NAMES[type]} />
      ))}
    </ToggleGroup>
  </>
);
