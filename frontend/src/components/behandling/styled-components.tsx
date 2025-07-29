import { BoxNew, VStack } from '@navikt/ds-react';

interface BehandlingSectionProps {
  children: React.ReactNode;
}

export const StyledBehandlingSection = ({ children }: BehandlingSectionProps) => (
  <BoxNew padding="4" minHeight="100%" background="default">
    {children}
  </BoxNew>
);

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => <VStack marginBlock="0 4">{children}</VStack>;
