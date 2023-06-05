import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { addYears, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { useSetFristMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { DatePicker } from '../date-picker/date-picker';

interface Props extends EditableDeadlineProps {
  type: SaksTypeEnum;
}

export const Deadline = ({ type, ...props }: Props) => {
  if (type === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  return <EditableDeadline {...props} />;
};

interface EditableDeadlineProps {
  age?: number;
  frist: string | null;
  oppgaveId: string;
}

const EditableDeadline = ({ frist, age, oppgaveId }: EditableDeadlineProps) => {
  const [userFrist, setUserFrist] = useState(frist);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setUserFrist(frist), [frist]);

  const closeCalendar = () => setIsOpen(false);

  const children = isOpen ? (
    <EditDeadline frist={frist} oppgaveId={oppgaveId} closeCalendar={closeCalendar} setUserFrist={setUserFrist} />
  ) : (
    <StyledDeadline $age={age} dateTime={userFrist ?? ''}>
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
  $age?: number;
}

const StyledDeadline = styled.time<StyledDeadlineProps>`
  color: ${({ $age }) => (typeof $age === 'number' && $age >= 84 ? 'var(--a-text-danger)' : 'var(--a-text-default)')};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
