import { Button, type ButtonProps, Tooltip, type TooltipProps } from '@navikt/ds-react';

interface Props extends ButtonProps {
  active?: boolean;
  label: string;
  keys?: string[];
  placement?: TooltipProps['placement'];
}

export const ToolbarIconButton = ({ active, label, keys, placement, className, ...rest }: Props) => (
  <Tooltip content={label} keys={keys} delay={20} placement={placement}>
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
