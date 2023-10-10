import React from 'react';
import { styled } from 'styled-components';
import { useTextMigration } from '@app/components/admin/use-text-migration';
import {
  useRecreateElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { ApiButton } from './api-button';

export const Admin = () => (
  <StyledPageContent>
    <h1>Administrasjon</h1>
    <ApiButton useApi={useRecreateElasticAdminMutation}>KABAL-SEARCH OPENSEARCH RECREATE</ApiButton>
    <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
    <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
    <ApiButton useApi={useTextMigration}>MIGRATE SMART EDITOR TEXTS</ApiButton>
  </StyledPageContent>
);

const StyledPageContent = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;
