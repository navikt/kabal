import { Error, MinusCircle, Sandglass, Success } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useRefillElasticAdminMutation, useResendDvhMutation } from '../../redux-api/internal';
import { useRebuildElasticAdminMutation } from '../../redux-api/oppgaver';

export const Admin = () => (
  <StyledPageContent>
    <h1>Administrasjon</h1>
    <AdminButton useApi={useRebuildElasticAdminMutation}>KABAL-SEARCH OPENSEARCH REBUILD</AdminButton>
    <p>
      Operasjonen <Code>KABAL-SEARCH OPENSEARCH REBUILD</Code> er avhengig av å treffe rett pod. Juster ned antall pods
      for <Code>kabal-search</Code> til <Code>1</Code> før du trykker på knappen, og verifiser at operasjonen var
      vellykket ved å søke etter <Code>Seeking to beginning of topic klage.behandling-endret.v2 and partition 0</Code> i
      loggene til <Code>kabal-search</Code>.
    </p>
    <AdminButton useApi={useRefillElasticAdminMutation}>KABAL-API KAFKA REFILL</AdminButton>
    <AdminButton useApi={useResendDvhMutation}>KABAL-API DVH RESEND</AdminButton>
  </StyledPageContent>
);

interface AdminButtonProps {
  useApi: typeof useRefillElasticAdminMutation | typeof useResendDvhMutation | typeof useRebuildElasticAdminMutation;
  children: React.ReactNode;
}

const AdminButton = ({ children, useApi }: AdminButtonProps): JSX.Element => {
  const [callApi, { isSuccess, isLoading, isUninitialized }] = useApi();

  return (
    <Button
      type="button"
      variant="primary"
      size="medium"
      onClick={() => callApi()}
      loading={isLoading}
      disabled={isLoading}
    >
      {children}
      <StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />
    </Button>
  );
};

interface StatusIconProps {
  success: boolean;
  init: boolean;
  isLoading: boolean;
}

const StatusIcon = ({ success, init, isLoading }: StatusIconProps) => {
  if (!init) {
    return <MinusCircle />;
  }

  if (isLoading) {
    return <Sandglass />;
  }

  return success ? <Success /> : <Error />;
};

const StyledPageContent = styled.div`
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
