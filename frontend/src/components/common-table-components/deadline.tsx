import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { addDays, addYears, isPast, parseISO } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { useSetFristMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IOppgave } from '@app/types/oppgaver';
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

const ReadOnlyDeadline = ({ frist }: IOppgave) => {
  const fristExceeded = useMemo(() => (frist === null ? false : isPast(addDays(parseISO(frist), 1))), [frist]);

  return (
    <StyledDeadline $fristExceeded={fristExceeded} dateTime={frist ?? ''}>
      {isoDateToPretty(frist) ?? 'Ikke satt'}
    </StyledDeadline>
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
    <StyledDeadline $fristExceeded={fristExceeded} dateTime={userFrist ?? ''}>
      {isoDateToPretty(userFrist) ?? 'Ikke satt'}
    </StyledDeadline>
  );

  return (
    <Container>
      {children}
      <EditButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </Container>
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
      size="small"
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
      id=""
      label="Frist"
      hideLabel
      value={frist === null ? undefined : parseISO(frist)}
      size="small"
      onChange={onChange}
      autoFocus
      toDate={addYears(new Date(), 2)}
    />
  );
};

interface StyledDeadlineProps {
  $fristExceeded: boolean;
}

const StyledDeadline = styled.time<StyledDeadlineProps>`
  color: ${({ $fristExceeded }) => ($fristExceeded ? 'var(--a-text-danger)' : 'var(--a-text-default)')};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
