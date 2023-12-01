import { FolderPlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useNewAnkebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ValidationType } from '@app/types/oppgavebehandling/params';

export const NewAnkebehandlingButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { data: oppgave } = useOppgave();
  const [validate, { data: validateData, isLoading: validateIsLoading, isFetching: validateIsFetching }] =
    useLazyValidateQuery();
  const { setValidationSectionErrors } = useContext(ValidationErrorContext);

  if (typeof oppgave === 'undefined' || oppgave.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  return (
    <Container>
      <Button
        icon={<FolderPlusIcon aria-hidden />}
        variant="secondary"
        size="small"
        loading={validateIsLoading || validateIsFetching}
        onClick={async () => {
          const validation = await validate({
            oppgaveId: oppgave.id,
            type: ValidationType.NEW_ANKEBEHANDLING,
          }).unwrap();

          setValidationSectionErrors(validation.sections);

          setShowPopup(true);
        }}
      >
        Ny behandling
      </Button>
      <Popup
        show={showPopup && validateData !== undefined && validateData.sections.length === 0}
        oppgaveId={oppgave.id}
        close={() => setShowPopup(false)}
      />
    </Container>
  );
};
interface PopupProps {
  show: boolean;
  close: () => void;
  oppgaveId: string;
}

const Popup = ({ show, close, oppgaveId }: PopupProps) => {
  const [newAnkebehandling, { isLoading }] = useNewAnkebehandlingMutation();

  if (!show) {
    return null;
  }

  return (
    <PopupContainer close={close} direction={Direction.RIGHT}>
      <BodyShort>
        Denne saken er hos Trygderetten. Du kan velge å starte ny behandling av saken, men da vil «Anke i
        Trygderetten»-oppgaven forsvinne. Du vil få en ny ankeoppgave som du må behandle. Husk at du må sende
        orientering til Trygderetten om den nye ankebehandlingen du har gjort i saken. Vær oppmerksom på at det kan ta
        noen minutter før ankebehandlingen er opprettet.
      </BodyShort>
      <Buttons>
        <StyledButton
          loading={isLoading}
          icon={<FolderPlusIcon aria-hidden />}
          variant="primary"
          size="small"
          onClick={() => newAnkebehandling({ oppgaveId })}
        >
          Ny behandling
        </StyledButton>
        <StyledButton variant="secondary" size="small" onClick={close}>
          Avbryt
        </StyledButton>
      </Buttons>
    </PopupContainer>
  );
};

const Container = styled.div`
  position: relative;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  white-space: nowrap;
`;
