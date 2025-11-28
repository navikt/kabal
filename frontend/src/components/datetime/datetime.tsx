import { isoDateTimeToPretty } from '@app/domain/date';
import type { IEdit } from '@app/types/common-text-types';
import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, type StackProps } from '@navikt/ds-react';

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
    <HStack asChild align="center">
      <BodyShort id={id} size="small">
        <DateTime icon={<Icon aria-hidden className="shrink-0" />} dateTime={dateTime} title={title} />
        {lastEdit === undefined ? null : <span>, av {lastEdit.actor.navn}</span>}
      </BodyShort>
    </HStack>
  );
};

interface DateTimeProps extends Omit<StackProps, 'direction' | 'asChild' | 'children'> {
  dateTime: string;
  icon?: React.ReactNode;
  id?: string;
}

export const DateTime = ({ dateTime, icon, id, className, ...rest }: DateTimeProps) => (
  <HStack
    as="time"
    align="center"
    gap="1"
    dateTime={dateTime}
    id={id}
    className={className === undefined ? 'whitespace-nowrap' : `whitespace-nowrap ${className}`}
    {...rest}
  >
    {icon}
    {isoDateTimeToPretty(dateTime)}
  </HStack>
);
