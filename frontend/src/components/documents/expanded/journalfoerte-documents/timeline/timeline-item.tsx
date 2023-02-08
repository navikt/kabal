import { Error } from '@navikt/ds-icons';
import { Button, Detail, Popover } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '../../../../../domain/date';
import { RelevantDatotype } from '../../../../../types/arkiverte-documents';
import { BACKGROUND_COLOR, DATOTYPE_NAME, ICON } from './helpers';
import { NextArrow, StyledLabel, StyledTimelineItem } from './styled-components';

interface RelevantDateTimelineItemProps {
  dato: string;
  datotype: RelevantDatotype;
  hideNext: boolean;
}

export const RelevantDateTimelineItem = ({ datotype, ...rest }: RelevantDateTimelineItemProps) => {
  const Icon = ICON[datotype] ?? Error;

  return (
    <TimelineItem
      {...rest}
      icon={<Icon aria-hidden />}
      title={DATOTYPE_NAME[datotype] ?? datotype}
      color={BACKGROUND_COLOR[datotype] ?? 'var(--a-gray-50)'}
    />
  );
};

interface TimelineItemProps {
  title: string;
  icon: React.ReactNode;
  dato: string;
  hideNext: boolean;
  color: string;
  popover?: {
    content: React.ReactNode;
    buttonText: string;
  } | null;
}

export const TimelineItem = ({ icon, title, dato, color, popover = null, hideNext }: TimelineItemProps) => (
  <StyledTimelineItem $color={color}>
    <StyledLabel size="small">
      {icon} <span>{title}</span>
    </StyledLabel>
    <Detail>{isoDateTimeToPretty(dato)}</Detail>
    {popover === null ? null : <TimelinePopover buttonText={popover.buttonText}>{popover.content}</TimelinePopover>}
    {hideNext ? null : <NextArrow aria-hidden />}
  </StyledTimelineItem>
);

interface TimelinePopoverProps {
  children: React.ReactNode;
  buttonText: string;
}

const TimelinePopover = ({ children, buttonText }: TimelinePopoverProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverContainer>
      <Button ref={ref} onClick={() => setIsOpen(!isOpen)} size="xsmall" variant="tertiary">
        {buttonText}
      </Button>
      <Popover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={ref.current}>
        <Popover.Content>{children}</Popover.Content>
      </Popover>
    </PopoverContainer>
  );
};

const PopoverContainer = styled.div`
  white-space: normal;
`;
