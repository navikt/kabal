import { BoxNew, Button, type ButtonProps, HStack } from '@navikt/ds-react';

interface Props extends ButtonProps {
  open: boolean;
  minHeight?: string;
  error?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const ToggleButton = ({ open, error, minHeight, icon, size, ...props }: Props) => (
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
        variant={error ? 'danger' : 'tertiary'}
        size={size}
        icon={icon}
        iconPosition="right"
        {...props}
      />
    </BoxNew>
  </HStack>
);
