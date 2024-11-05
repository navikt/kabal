import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { useSetMottattKlageinstansMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@app/types/bruker';
import type { IOppgave } from '@app/types/oppgaver';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { differenceInDays, parseISO } from 'date-fns';
import { useState } from 'react';
import { styled } from 'styled-components';

export const Age = (oppgave: IOppgave) => {
  if (oppgave.isAvsluttetAvSaksbehandler) {
    return (
      <StyledAge>
        {oppgave.ageKA} {oppgave.ageKA === 1 ? 'dag' : 'dager'}
      </StyledAge>
    );
  }

  return <EditableAge {...oppgave} />;
};

const EditableAge = ({ ageKA, mottatt, id }: IOppgave) => {
  const [userAge, setUserAge] = useState(ageKA);
  const [isOpen, setIsOpen] = useState(false);

  const closeCalendar = () => setIsOpen(false);

  const children = isOpen ? (
    <EditAge mottattDate={mottatt} oppgaveId={id} closeCalendar={closeCalendar} setUserAge={setUserAge} />
  ) : (
    <StyledAge>
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
      variant="tertiary"
      onClick={toggleOpen}
    />
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

  const onChange = (date: string | null) => {
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

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
`;

const StyledAge = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
