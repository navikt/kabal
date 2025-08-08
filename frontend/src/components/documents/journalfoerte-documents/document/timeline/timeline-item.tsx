import { isoDateTimeToPretty } from '@app/domain/date';
import { TimelineTypes } from '@app/types/arkiverte-documents';
import {
  ArrowUndoIcon,
  ChevronRightIcon,
  EnvelopeClosedIcon,
  FileCheckmarkIcon,
  FolderFileIcon,
  GlassesIcon,
  HddUpIcon,
  PrinterSmallIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { BoxNew, type BoxNewProps, Button, Detail, Label, Popover, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

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
      background={BACKGROUND_COLOR[type] ?? 'neutral-soft'}
    />
  );
};

interface TimelineItemProps extends Pick<BoxNewProps, 'background'> {
  title: string;
  icon: React.ReactNode;
  timestamp: string;
  hideNext?: boolean;
  popover?: {
    content: React.ReactNode;
    buttonText: string;
  } | null;
}

export const TimelineItem = ({
  icon,
  title,
  timestamp,
  background,
  popover = null,
  hideNext = false,
}: TimelineItemProps) => (
  <BoxNew asChild borderRadius="medium" borderWidth="1" borderColor="neutral" background={background} padding="2">
    <VStack as="li" position="relative" gap="1 0" className="whitespace-nowrap">
      <Label size="small" className="flex items-center gap-1">
        {icon} <span>{title}</span>
      </Label>
      <Detail>{isoDateTimeToPretty(timestamp)}</Detail>
      {popover === null ? null : <TimelinePopover buttonText={popover.buttonText}>{popover.content}</TimelinePopover>}
      {hideNext ? null : (
        <ChevronRightIcon aria-hidden className="-translate-y-1/2 -translate-x-[22.5%] absolute top-1/2 left-full" />
      )}
    </VStack>
  </BoxNew>
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
      <Button ref={ref} onClick={() => setIsOpen(!isOpen)} size="xsmall" variant="tertiary-neutral">
        {buttonText}
      </Button>
      <Popover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={ref.current}>
        <Popover.Content>{children}</Popover.Content>
      </Popover>
    </div>
  );
};

const BACKGROUND_COLOR: Record<TimelineTypes, BoxNewProps['background']> = {
  [TimelineTypes.OPPRETTET]: 'meta-lime-soft',
  [TimelineTypes.SENDT_PRINT]: 'warning-soft',
  [TimelineTypes.EKSPEDERT]: 'brand-blue-soft',
  [TimelineTypes.JOURNALFOERT]: 'accent-soft',
  [TimelineTypes.REGISTRERT]: 'meta-purple-soft',
  [TimelineTypes.AVSENDER_RETUR]: 'danger-soft',
  [TimelineTypes.LEST]: 'success-soft',
};

const DATOTYPE_NAME: Record<TimelineTypes, string> = {
  [TimelineTypes.OPPRETTET]: 'Opprettet',
  [TimelineTypes.SENDT_PRINT]: 'Sendt print',
  [TimelineTypes.EKSPEDERT]: 'Ekspedert',
  [TimelineTypes.JOURNALFOERT]: 'Journalført',
  [TimelineTypes.REGISTRERT]: 'Registrert',
  [TimelineTypes.AVSENDER_RETUR]: 'Avsender retur',
  [TimelineTypes.LEST]: 'Lest',
};

const ICON: Record<TimelineTypes, React.FC> = {
  [TimelineTypes.OPPRETTET]: FileCheckmarkIcon,
  [TimelineTypes.SENDT_PRINT]: PrinterSmallIcon,
  [TimelineTypes.EKSPEDERT]: EnvelopeClosedIcon,
  [TimelineTypes.JOURNALFOERT]: FolderFileIcon,
  [TimelineTypes.REGISTRERT]: HddUpIcon,
  [TimelineTypes.AVSENDER_RETUR]: ArrowUndoIcon,
  [TimelineTypes.LEST]: GlassesIcon,
};
