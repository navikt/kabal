import { Button, type ButtonProps, Tooltip } from '@navikt/ds-react';

interface Props extends ButtonProps {
  active?: boolean;
  label: string;
  keys?: string[];
}

export const ToolbarIconButton = ({ active, label, keys, className, ...rest }: Props) => (
  <Tooltip content={label} keys={keys} delay={20}>
    <Button
      size="small"
      variant={active === true ? 'primary' : 'tertiary-neutral'}
      className={className}
      {...rest}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()} // Prevents editor from losing focus.
    />
  </Tooltip>
);
