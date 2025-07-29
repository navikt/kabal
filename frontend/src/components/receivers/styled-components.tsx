import { BoxNew, type BoxNewProps, VStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  accent: BoxNewProps['borderColor'];
  as?: keyof React.JSX.IntrinsicElements;
}

export const StyledReceiver = ({ children, accent, as = 'div' }: Props) => (
  <VStack asChild marginBlock="0 space-8" className="last:mb-0">
    <BoxNew
      borderRadius="medium"
      borderWidth="1 1 1 4"
      borderColor="neutral"
      style={{ borderLeftColor: `var(--ax-border-${accent})` }}
      as={as}
    >
      {children}
    </BoxNew>
  </VStack>
);
