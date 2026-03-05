import { AccessRights } from '@app/components/access-rights/access-rights';
import { PageWrapper } from '@app/pages/page-wrapper';
import { VStack } from '@navikt/ds-react';

export const AccessRightsPage = () => (
  <PageWrapper>
    <VStack gap="space-16 space-0" overflow="hidden" maxHeight="100%">
      <AccessRights />
    </VStack>
  </PageWrapper>
);
