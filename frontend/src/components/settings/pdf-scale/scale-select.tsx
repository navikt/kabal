import { MAX, MIN } from '@app/components/settings/pdf-scale/constants';
import { clamp } from '@app/functions/clamp';
import { Box, HStack, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';

const PRESETS: string[] = ['75', '90', '100', '125', '150', '200', '300'];
const CUSTOM = 'CUSTOM';

interface ScaleSelectProps {
  scale: number;
  setScale: (scale: number) => void;
  scaleUp: () => number;
  scaleDown: () => number;
  close: () => void;
}

export const ScaleSelect = ({ scale, setScale, scaleUp, scaleDown, close }: ScaleSelectProps) => {
  const [inputValue, setInputValue] = useState<string>(scale.toString(10));

  const onRadioChange = (val: unknown) => {
    if (val === CUSTOM) {
      setInputValue(scale.toString(10));

      return;
    }

    if (typeof val !== 'string') {
      return;
    }

    const parsed = Number.parseInt(val, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    setScale(parsed);
    setInputValue(parsed.toString(10));
  };

  const stringValue = scale.toString();
  const radioValue = PRESETS.includes(stringValue) ? stringValue : CUSTOM;

  const setStringValue = useCallback(
    (newStringValue: string) => {
      if (newStringValue.length === 0) {
        return;
      }

      const parsed = Number.parseInt(newStringValue, 10);

      if (Number.isNaN(parsed)) {
        return;
      }

      const clamped = clamp(parsed, MIN, MAX);

      setInputValue(clamped.toString(10));
      setScale(clamped);
    },
    [setScale],
  );

  return (
    <VStack
      asChild
      position="absolute"
      gap="2"
      className="top-full right-0 z-10 whitespace-nowrap text-(--a-text-default) not-italic"
    >
      <Box background="bg-default" padding="2" borderRadius="medium" shadow="medium">
        <RadioGroup legend="Skalering" onChange={onRadioChange} value={radioValue} size="small">
          {PRESETS.map((p) => (
            <Radio key={p} value={p} size="small">
              {p} %
            </Radio>
          ))}
          <Radio value={CUSTOM} disabled>
            Egendefinert
          </Radio>
        </RadioGroup>
        <HStack align="center" gap="2" wrap={false}>
          <TextField
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);

              const number = Number.parseInt(e.target.value, 10);

              if (!Number.isNaN(number)) {
                setScale(clamp(number, MIN, MAX));
              }
            }}
            onBlur={() => setStringValue(inputValue)}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'Enter':
                case 'Escape':
                  close();
                  break;
                case 'ArrowUp': {
                  e.preventDefault();
                  setInputValue(scaleUp().toString(10));
                  break;
                }
                case 'ArrowDown': {
                  e.preventDefault();
                  setInputValue(scaleDown().toString(10));
                  break;
                }
              }
            }}
            size="small"
            label="Skalering"
            hideLabel
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <span>%</span>
        </HStack>
      </Box>
    </VStack>
  );
};
