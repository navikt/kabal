import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUpdateChosenMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '@app/redux-api/oppgaver/mutations/switch-medunderskriverflyt';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { getTitleLowercase } from './getTitle';

type SendTilMedunderskriverProps = Pick<
  IOppgavebehandling,
  'id' | 'typeId' | 'medunderskriverident' | 'medunderskriverFlyt'
>;

export const SendTilMedunderskriver = ({
  typeId,
  id: oppgaveId,
  medunderskriverident,
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
    !canEdit || medunderskriverident === null || loader.isLoading || medunderskriverLoader.isLoading;

  const onClick = () => switchMedunderskriverflyt({ oppgaveId, isSaksbehandler });

  const SentToMedunderskriver = () => (
    <StyledFormSection>
      <Alert variant="info" size="small" inline>
        Sendt til {getTitleLowercase(typeId)}
      </Alert>
    </StyledFormSection>
  );

  const SentBackToMedunderskriver = () => (
    <StyledFormSection>
      <Alert variant="info" size="small" inline>
        Sendt tilbake av {getTitleLowercase(typeId)}
      </Alert>
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
        icon={<PaperplaneIcon aria-hidden />}
      >
        Send til {getTitleLowercase(typeId)}
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
  margin-top: 16px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;
