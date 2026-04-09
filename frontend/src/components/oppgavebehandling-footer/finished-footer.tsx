import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, InlineMessage } from '@navikt/ds-react';
import { BackLink } from '@/components/oppgavebehandling-footer/back-link';
import { FooterType, StyledFooter } from '@/components/oppgavebehandling-footer/styled-components';

export const FinishedFooter = () => (
  <StyledFooter type={FooterType.FINISHED}>
    <HStack align="center" justify="space-between" gap="space-16">
      <Button variant="primary" type="button" size="small" disabled icon={<CheckmarkIcon aria-hidden />}>
        Fullfør
      </Button>
      <BackLink />
    </HStack>
    <InlineMessage status="success">Fullført</InlineMessage>
  </StyledFooter>
);
