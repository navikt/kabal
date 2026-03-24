import type { ReactNode } from 'react';

interface VisualRadioProps {
  checked: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A purely visual radio button that looks identical to the Aksel `<Radio>` (small variant)
 * but renders **no** `<input>` element.
 *
 * This avoids the a11y violation "interactive controls must not be nested" that occurs
 * when a real `<input type="radio">` lives inside a `<div role="option">`.
 *
 * The radio dot is created entirely with CSS border-width, matching Aksel's approach.
 * Since our `<div>` cannot match the `:checked` pseudo-class, we apply the checked
 * styles (thick border = dot) via inline styles.
 *
 * All accessibility semantics (selected state, keyboard interaction, etc.) are handled
 * by the parent `role="option"` / `aria-selected` in `VirtualizedOptionList`.
 */
export const VisualRadio = ({ checked, children, className }: VisualRadioProps) => (
  <div className={`aksel-radio aksel-radio--small ${className ?? ''}`}>
    <div
      className="aksel-radio__input"
      style={
        checked
          ? {
              borderWidth: '7px',
              borderColor: 'var(--ax-bg-strong-pressed)',
              backgroundColor: 'var(--ax-bg-input)',
            }
          : undefined
      }
    />
    <span className="aksel-radio__label aksel-body-short aksel-body-short--small">{children}</span>
  </div>
);
