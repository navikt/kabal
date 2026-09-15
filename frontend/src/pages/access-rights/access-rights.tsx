import { Heading, HStack, VStack } from '@navikt/ds-react';
import { AccessRights } from '@/components/access-rights/access-rights';
import { AnkeTeam } from '@/components/access-rights/anketeam';
import { PageWrapper } from '@/pages/page-wrapper';

export const AccessRightsPage = () => (
  <PageWrapper>
    <VStack gap="space-16" overflow="hidden" height="100%">
      <Heading level="1" size="medium">
        Tilgangsstyring
      </Heading>

      <HStack gap="space-32" overflow="hidden" maxHeight="100%" className="shrink" padding="space-4">
        <AccessRights />
        <AnkeTeam />
      </HStack>
    </VStack>
  </PageWrapper>
);
