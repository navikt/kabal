import { HISTORY_COLORS } from '@app/components/behandling/behandlingsdialog/history/common';
import { isoDateTimeToPretty } from '@app/domain/date';
import type { HistoryEventTypes } from '@app/types/oppgavebehandling/response';
import { Box, HStack, VStack } from '@navikt/ds-react';

interface Props {
  type: HistoryEventTypes;
  color?: string;
  icon: React.FunctionComponent;
  tag: string;
  timestamp: string;
  children: React.ReactNode;
}

export const HistoryEvent = ({ type, tag, icon: Icon, color, timestamp, children }: Props) => {
  const accent = color ?? HISTORY_COLORS[type];

  return (
    <VStack asChild>
      <Box
        as="li"
        borderRadius="medium"
        borderWidth="1"
        paddingBlock="0 2"
        overflow="hidden"
        position="relative"
        className="pl-[2px] before:absolute before:top-0 before:bottom-0 before:left-0 before:rounded-tl-lg before:rounded-bl-lg before:border-inherit before:border-l-3"
        style={{ borderColor: `var(${accent})` }}
      >
        <HStack align="start" justify="space-between" marginBlock="0 2">
          <HStack asChild align="center" gap="1" style={{ backgroundColor: `var(${accent})` }}>
            <Box as="span" borderRadius="0 0 medium 0" paddingInline="0 2" paddingBlock="0 space-1">
              <Icon aria-hidden />
              {tag}
            </Box>
          </HStack>
          <time className="pt-0.5 pr-[3px] font-normal text-sm italic leading-none" dateTime={timestamp}>
            {isoDateTimeToPretty(timestamp)}
          </time>
        </HStack>
        <VStack gap="1" paddingInline="2">
          {children}
        </VStack>
      </Box>
    </VStack>
  );
};
