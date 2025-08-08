import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useNewAnkebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ValidationType } from '@app/types/oppgavebehandling/params';
import { FolderPlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';

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
    <div className="relative">
      <Button
        icon={<FolderPlusIcon aria-hidden />}
        variant="secondary-neutral"
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
    </div>
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
      <HStack justify="space-between">
        <Button
          className="whitespace-nowrap"
          loading={isLoading}
          icon={<FolderPlusIcon aria-hidden />}
          variant="primary"
          size="small"
          onClick={() => newAnkebehandling({ oppgaveId })}
        >
          Ny behandling
        </Button>
        <Button className="whitespace-nowrap" variant="secondary-neutral" size="small" onClick={close}>
          Avbryt
        </Button>
      </HStack>
    </PopupContainer>
  );
};
