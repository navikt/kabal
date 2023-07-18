import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import React from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { IText } from '@app/types/texts/texts';

type Props = Pick<IText, 'created' | 'modified'>;

export const DateTime = ({ modified, created }: Props) => {
  const isModified = modified !== null;
  const Icon = isModified ? CalendarIcon : ClockIcon;

  const dateTime = isModified ? modified : created;
  const title = isModified ? 'Sist endret' : 'Opprettet';

  return (
    <StyledTime dateTime={dateTime} title={title}>
      <Icon />
      {isoDateTimeToPretty(dateTime)}
    </StyledTime>
  );
};

const StyledTime = styled.time`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;
