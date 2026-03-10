import { MAX, MIN, STEP, USER_STEP } from '@app/components/settings/pdf-scale/constants';
import { ScaleSelect } from '@app/components/settings/pdf-scale/scale-select';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props {
  scale: number;
  onChange: (scale: number) => number;
}

export const CustomScale = ({ scale, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const scaleDown = () => onChange(snapDown(scale));
  const scaleUp = () => onChange(snapUp(scale));

  return (
    <Box
      asChild
      background="default"
      padding="space-4"
      borderRadius="4"
      marginBlock="space-0 space-8"
      marginInline="space-8"
    >
      <HStack align="center" justify="center" gap="space-8">
        <HStack align="center">
          <Button
            data-color="neutral"
            icon={<MinusIcon aria-hidden />}
            size="xsmall"
            variant="tertiary"
            onClick={scaleDown}
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={scale}
            onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
          />
          <Button
            data-color="neutral"
            icon={<PlusIcon aria-hidden />}
            size="xsmall"
            variant="tertiary"
            onClick={scaleUp}
          />
        </HStack>

        <div ref={ref} className="relative">
          <Button
            data-color="neutral"
            onClick={() => setIsOpen((o) => !o)}
            size="xsmall"
            variant="tertiary"
            className="w-16"
          >
            {scale} %
          </Button>
          {isOpen ? (
            <ScaleSelect
              scale={scale}
              setScale={onChange}
              scaleUp={scaleUp}
              scaleDown={scaleDown}
              close={() => setIsOpen(false)}
            />
          ) : null}
        </div>
      </HStack>
    </Box>
  );
};

const snapUp = (value: number) => {
  if (value === MAX) {
    return value;
  }

  return value + USER_STEP - (value % USER_STEP);
};

const snapDown = (value: number) => {
  if (value === MIN) {
    return value;
  }

  const rest = value % USER_STEP;

  if (rest === 0) {
    return value - USER_STEP;
  }

  return value - rest;
};
