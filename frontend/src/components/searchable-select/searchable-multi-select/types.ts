import type { ButtonProps } from '@navikt/ds-react';
import type { RefObject } from 'react';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';

export interface SearchableMultiSelectProps<T> {
  /** Optional id applied to the trigger element, enabling external `<label htmlFor={id}>` association. */
  id?: string;
  /** Used for aria-label on the trigger button and internal fields. Not rendered visually. */
  label: string;
  /** Inline styles applied to the outermost wrapper element. */
  style?: React.CSSProperties;
  options: Entry<T>[];
  /** Currently selected values (controlled). */
  value: Entry<T>[];
  /** Text to show in the trigger when nothing is selected. */
  emptyLabel: string;
  /** Called when the user confirms a new selection. */
  onChange: (values: T[]) => void;
  disabled?: boolean;
  /** When true, shows a loading spinner on the trigger button to indicate a pending operation. */
  loading?: boolean;
  /**
   * When `true`, renders the selected values as static pills without any interactive controls.
   * @default false
   */
  readOnly?: boolean;
  error?: string;
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
  /**
   * How the trigger button content is displayed.
   * - `"pills"` (default): shows each selected value as a pill/tag.
   * - `"count"`: shows the label with a count suffix, e.g. "Hjemmel (3)". Useful for compact spaces like table headers.
   */
  triggerDisplay?: 'pills' | 'count';
  /**
   * When `true`, the popover will show buttons for selection all and none.
   * @default false
   */
  showSelectAll?: boolean;
}
