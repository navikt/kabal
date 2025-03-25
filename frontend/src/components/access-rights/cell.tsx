import { Keys } from '@app/keys';

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
      className={`border-border-on-inverted border-r-1 border-b-1 p-0 ${backgroundClass}`}
      title={children}
      onClick={onFocus}
      onKeyDown={({ key }) => {
        if (key === Keys.Enter || key === Keys.Space) {
          onFocus();
        }
      }}
      onMouseEnter={onFocus}
    >
      <input
        type="checkbox"
        className="m-0 block h-8 w-8 cursor-pointer border-none p-0 opacity-0"
        title={children}
        checked={isChecked}
        onChange={({ target }) => onCheck(target.checked)}
      />
    </td>
  );
};

enum Variant {
  FOCUSED_OR_CURRENT_CHECKED = 0,
  FOCUSED_OR_CURRENT_UNCHECKED = 1,
  CHECKED = 2,
  NONE = 3,
}

const VARIANTS: Record<Variant, string> = {
  [Variant.FOCUSED_OR_CURRENT_CHECKED]: 'bg-purple-200',
  [Variant.FOCUSED_OR_CURRENT_UNCHECKED]: 'bg-blue-200',
  [Variant.CHECKED]: 'bg-green-200',
  [Variant.NONE]: 'even:bg-bg-default odd:bg-bg-subtle',
};

const getVariant = (
  isFocused: boolean,
  isCurrentColumn: boolean,
  isCurrentRow: boolean,
  isChecked: boolean,
): Variant => {
  if (isFocused || isCurrentColumn || isCurrentRow) {
    if (isChecked) {
      return Variant.FOCUSED_OR_CURRENT_CHECKED;
    }

    return Variant.FOCUSED_OR_CURRENT_UNCHECKED;
  }

  if (isChecked) {
    return Variant.CHECKED;
  }

  return Variant.NONE;
};
