import { MAX, MIN, STEP } from '@app/components/smart-editor/hooks/use-scale';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Keys, MOD_KEY_TEXT } from '@app/keys';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Radio, RadioGroup, TextField, Tooltip, VStack } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export const Scaling = () => {
  const { scale, setScale, scaleUp, scaleDown } = useContext(ScaleContext);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <HStack align="center" gap="space-8">
      <HStack align="center">
        <Tooltip content="Zoom ut" keys={[MOD_KEY_TEXT, Keys.Dash]}>
          <Button
            data-color="neutral"
            icon={<MinusIcon aria-hidden />}
            size="xsmall"
            variant="tertiary"
            onClick={scaleDown}
          />
        </Tooltip>
        <Tooltip content="Zoom">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={scale}
            onChange={(e) => setScale(Number.parseInt(e.target.value, 10))}
            className="w-52"
          />
        </Tooltip>
        <Tooltip content="Zoom inn" keys={[MOD_KEY_TEXT, Keys.Plus]}>
          <Button
            data-color="neutral"
            icon={<PlusIcon aria-hidden />}
            size="xsmall"
            variant="tertiary"
            onClick={scaleUp}
          />
        </Tooltip>
      </HStack>
      <div ref={ref} className="relative">
        <Button data-color="neutral" onClick={() => setIsOpen((o) => !o)} size="xsmall" variant="tertiary">
          {scale} %
        </Button>
        {isOpen ? <ScaleSelector close={() => setIsOpen(false)} /> : null}
      </div>
    </HStack>
  );
};

const PRESETS: string[] = ['75', '90', '100', '125', '150', '200'];
const CUSTOM = 'CUSTOM';

interface ScaleSelectorProps {
  close: () => void;
}

const ScaleSelector = ({ close }: ScaleSelectorProps) => {
  const { scale, setScale, scaleUp, scaleDown } = useContext(ScaleContext);
  const [inputValue, setInputValue] = useState<string>(scale.toString());

  const handleChange = (val: unknown) => {
    if (typeof val === 'string') {
      setScale(Number.parseInt(val, 10));
    }
  };

  useEffect(() => {
    setInputValue(scale.toString(10));
  }, [scale]);

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

      if (parsed < MIN) {
        return setScale(MIN);
      }

      return setScale(parsed);
    },
    [setScale],
  );

  return (
    <VStack asChild position="absolute" gap="space-8" className="bottom-full z-1 whitespace-nowrap">
      <Box background="default" padding="space-8" borderRadius="4" shadow="dialog">
        <RadioGroup legend="Skalering" onChange={handleChange} value={radioValue} size="small">
          {PRESETS.map((p) => (
            <Radio key={p} value={p} size="small">
              {p} %
            </Radio>
          ))}
          <Radio value={CUSTOM}>Egendefinert</Radio>
        </RadioGroup>
        <HStack align="center" gap="space-8">
          <TextField
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);

              const number = Number.parseInt(e.target.value, 10);

              if (!Number.isNaN(number) && number > 0) {
                setScale(number);
              }
            }}
            onBlur={() => setStringValue(inputValue)}
            onKeyDown={(e) => {
              switch (e.key) {
                case Keys.Enter:
                case Keys.Escape:
                  close();
                  break;
                case Keys.ArrowUp: {
                  e.preventDefault();
                  scaleUp();
                  break;
                }
                case Keys.ArrowDown: {
                  e.preventDefault();
                  scaleDown();
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
