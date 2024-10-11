import { isoDateTimeToPretty } from '@app/domain/date';
import type { IEdit } from '@app/types/common-text-types';
import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';

interface Props {
  created: string;
  lastEdit: IEdit | undefined;
}

export const ModifiedCreatedDateTime = ({ lastEdit, created }: Props) => {
  const isModified = lastEdit !== undefined;
  const Icon = isModified ? CalendarIcon : ClockIcon;

  const dateTime = isModified ? lastEdit.created : created;
  const title = isModified ? 'Sist endret' : 'Opprettet';

  return (
    <Wrapper>
      <DateTime icon={<Icon aria-hidden style={{ flexShrink: 0 }} />} dateTime={dateTime} title={title} />
      {lastEdit === undefined ? null : <span>av {lastEdit.actor.navIdent}</span>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;

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
  column-gap: var(--a-spacing-1);
  white-space: nowrap;
`;
