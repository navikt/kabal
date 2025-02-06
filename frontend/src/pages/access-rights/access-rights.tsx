import { AccessRights } from '@app/components/access-rights/access-rights';
import { VStack } from '@navikt/ds-react';
import { PageWrapper } from '../page-wrapper';

export const AccessRightsPage = () => (
  <PageWrapper>
    <VStack gap="4 0" overflow="hidden" maxHeight="100%">
      <AccessRights />
    </VStack>
  </PageWrapper>
);
