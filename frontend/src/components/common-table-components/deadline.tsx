import { TimesPreviouslyExtended } from '@app/components/times-previously-extended/times-previously-extended';
import { isoDateToPretty } from '@app/domain/date';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { useSetFristMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOppgave } from '@app/types/oppgaver';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { addDays, addYears, isPast, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { DatePicker } from '../date-picker/date-picker';

export const Deadline = (oppgave: IOppgave) => {
  if (oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  if (oppgave.isAvsluttetAvSaksbehandler) {
    return <ReadOnlyDeadline {...oppgave} />;
  }

  return <EditableDeadline {...oppgave} />;
};

interface ReadOnlyDeadlineProps {
  frist: string | null;
  timesPreviouslyExtended: number;
}

export const ReadOnlyDeadline = ({ frist, timesPreviouslyExtended }: ReadOnlyDeadlineProps) => {
  const fristExceeded = useMemo(() => (frist === null ? false : isPast(addDays(parseISO(frist), 1))), [frist]);

  return (
    <HStack align="center" gap="2" wrap={false}>
      <time className={fristExceeded ? 'text-text-danger' : 'text-text-default'} dateTime={frist ?? ''}>
        {isoDateToPretty(frist) ?? 'Ikke satt'}
      </time>
      <TimesPreviouslyExtended timesPreviouslyExtended={timesPreviouslyExtended} />
    </HStack>
  );
};

const EditableDeadline = ({ frist, id }: IOppgave) => {
  const [userFrist, setUserFrist] = useState(frist);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setUserFrist(frist), [frist]);

  const closeCalendar = () => setIsOpen(false);

  const fristExceeded = useMemo(
    () => (userFrist === null ? false : isPast(addDays(parseISO(userFrist), 1))),
    [userFrist],
  );

  const children = isOpen ? (
    <EditDeadline frist={frist} oppgaveId={id} closeCalendar={closeCalendar} setUserFrist={setUserFrist} />
  ) : (
    <time className={fristExceeded ? 'text-text-danger' : 'text-text-default'} dateTime={userFrist ?? ''}>
      {isoDateToPretty(userFrist) ?? 'Ikke satt'}
    </time>
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
      title="Endre frist for behandling i klageinstans"
      variant="tertiary"
      onClick={toggleOpen}
    />
  );
};

interface EditDeadlineProps {
  frist: string | null;
  oppgaveId: string;
  closeCalendar: () => void;
  setUserFrist: (frist: string) => void;
}

const DATE_PICKER_ID = 'edit-deadline';

const EditDeadline = ({ frist, oppgaveId, closeCalendar, setUserFrist }: EditDeadlineProps) => {
  const [setFrist] = useSetFristMutation();

  const onChange = (date: string | null) => {
    setUserFrist(date ?? '');

    if (date === null || date === frist) {
      return;
    }

    setFrist({ date, oppgaveId });
    closeCalendar();
  };

  return (
    <DatePicker
      id={DATE_PICKER_ID}
      label="Frist"
      hideLabel
      value={frist}
      size="small"
      onChange={onChange}
      autoFocus
      toDate={addYears(new Date(), 2)}
    />
  );
};
