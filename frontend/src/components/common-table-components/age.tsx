import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { differenceInDays, parseISO } from 'date-fns';
import { useState } from 'react';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useHasAnyOfRoles } from '@/hooks/use-has-role';
import {
  useSetMottattKlageinstansMutation,
  useSetSendtTilTrygderettenMutation,
} from '@/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@/types/bruker';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IOppgave } from '@/types/oppgaver';

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
    <HStack align="center" gap="space-8" wrap={false}>
      {children}
      <EditButton isOpen={isOpen} setIsOpen={setIsOpen} typeId={typeId} />
    </HStack>
  );
};

interface EditButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  typeId: SaksTypeEnum;
}

const EditButton = ({ isOpen, setIsOpen, typeId }: EditButtonProps) => {
  const show = useHasAnyOfRoles([Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]);
  const toggleOpen = () => setIsOpen(!isOpen);

  if (!show) {
    return null;
  }

  return (
    <Tooltip
      content={
        typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR
          ? 'Endre dato for sendt til Trygderetten'
          : 'Endre dato for mottatt klageinstans'
      }
    >
      <Button
        data-color="neutral"
        size="xsmall"
        icon={<PencilIcon aria-hidden />}
        variant="tertiary"
        onClick={toggleOpen}
      />
    </Tooltip>
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
  const [setSendtTilTR] = useSetSendtTilTrygderettenMutation();

  const onChange = (date: string | null) => {
    if (date === null || date === mottattDate) {
      return;
    }

    setUserAge(differenceInDays(new Date(), parseISO(date)));

    if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR) {
      setSendtTilTR({ sendtTilTrygderetten: date, oppgaveId, typeId });
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
