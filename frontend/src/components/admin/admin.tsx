import {
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { styled } from 'styled-components';
import { ApiButton } from './api-button';

export const Admin = () => (
  <StyledPageContent>
    <h1>Administrasjon</h1>
    <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
    <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
    <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
  </StyledPageContent>
);

const StyledPageContent = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  max-width: 400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;
