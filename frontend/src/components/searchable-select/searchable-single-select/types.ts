import type { ButtonProps } from '@navikt/ds-react';
import type { ReactNode, RefObject } from 'react';

export const NULL_KEY = '__searchable_select_null__';

export interface SearchableSelectProps<T> {
  /** Optional id applied to the trigger element, enabling external `<label htmlFor={id}>` association. */
  id?: string;
  /** Used for aria-label on the trigger button and internal fields. Not rendered visually. */
  label: string;
  options: T[];
  value: T | null;
  valueKey: (option: T) => string;
  formatLabel: (option: T | null) => ReactNode;
  filterOption: (option: T, search: string) => boolean;
  onChange: (value: T) => void;
  onClear?: () => void;
  disabled?: boolean;
  /** When true, shows a loading spinner on the trigger button to indicate a pending operation. */
  loading?: boolean;
  /**
   * When true, renders the selected value as static text without any interactive controls.
   * @default false
   */
  readOnly?: boolean;
  size?: 'small' | 'medium';
  error?: string;
  confirmLabel?: string;
  /**
   * When `true`, the user must explicitly confirm via the button or keyboard shortcut. When `false`, the selection is applied automatically when the popover closes.
   * @default false
   */
  requireConfirmation?: boolean;
  /**
   * Whether the popover should flip its placement when it reaches the viewport edge.
   * @default false
   */
  flip?: boolean;
  /** Ref to the nearest scrollable ancestor. When provided, the container is scrolled to reveal the popover on open. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** Size of the trigger button. Defaults to `"small"`. */
  triggerSize?: ButtonProps['size'];
  /** Variant of the trigger button. Defaults to `"secondary"`. */
  triggerVariant?: ButtonProps['variant'];
  /** Inline styles applied to the outermost wrapper element. */
  style?: React.CSSProperties;
}
