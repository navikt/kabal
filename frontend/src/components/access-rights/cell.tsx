import { Keys } from '@app/keys';
import { HStack, Tooltip } from '@navikt/ds-react';

interface Props {
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
  children: string;
  onFocus: () => void;
  isFocused: boolean;
  isCurrentColumn: boolean;
  isCurrentRow: boolean;
}

export const Cell = ({ isChecked, onCheck, children, onFocus, isFocused, isCurrentColumn, isCurrentRow }: Props) => {
  const backgroundClass = VARIANTS[getVariant(isFocused, isCurrentColumn, isCurrentRow, isChecked)];

  return (
    <td
      className={`border-ax-border-neutral border-r-1 border-b-1 p-0 ${backgroundClass}`}
      onClick={onFocus}
      onKeyDown={({ key }) => {
        if (key === Keys.Enter || key === Keys.Space) {
          onFocus();
        }
      }}
      onMouseEnter={onFocus}
    >
      <Tooltip content={children} placement="right" className="pointer-events-none">
        <HStack height="32px" width="32px" align="center" justify="center" position="relative">
          <Icon isChecked={isChecked} isFocused={isFocused} />
          <input
            type="checkbox"
            className="absolute top-0 left-0 m-0 block h-full w-full cursor-pointer border-none p-0 opacity-0"
            checked={isChecked}
            onChange={({ target }) => onCheck(target.checked)}
          />
        </HStack>
      </Tooltip>
    </td>
  );
};

interface IconProps {
  isChecked: boolean;
  isFocused: boolean;
}

const Icon = ({ isChecked, isFocused }: IconProps) => {
  if (isChecked) {
    return <span className={isFocused ? 'opacity-30' : undefined}>✓</span>;
  }

  return <span className="opacity-60">{isFocused ? '✓' : ''}</span>;
};

enum Variant {
  CURRENT_CHECKED = 0,
  CURRENT_UNCHECKED = 1,
  CHECKED = 2,
  NONE = 3,
  FOCUSED_CHECKED = 4,
  FOCUSED_UNCHECKED = 5,
}

const VARIANTS: Record<Variant, string> = {
  [Variant.CURRENT_CHECKED]: 'bg-ax-bg-success-moderate-hover',
  [Variant.CURRENT_UNCHECKED]: 'bg-ax-bg-accent-moderate',
  [Variant.CHECKED]: 'bg-ax-bg-success-moderate-pressed',
  [Variant.NONE]: 'even:bg-ax-bg-default odd:bg-ax-bg-neutral-soft',
  [Variant.FOCUSED_CHECKED]: 'bg-ax-bg-success-moderate-hover',
  [Variant.FOCUSED_UNCHECKED]: 'bg-ax-bg-accent-moderate-hover',
};

const getVariant = (
  isFocused: boolean,
  isCurrentColumn: boolean,
  isCurrentRow: boolean,
  isChecked: boolean,
): Variant => {
  if (isFocused) {
    return isChecked ? Variant.FOCUSED_CHECKED : Variant.FOCUSED_UNCHECKED;
  }

  if (isCurrentColumn || isCurrentRow) {
    return isChecked ? Variant.CURRENT_CHECKED : Variant.CURRENT_UNCHECKED;
  }

  return isChecked ? Variant.CHECKED : Variant.NONE;
};
