import { isoDateTimeToPretty } from '@app/domain/date';
import type { TimelineTypes } from '@app/types/arkiverte-documents';
import { ChevronRightIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Button, Detail, Label, Popover, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { BACKGROUND_COLOR, DATOTYPE_NAME, ICON } from './helpers';

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
  <VStack
    as="li"
    position={'relative'}
    gap="1 0"
    padding="2"
    style={{ backgroundColor: color }}
    className="whitespace-nowrap rounded-medium border border-default"
  >
    <Label size="small" className="flex items-center gap-1">
      {icon} <span>{title}</span>
    </Label>
    <Detail>{isoDateTimeToPretty(timestamp)}</Detail>
    {popover === null ? null : <TimelinePopover buttonText={popover.buttonText}>{popover.content}</TimelinePopover>}
    {hideNext ? null : (
      <ChevronRightIcon aria-hidden className="-translate-y-1/2 -translate-x-[22.5%] absolute top-1/2 left-full" />
    )}
  </VStack>
);

interface TimelinePopoverProps {
  children: React.ReactNode;
  buttonText: string;
}

const TimelinePopover = ({ children, buttonText }: TimelinePopoverProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="whitespace-normal">
      <Button ref={ref} onClick={() => setIsOpen(!isOpen)} size="xsmall" variant="tertiary">
        {buttonText}
      </Button>
      <Popover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={ref.current}>
        <Popover.Content>{children}</Popover.Content>
      </Popover>
    </div>
  );
};
