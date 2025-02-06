import { HISTORY_COLORS } from '@app/components/behandling/behandlingsdialog/history/common';
import { isoDateTimeToPretty } from '@app/domain/date';
import type { HistoryEventTypes } from '@app/types/oppgavebehandling/response';
import { Box, HStack, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  type: HistoryEventTypes;
  color?: string;
  icon: React.FunctionComponent;
  tag: string;
  timestamp: string;
  children: React.ReactNode;
}

export const HistoryEvent = ({ type, tag, icon: Icon, color, timestamp, children }: Props) => {
  const defaultColor = HISTORY_COLORS[type];

  return (
    <Container $accent={color ?? defaultColor}>
      <HStack align="start" justify="space-between" marginBlock="0 2">
        <HStack asChild align="center" gap="1" style={{ backgroundColor: `var(${color ?? defaultColor})` }}>
          <Box as="span" borderRadius="0 0 medium 0" paddingInline="0 2" paddingBlock="0 space-1">
            <Icon aria-hidden />
            {tag}
          </Box>
        </HStack>
        <Time dateTime={timestamp}>{isoDateTimeToPretty(timestamp)}</Time>
      </HStack>
      <VStack gap="1" paddingInline="2">
        {children}
      </VStack>
    </Container>
  );
};

const Container = styled.li<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  border-radius: var(--a-border-radius-medium);
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $accent }) => `var(${$accent})`};
  padding-bottom: var(--a-spacing-2);
  padding-right: 0;
  padding-left: 3px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: var(--a-spacing-1);
    background-color: ${({ $accent }) => `var(${$accent})`};
    border-top-left-radius: var(--a-border-radius-medium);
    border-bottom-left-radius: var(--a-border-radius-medium);
  }
`;

const Time = styled.time`
  font-size: var(--a-font-size-small);
  font-weight: normal;
  font-style: italic;
  line-height: 1;
  padding-top: var(--a-spacing-05);
  padding-right: 3px;
`;
