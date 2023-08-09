import { Button, ButtonProps, Tooltip } from '@navikt/ds-react';
import React from 'react';

interface Props extends ButtonProps {
  active?: boolean;
  label: string;
  keys?: string[];
}

export const ToolbarIconButton = ({ active, label, keys, ...rest }: Props) => (
  <Tooltip content={label} keys={keys} delay={20}>
    <Button
      size="small"
      variant={active === true ? 'primary' : 'tertiary-neutral'}
      {...rest}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()} // Prevents editor from losing focus.
    />
  </Tooltip>
);
