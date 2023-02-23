import { Edit } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useHasAnyOfRoles } from '../../hooks/use-has-role';
import { useSetFristMutation } from '../../redux-api/oppgaver/mutations/behandling-dates';
import { Role } from '../../types/bruker';
import { SaksTypeEnum } from '../../types/kodeverk';
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
      icon={<Edit aria-hidden />}
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

  return <DatePicker id="" label="Frist" hideLabel value={frist} size="small" onChange={onChange} autoFocus />;
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
