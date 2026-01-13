import { BoxNew, HStack } from '@navikt/ds-react';

interface StyledToolbarProps {
  children: React.ReactNode;
}

export const StyledToolbar = ({ children }: StyledToolbarProps) => (
  <HStack asChild position="sticky" wrap={false} top="4" left="0" className="z-22" marginBlock="0 4">
    <BoxNew background="raised" shadow="dialog" padding="05" width="210mm" className="[grid-area:toolbar]">
      {children}
    </BoxNew>
  </HStack>
);
