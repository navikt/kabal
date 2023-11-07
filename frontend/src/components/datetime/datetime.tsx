import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import React from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { IText } from '@app/types/texts/responses';

type Props = Pick<IText, 'created' | 'modified'>;

export const ModifiedCreatedDateTime = ({ modified, created }: Props) => {
  const isModified = modified !== null;
  const Icon = isModified ? CalendarIcon : ClockIcon;

  const dateTime = isModified ? modified : created;
  const title = isModified ? 'Sist endret' : 'Opprettet';

  return <DateTime icon={<Icon aria-hidden style={{ flexShrink: 0 }} />} dateTime={dateTime} title={title} />;
};

interface DateTimeProps {
  dateTime: string;
  icon?: React.ReactNode;
  title?: string;
}

export const DateTime = ({ dateTime, title, icon }: DateTimeProps) => (
  <StyledTime dateTime={dateTime} title={title}>
    {icon}
    {isoDateTimeToPretty(dateTime)}
  </StyledTime>
);

const StyledTime = styled.time`
  display: flex;
  align-items: center;
  column-gap: 4px;
  white-space: nowrap;
`;
