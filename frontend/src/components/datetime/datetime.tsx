import { CalendarIcon, ClockIcon } from '@navikt/aksel-icons';
import React from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { IEditor } from '@app/types/common-text-types';

interface Props {
  created: string;
  lastEditor: IEditor | undefined;
}

export const ModifiedCreatedDateTime = ({ lastEditor, created }: Props) => {
  const isModified = lastEditor !== undefined;
  const Icon = isModified ? CalendarIcon : ClockIcon;

  const dateTime = isModified ? lastEditor.created : created;
  const title = isModified ? 'Sist endret' : 'Opprettet';

  return (
    <Wrapper>
      <DateTime icon={<Icon aria-hidden style={{ flexShrink: 0 }} />} dateTime={dateTime} title={title} />
      {lastEditor === undefined ? null : <span>av {lastEditor.navIdent}</span>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 4px;
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
  column-gap: 4px;
  white-space: nowrap;
`;
