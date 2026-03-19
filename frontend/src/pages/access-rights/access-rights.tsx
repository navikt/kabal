import { VStack } from '@navikt/ds-react';
import { AccessRights } from '@/components/access-rights/access-rights';
import { PageWrapper } from '@/pages/page-wrapper';

export const AccessRightsPage = () => (
  <PageWrapper>
    <VStack gap="space-16 space-0" overflow="hidden" maxHeight="100%">
      <AccessRights />
    </VStack>
  </PageWrapper>
);
