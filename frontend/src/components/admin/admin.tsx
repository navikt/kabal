import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { SuccessIcon } from '../../icons/success';
import {
  useRebuildElasticAdminMutation,
  useRefillElasticAdminMutation,
  useResendDvhMutation,
} from '../../redux-api/admin';

export const Admin = () => (
  <article>
    <h1>Administrasjon</h1>
    <StyledContent>
      <StyledSettingsSection>
        <Button useApi={useRebuildElasticAdminMutation} text="KABAL-SEARCH ELASTIC REBUILD" />
        <Button useApi={useRefillElasticAdminMutation} text="KABAL-API KAFKA REFILL" />
        <Button useApi={useResendDvhMutation} text="KABAL-API DVH RESEND" />
      </StyledSettingsSection>
    </StyledContent>
  </article>
);

interface ButtonProps {
  useApi: typeof useRebuildElasticAdminMutation | typeof useRefillElasticAdminMutation | typeof useResendDvhMutation;
  text: string;
}

const Button = ({ text, useApi }: ButtonProps): JSX.Element => {
  const [callApi, { isSuccess, isLoading, isUninitialized }] = useApi();

  return (
    <Hovedknapp onClick={() => callApi()} spinner={isLoading} autoDisableVedSpinner>
      <span>{text}</span>
      <StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />
    </Hovedknapp>
  );
};

interface StatusIconProps {
  success: boolean;
  init: boolean;
  isLoading?: boolean;
}

const StatusIcon = ({ success, init, isLoading }: StatusIconProps) => {
  if (!init || isLoading === true) {
    return null;
  }

  return success ? <SuccessIcon /> : <span>(Failed)</span>;
};

const StyledContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledSettingsSection = styled.section`
  margin-right: 20px;
  > button {
    margin-right: 20px;
  }
`;
