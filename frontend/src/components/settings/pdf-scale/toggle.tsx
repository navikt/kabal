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
  <HStack role="radiogroup" wrap justify="start" gap="1">
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
    background={selected ? 'surface-action-selected' : 'bg-default'}
    borderRadius="medium"
    borderWidth="1"
    borderColor="border-divider"
    width="340px"
    className={
      selected ? 'text-(--a-text-on-action)' : 'text-(--a-text-default) hover:bg-(--a-surface-action-subtle-hover)'
    }
  >
    <VStack>
      <button
        type="button"
        // biome-ignore lint/a11y/useSemanticElements: Option in radio group.
        role="radio"
        onClick={onClick}
        className="grow cursor-pointer p-2"
        aria-checked={selected}
        tabIndex={0}
      >
        <VStack gap="2" height="100%">
          <HStack align="center" justify="center" gap="1" className="font-bold">
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
