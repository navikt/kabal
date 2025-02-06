import { isoDateTimeToPretty } from '@app/domain/date';
import type { IEdit } from '@app/types/common-text-types';
import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

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

interface DateTimeProps {
  dateTime: string;
  icon?: React.ReactNode;
  title?: string;
  id?: string;
}

export const DateTime = ({ dateTime, title, icon, id }: DateTimeProps) => (
  <HStack as="time" align="center" gap="1" dateTime={dateTime} title={title} id={id} className="whitespace-nowrap">
    {icon}
    {isoDateTimeToPretty(dateTime)}
  </HStack>
);
