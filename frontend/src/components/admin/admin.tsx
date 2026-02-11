import { InsertHjemlerInSettings } from '@app/components/admin/insert-hjemler-in-settings';
import { MerkantilTaskList } from '@app/components/admin/merkantil-task-list/merkantil-task-list';
import { CreateSystemNotification } from '@app/components/admin/system-notifications/create';
import { ListSystemNotifications } from '@app/components/admin/system-notifications/list';
import {
  useEvictCacheMutation,
  useLogInaccessibleMutation,
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { ApiButton } from './api-button';

export const Admin = () => (
  <VStack gap="space-16" width="100%">
    <Heading level="1" size="large">
      Administrasjon
    </Heading>

    <Box shadow="dialog" padding="space-16" asChild>
      <HGrid gap="space-32" columns="1fr 1fr 1fr">
        <VStack as="section" gap="space-16">
          <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
          <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
          <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
          <ApiButton useApi={useLogInaccessibleMutation}>KABAL-API LOG INACCESSIBLE</ApiButton>
          <ApiButton useApi={useEvictCacheMutation}>KLAGE-LOOKUP EVICT CACHE</ApiButton>
        </VStack>

        <InsertHjemlerInSettings />

        <VStack gap="space-16">
          <CreateSystemNotification />

          <ListSystemNotifications />
        </VStack>
      </HGrid>
    </Box>

    <MerkantilTaskList />
  </VStack>
);
