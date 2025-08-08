import { merge } from '@app/functions/classes';
import { BOOKMARK_VARIANT_TO_CLASSNAME, type BookmarkVariantEnum } from '@app/plate/toolbar/bookmark-button';
import { Button, type ButtonProps, Tooltip } from '@navikt/ds-react';

interface Props extends ButtonProps {
  active?: boolean;
  label: string;
  keys?: string[];
  activeVariant: BookmarkVariantEnum | null;
}

export const ToolbarIconButton = ({ active, label, keys, className, activeVariant, ...rest }: Props) => (
  <Tooltip content={label} keys={keys} delay={20}>
    <Button
      size="small"
      variant={active === true ? 'primary' : 'tertiary-neutral'}
      className={activeVariant === null ? className : merge(className, BOOKMARK_VARIANT_TO_CLASSNAME[activeVariant])}
      {...rest}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()} // Prevents editor from losing focus.
    />
  </Tooltip>
);
