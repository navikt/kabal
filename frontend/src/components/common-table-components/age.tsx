import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import {
  useSetKjennelseMottattMutation,
  useSetMottattKlageinstansMutation,
} from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOppgave } from '@app/types/oppgaver';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { differenceInDays, parseISO } from 'date-fns';
import { useState } from 'react';

export const Age = (oppgave: IOppgave) => {
  if (oppgave.isAvsluttetAvSaksbehandler) {
    return (
      <span className="truncate">
        {oppgave.ageKA} {oppgave.ageKA === 1 ? 'dag' : 'dager'}
      </span>
    );
  }

  return <EditableAge {...oppgave} />;
};

const EditableAge = ({ ageKA, mottatt, id, typeId }: IOppgave) => {
  const [userAge, setUserAge] = useState(ageKA);
  const [isOpen, setIsOpen] = useState(false);

  const closeCalendar = () => setIsOpen(false);

  const children = isOpen ? (
    <EditAge
      mottattDate={mottatt}
      oppgaveId={id}
      closeCalendar={closeCalendar}
      setUserAge={setUserAge}
      typeId={typeId}
    />
  ) : (
    <span className="truncate">
      {userAge} {userAge === 1 ? 'dag' : 'dager'}
    </span>
  );

  return (
    <HStack align="center" gap="2" wrap={false}>
      {children}
      <EditButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </HStack>
  );
};

interface EditButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const EditButton = ({ isOpen, setIsOpen }: EditButtonProps) => {
  const show = useHasAnyOfRoles([Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]);
  const toggleOpen = () => setIsOpen(!isOpen);

  if (!show) {
    return null;
  }

  return (
    <Button
      size="xsmall"
      icon={<PencilIcon aria-hidden />}
      title="Endre dato for mottatt klageinstans"
      variant="tertiary-neutral"
      onClick={toggleOpen}
    />
  );
};

interface EditAgeProps {
  mottattDate: string;
  oppgaveId: string;
  closeCalendar: () => void;
  setUserAge: (age: number) => void;
  typeId: SaksTypeEnum;
}

const DATE_PICKER_ID = 'edit-age';

const EditAge = ({ mottattDate, oppgaveId, closeCalendar, setUserAge, typeId }: EditAgeProps) => {
  const [setMottattklageinstans] = useSetMottattKlageinstansMutation();
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  const onChange = (date: string | null) => {
    if (date === null || date === mottattDate) {
      return;
    }

    setUserAge(differenceInDays(new Date(), parseISO(date)));

    if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR) {
      setKjennelseMottatt({ kjennelseMottatt: date, oppgaveId, typeId });
    } else {
      setMottattklageinstans({ mottattKlageinstans: date, oppgaveId });
    }

    closeCalendar();
  };

  return (
    <DatePicker
      id={DATE_PICKER_ID}
      label="Mottattdato"
      hideLabel
      value={mottattDate}
      size="small"
      onChange={onChange}
      centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      autoFocus
    />
  );
};
