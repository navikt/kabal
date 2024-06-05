import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Button, Detail, Popover } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { TimelineTypes } from '@app/types/arkiverte-documents';
import { BACKGROUND_COLOR, DATOTYPE_NAME, ICON } from './helpers';
import { NextArrow, StyledLabel, StyledTimelineItem } from './styled-components';

interface RelevantDateTimelineItemProps {
  timestamp: string;
  type: TimelineTypes;
  hideNext?: boolean;
  popover?: TimelineItemProps['popover'];
}

export const RelevantDateTimelineItem = ({ type, ...rest }: RelevantDateTimelineItemProps) => {
  const Icon = ICON[type] ?? XMarkOctagonIcon;

  return (
    <TimelineItem
      {...rest}
      icon={<Icon aria-hidden />}
      title={DATOTYPE_NAME[type] ?? type}
      color={BACKGROUND_COLOR[type] ?? 'var(--a-gray-50)'}
    />
  );
};

interface TimelineItemProps {
  title: string;
  icon: React.ReactNode;
  timestamp: string;
  hideNext?: boolean;
  color: string;
  popover?: {
    content: React.ReactNode;
    buttonText: string;
  } | null;
}

export const TimelineItem = ({
  icon,
  title,
  timestamp,
  color,
  popover = null,
  hideNext = false,
}: TimelineItemProps) => (
  <StyledTimelineItem $color={color}>
    <StyledLabel size="small">
      {icon} <span>{title}</span>
    </StyledLabel>
    <Detail>{isoDateTimeToPretty(timestamp)}</Detail>
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
