import { BoxNew, Button, type ButtonProps, HStack } from '@navikt/ds-react';

interface Props extends ButtonProps {
  open: boolean;
  minHeight?: string;
  error?: boolean;
  active: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const ToggleButton = ({ open, error = false, active, minHeight, icon, size, ...props }: Props) => (
  <HStack asChild align="center" wrap={false}>
    <BoxNew
      asChild
      position="relative"
      minHeight={minHeight === undefined ? '2rem' : minHeight}
      style={{ boxShadow: error ? '0 0 0 1px var(--ax-border-danger)' : 'none' }}
      className="whitespace-nowrap disabled:cursor-not-allowed"
    >
      <Button
        type="button"
        variant={getVariant(error, active)}
        size={size}
        icon={icon}
        iconPosition="right"
        {...props}
      />
    </BoxNew>
  </HStack>
);

const getVariant = (error: boolean, active: boolean): ButtonProps['variant'] => {
  if (error) {
    return 'danger';
  }

  if (active) {
    return 'primary';
  }

  return 'tertiary';
};
