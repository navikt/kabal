import { BoxNew, VStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

export const PanelContainer = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <VStack asChild height="100%" maxHeight="100%" minWidth="fit-content" position="relative" {...props}>
    <BoxNew background="default" shadow="dialog" borderRadius="medium" overflowX="hidden" as="section">
      {children}
    </BoxNew>
  </VStack>
);
