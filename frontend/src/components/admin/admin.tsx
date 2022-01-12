import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { SuccessIcon } from '../../icons/success';
import {
  useRebuildElasticAdminMutation,
  useRefillElasticAdminAnkeMutation,
  useRefillElasticAdminKlageMutation,
  useResendDvhAnkeMutation,
  useResendDvhKlageMutation,
} from '../../redux-api/admin';

export const Admin = () => (
  <article>
    <h1>Administrasjon</h1>
    <StyledContent>
      <StyledSettingsSection>
        <RebuildElasticButton
          useApi={useRebuildElasticAdminMutation}
          text="KABAL-SEARCH OPENSEARCH REBUILD"
          helptext='Denne operasjonen er avhengig av å treffe rett pod. Juster ned antall pods for kabal-search til 1 før du trykker på knappen, og verifiser at operasjonen var vellykket ved å søke etter "Seeking to beginning of topic klage.klage-endret.v1 and partition 0" i loggene til kabal-search.'
        />
        <Button useApi={useRefillElasticAdminKlageMutation} text="KABAL-API KAFKA REFILL" />
        <Button useApi={useResendDvhKlageMutation} text="KABAL-API DVH RESEND" />

        <Button useApi={useRefillElasticAdminAnkeMutation} text="KABAL-ANKE-API KAFKA REFILL" />
        <Button useApi={useResendDvhAnkeMutation} text="KABAL-ANKE-API DVH RESEND" />
      </StyledSettingsSection>
    </StyledContent>
  </article>
);

interface RebuildElasticButtonProps {
  useApi: typeof useRebuildElasticAdminMutation;
  text: string;
  helptext: string;
}
interface ButtonProps {
  useApi:
    | typeof useRefillElasticAdminKlageMutation
    | typeof useResendDvhKlageMutation
    | typeof useRefillElasticAdminAnkeMutation
    | typeof useResendDvhAnkeMutation;
  text: string;
}

const RebuildElasticButton = ({ text, helptext, useApi }: RebuildElasticButtonProps): JSX.Element => {
  const [callApi, { isSuccess, isLoading, isUninitialized }] = useApi();

  return (
    <ButtonContainer>
      <StyledHovedknapp onClick={() => callApi()} spinner={isLoading} autoDisableVedSpinner>
        <span>{text}</span>
        <StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />
      </StyledHovedknapp>
      <div>{helptext}</div>
    </ButtonContainer>
  );
};

const Button = ({ text, useApi }: ButtonProps): JSX.Element => {
  const [callApi, { isSuccess, isLoading, isUninitialized }] = useApi();

  return (
    <StyledHovedknapp onClick={() => callApi()} spinner={isLoading} autoDisableVedSpinner>
      <span>{text}</span>
      <StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />
    </StyledHovedknapp>
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

const ButtonContainer = styled.div`
  max-width: 400px;
  margin-bottom: 64px;
`;

const StyledHovedknapp = styled(Hovedknapp)`
  margin: 10px 0;
`;
