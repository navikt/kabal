import type { ReactNode } from 'react';

const CHECKMARK_PATH =
  'M4.03524 6.41478L10.4752 0.404669C11.0792 -0.160351 12.029 -0.130672 12.5955 0.47478C13.162 1.08027 13.1296 2.03007 12.5245 2.59621L5.02111 9.59934C4.74099 9.85904 4.37559 10 4.00025 10C3.60651 10 3.22717 9.84621 2.93914 9.56111L0.439143 7.06111C-0.146381 6.47558 -0.146381 5.52542 0.439143 4.93989C1.02467 4.35437 1.97483 4.35437 2.56036 4.93989L4.03524 6.41478Z';

interface VisualCheckboxProps {
  checked: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A purely visual checkbox that looks identical to the Aksel `<Checkbox>` (small variant)
 * but renders **no** `<input>` element.
 *
 * This avoids the a11y violation "interactive controls must not be nested" that occurs
 * when a real `<input type="checkbox">` lives inside a `<div role="option">`.
 *
 * All accessibility semantics (selected state, keyboard interaction, etc.) are handled
 * by the parent `role="option"` / `aria-selected` in `VirtualizedOptionList`.
 */
export const VisualCheckbox = ({ checked, children, className }: VisualCheckboxProps) => (
  <div className={`aksel-checkbox aksel-checkbox--small ${className ?? ''}`}>
    <div className="aksel-checkbox__input-wrapper">
      <div
        className="aksel-checkbox__input"
        style={
          checked
            ? {
                backgroundColor: 'var(--ax-bg-strong-pressed)',
                borderColor: 'var(--ax-bg-strong-pressed)',
              }
            : undefined
        }
      />
      {checked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 13 10"
          fill="none"
          focusable={false}
          role="presentation"
          aria-hidden
          className="aksel-checkbox__icon"
          style={{ display: 'block', left: 'var(--ax-space-4)' }}
        >
          <path d={CHECKMARK_PATH} fill="currentColor" />
        </svg>
      ) : null}
    </div>
    <span className="aksel-checkbox__label aksel-body-short aksel-body-short--small">{children}</span>
  </div>
);
