import { MerkantilTaskList } from '@app/components/admin/merkantil-task-list';
import {
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { HStack, Heading, VStack } from '@navikt/ds-react';
import { ApiButton } from './api-button';

export const Admin = () => (
  <VStack gap="4" width="100%">
    <Heading level="1" size="large">
      Administrasjon
    </Heading>

    <HStack gap="4">
      <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
      <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
      <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
    </HStack>

    <MerkantilTaskList />
  </VStack>
);
