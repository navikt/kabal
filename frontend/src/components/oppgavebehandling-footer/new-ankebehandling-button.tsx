import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import {
  useNewAnkebehandlingMutation,
  useNewBehandlingFromTRBehandlingMutation,
} from '@app/redux-api/oppgaver/mutations/behandling';
import { useLazyValidateQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ValidationType } from '@app/types/oppgavebehandling/params';
import { FolderPlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';

interface Props {
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;
  oppgaveId: string;
}

export const NewAnkebehandlingButton = ({ typeId, oppgaveId }: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [validate, { data: validateData, isLoading: validateIsLoading, isFetching: validateIsFetching }] =
    useLazyValidateQuery();
  const { setValidationSectionErrors } = useContext(ValidationErrorContext);
  const [newBehandling, { isLoading }] = useNewBehandling(typeId);

  return (
    <div className="relative">
      <Button
        icon={<FolderPlusIcon aria-hidden />}
        variant="secondary-neutral"
        size="small"
        loading={validateIsLoading || validateIsFetching}
        onClick={async () => {
          const validation = await validate({ oppgaveId, type: getValidationType(typeId) }).unwrap();

          setValidationSectionErrors(validation.sections);

          setShowPopup(true);
        }}
      >
        Ny behandling
      </Button>
      <Popup
        show={showPopup && validateData !== undefined && validateData.sections.length === 0}
        oppgaveId={oppgaveId}
        close={() => setShowPopup(false)}
        typeId={typeId}
        newBehandling={newBehandling}
        isLoading={isLoading}
      />
    </div>
  );
};
interface PopupProps {
  show: boolean;
  close: () => void;
  oppgaveId: string;
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;
  newBehandling: (id: string) => void;
  isLoading: boolean;
}

const Popup = ({ show, close, oppgaveId, typeId, newBehandling, isLoading }: PopupProps) => {
  if (!show) {
    return null;
  }

  return (
    <PopupContainer close={close} direction={Direction.RIGHT}>
      <VStack className="w-[500px]" gap="4">
        <BodyShort>{getBodyText(typeId)}</BodyShort>
        <HStack justify="space-between">
          <Button
            className="whitespace-nowrap"
            loading={isLoading}
            icon={<FolderPlusIcon aria-hidden />}
            variant="primary"
            size="small"
            onClick={() => newBehandling(oppgaveId)}
          >
            Ny behandling
          </Button>
          <Button className="whitespace-nowrap" variant="secondary-neutral" size="small" onClick={close}>
            Avbryt
          </Button>
        </HStack>
      </VStack>
    </PopupContainer>
  );
};

const useNewBehandling = (sakstype: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR) => {
  const newAnkebehandling = useNewAnkebehandlingMutation;
  const newBehandlingFromTRBehandling = useNewBehandlingFromTRBehandlingMutation;

  switch (sakstype) {
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return newAnkebehandling();
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return newBehandlingFromTRBehandling();
  }
};

const getValidationType = (
  type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
): ValidationType => {
  switch (type) {
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return ValidationType.NEW_ANKEBEHANDLING;
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return ValidationType.NEW_BEHANDLING_FROM_TR_BEHANDLING;
  }
};

const getBodyText = (type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR): string => {
  switch (type) {
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Denne saken er hos Trygderetten. Du kan velge å starte ny behandling av saken, men da vil «Anke i Trygderetten»-oppgaven forsvinne. Du vil få en ny ankeoppgave som du må behandle. Husk at du må sende orientering til Trygderetten om den nye ankebehandlingen du har gjort i saken. Vær oppmerksom på at det kan ta noen minutter før ankebehandlingen er opprettet.';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return 'Denne saken er hos Trygderetten. Du kan velge å starte ny behandling av saken, men da vil «Begjæring om gjenopptak i Trygderetten»-oppgaven forsvinne. Du vil få en ny begjæring om gjenopptak-oppgave som du må behandle. Husk at du må sende orientering til Trygderetten om den nye behandlingen du har gjort i saken. Vær oppmerksom på at det kan ta noen minutter før begjæringen om gjenopptak er opprettet.';
  }
};
