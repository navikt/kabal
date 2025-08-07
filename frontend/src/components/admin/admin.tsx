import { InsertHjemlerInSettings } from '@app/components/admin/insert-hjemler-in-settings';
import { MerkantilTaskList } from '@app/components/admin/merkantil-task-list/merkantil-task-list';
import {
  useLogInaccessibleMutation,
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { BoxNew, Heading, HStack, VStack } from '@navikt/ds-react';
import { ApiButton } from './api-button';

export const Admin = () => (
  <VStack gap="4" width="100%">
    <Heading level="1" size="large">
      Administrasjon
    </Heading>

    <BoxNew shadow="dialog" padding="4" asChild>
      <HStack gap="4">
        <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
        <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
        <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
        <ApiButton useApi={useLogInaccessibleMutation}>KABAL-API LOG INACCESSIBLE</ApiButton>
      </HStack>
    </BoxNew>

    <InsertHjemlerInSettings />

    <MerkantilTaskList />
  </VStack>
);
