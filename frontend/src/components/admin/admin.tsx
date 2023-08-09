import React from 'react';
import { styled } from 'styled-components';
import {
  useRebuildElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '@app/redux-api/internal';
import { ApiButton } from './api-button';

export const Admin = () => (
  <StyledPageContent>
    <h1>Administrasjon</h1>
    <ApiButton useApi={useRebuildElasticAdminMutation}>KABAL-SEARCH OPENSEARCH REBUILD</ApiButton>
    <p>
      Operasjonen <Code>KABAL-SEARCH OPENSEARCH REBUILD</Code> er avhengig av å treffe rett pod. Juster ned antall pods
      for <Code>kabal-search</Code> til <Code>1</Code> før du trykker på knappen, og verifiser at operasjonen var
      vellykket ved å søke etter <Code>Seeking to beginning of topic klage.behandling-endret.v2 and partition 0</Code> i
      loggene til <Code>kabal-search</Code>.
    </p>
    <ApiButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</ApiButton>
    <ApiButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</ApiButton>
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

const Code = styled.code`
  color: #e8912d;
  border: 1px solid #e8912d;
  background-color: rgb(29, 28, 29);
  padding-top: 2px;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 1px;
  border-radius: 3px;
  font-size: 16px;
  user-select: all;
`;
