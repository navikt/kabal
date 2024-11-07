import { MerkantilTaskList } from '@app/components/admin/merkantil-task-list';
import {
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { HStack, Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { ApiButton } from './api-button';

export const Admin = () => (
  <StyledPageContent>
    <Heading level="1" size="large">
      Administrasjon
    </Heading>

    <HStack gap="4">
      <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
      <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
      <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
    </HStack>

    <MerkantilTaskList />
  </StyledPageContent>
);

const StyledPageContent = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  width: 100%;
`;
