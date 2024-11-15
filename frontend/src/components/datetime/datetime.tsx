import { isoDateTimeToPretty } from '@app/domain/date';
import type { IEdit } from '@app/types/common-text-types';
import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  created: string;
  lastEdit: IEdit | undefined;
  id: string;
}

export const ModifiedCreatedDateTime = ({ id, lastEdit, created }: Props) => {
  const isModified = lastEdit !== undefined;
  const Icon = isModified ? CalendarIcon : ClockIcon;

  const dateTime = isModified ? lastEdit.created : created;
  const title = isModified ? 'Sist endret' : 'Opprettet';

  return (
    <HStack id={id} align="center" gap="1">
      <DateTime icon={<Icon aria-hidden style={{ flexShrink: 0 }} />} dateTime={dateTime} title={title} />
      {lastEdit === undefined ? null : <span>av {lastEdit.actor.navIdent}</span>}
    </HStack>
  );
};

interface DateTimeProps {
  dateTime: string;
  icon?: React.ReactNode;
  title?: string;
  id?: string;
}

export const DateTime = ({ dateTime, title, icon, id }: DateTimeProps) => (
  <StyledTime dateTime={dateTime} title={title} id={id}>
    {icon}
    {isoDateTimeToPretty(dateTime)}
  </StyledTime>
);

const StyledTime = styled.time`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-1);
  white-space: nowrap;
`;
