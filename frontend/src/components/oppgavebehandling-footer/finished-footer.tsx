import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack } from '@navikt/ds-react';
import { BackLink } from './back-link';
import { FooterType, StyledFooter } from './styled-components';

export const FinishedFooter = () => (
  <StyledFooter $type={FooterType.FINISHED}>
    <HStack align="center" justify="space-between" gap="4">
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
    <Alert variant="success" inline>
      Fullført
    </Alert>
  </StyledFooter>
);
