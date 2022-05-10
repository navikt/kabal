import { Send } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useIsSaksbehandler } from '../../../../hooks/use-is-saksbehandler';
import { useUpdateChosenMedunderskriverMutation } from '../../../../redux-api/oppgaver/mutations/set-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgaver/mutations/switch-medunderskriverflyt';
import { MedunderskriverFlyt } from '../../../../types/kodeverk';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling/oppgavebehandling';

type SendTilMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'medunderskriver' | 'medunderskriverFlyt'>;

export const SendTilMedunderskriver = ({
  id: oppgaveId,
  medunderskriver,
  medunderskriverFlyt,
}: SendTilMedunderskriverProps) => {
  const canEdit = useCanEdit();
  const isSaksbehandler = useIsSaksbehandler();

  const [, medunderskriverLoader] = useUpdateChosenMedunderskriverMutation({ fixedCacheKey: oppgaveId });
  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (!canEdit) {
    return null;
  }

  const sendToMedunderskriverDisabled =
    !canEdit || medunderskriver === null || loader.isLoading || medunderskriverLoader.isLoading;

  const onClick = () => switchMedunderskriverflyt({ oppgaveId, isSaksbehandler });

  const SentToMedunderskriver = () => (
    <StyledFormSection>
      <AlertStripe type="info">Sendt til medunderskriver</AlertStripe>
    </StyledFormSection>
  );

  const SentBackToMedunderskriver = () => (
    <StyledFormSection>
      <AlertStripe type="info">Sendt tilbake av medunderskriver</AlertStripe>
    </StyledFormSection>
  );

  const SendToMedunderskriver = () => (
    <StyledFormSection>
      <StyledButton
        size="small"
        variant="primary"
        type="button"
        onClick={onClick}
        disabled={sendToMedunderskriverDisabled}
        loading={loader.isLoading || medunderskriverLoader.isLoading}
        data-testid="send-to-medunderskriver"
      >
        <Send />
        <span>Send til medunderskriver</span>
      </StyledButton>
    </StyledFormSection>
  );

  if (medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <SentToMedunderskriver />;
  }

  if (medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <>
        <SentBackToMedunderskriver />
        <SendToMedunderskriver />
      </>
    );
  }

  return <SendToMedunderskriver />;
};

const StyledFormSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;
