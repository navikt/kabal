import { ScalePreviewSvg } from '@app/components/settings/pdf-scale/preview-svg';
import type { PdfScaleMode } from '@app/hooks/settings/use-setting';
import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react';

interface Option {
  label: string;
  scaleMode: PdfScaleMode;
  icon: React.ReactNode;
  description: string;
  customScale?: number;
  interactiveContent?: React.ReactNode;
}

interface Props {
  value: PdfScaleMode;
  onChange: (value: PdfScaleMode) => void;
  options: Option[];
}

export const PdfScaleModeToggle = ({ value, onChange, options }: Props) => (
  <HStack role="radiogroup" wrap justify="start" gap="space-4">
    {options.map((o) => (
      <ToggleButton key={o.scaleMode} {...o} selected={value === o.scaleMode} onClick={() => onChange(o.scaleMode)} />
    ))}
  </HStack>
);

interface ToggleButtonProps extends Option {
  selected: boolean;
  onClick: () => void;
}

const ToggleButton = ({
  label,
  icon,
  description,
  selected,
  onClick,
  interactiveContent,
  ...rest
}: ToggleButtonProps) => (
  <Box
    asChild
    borderRadius="4"
    borderWidth="1"
    borderColor="neutral"
    width="340px"
    className={
      selected
        ? 'bg-ax-bg-accent-strong-pressed text-ax-text-accent-contrast hover:bg-ax-bg-accent-strong-hover'
        : 'bg-ax-bg-default text-ax-text-neutral hover:bg-ax-bg-accent-strong-hover hover:text-ax-text-accent-contrast'
    }
  >
    <VStack>
      {/** biome-ignore lint/a11y/useSemanticElements: Option in radio group. */}
      <button
        type="button"
        role="radio"
        onClick={onClick}
        className="grow cursor-pointer p-2"
        aria-checked={selected}
        tabIndex={0}
      >
        <VStack gap="space-8" height="100%">
          <HStack align="center" justify="center" gap="space-4" className="font-ax-bold">
            {icon}
            <span>{label}</span>
          </HStack>

          <ScalePreviewSvg title={label} {...rest} />

          <BodyShort size="small" className="italic">
            {description}
          </BodyShort>
        </VStack>
      </button>

      {interactiveContent}
    </VStack>
  </Box>
);
