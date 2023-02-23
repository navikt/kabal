import { Edit } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { differenceInDays, parseISO } from 'date-fns';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useHasAnyOfRoles } from '../../hooks/use-has-role';
import { useSetMottattKlageinstansMutation } from '../../redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '../../types/bruker';
import { CURRENT_YEAR_IN_CENTURY } from '../date-picker/constants';
import { DatePicker } from '../date-picker/date-picker';

interface Props {
  age: number;
  mottattDate: string;
  oppgaveId: string;
}

export const Age = ({ age, mottattDate, oppgaveId }: Props) => {
  const [userAge, setUserAge] = useState(age);
  const [isOpen, setIsOpen] = useState(false);

  const closeCalendar = () => setIsOpen(false);

  const children = isOpen ? (
    <EditAge mottattDate={mottattDate} oppgaveId={oppgaveId} closeCalendar={closeCalendar} setUserAge={setUserAge} />
  ) : (
    <StyledAge $age={userAge}>
      {userAge} {userAge === 1 ? 'dag' : 'dager'}
    </StyledAge>
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
  const show = useHasAnyOfRoles([Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]);
  const toggleOpen = () => setIsOpen(!isOpen);

  if (!show) {
    return null;
  }

  return (
    <Button size="small" icon={<Edit aria-hidden />} title="Endre alder" variant="tertiary" onClick={toggleOpen} />
  );
};

interface EditAgeProps {
  mottattDate: string;
  oppgaveId: string;
  closeCalendar: () => void;
  setUserAge: (age: number) => void;
}

const EditAge = ({ mottattDate, oppgaveId, closeCalendar, setUserAge }: EditAgeProps) => {
  const [setMottattklage] = useSetMottattKlageinstansMutation();

  const onChange = async (date: string | null) => {
    if (date === null || date === mottattDate) {
      return;
    }

    setUserAge(differenceInDays(new Date(), parseISO(date)));

    setMottattklage({ mottattKlageinstans: date, oppgaveId });
    closeCalendar();
  };

  return (
    <DatePicker
      id="mottatt-dato"
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

interface StyledAgeProps {
  $age: number;
}

const StyledAge = styled.div<StyledAgeProps>`
  color: ${({ $age }) => ($age >= 84 ? 'var(--a-text-danger)' : 'var(--a-text-default)')};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
