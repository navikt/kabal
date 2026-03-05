import { BackLink } from '@app/components/oppgavebehandling-footer/back-link';
import { FooterType, StyledFooter } from '@app/components/oppgavebehandling-footer/styled-components';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, InlineMessage } from '@navikt/ds-react';

export const FinishedFooter = () => (
  <StyledFooter type={FooterType.FINISHED}>
    <HStack align="center" justify="space-between" gap="space-16">
      <Button
        variant="primary"
        type="button"
        size="small"
        disabled
        data-testid="complete-button"
        icon={<CheckmarkIcon aria-hidden />}
      >
        Fullfør
      </Button>
      <BackLink />
    </HStack>
    <InlineMessage status="success">Fullført</InlineMessage>
  </StyledFooter>
);
