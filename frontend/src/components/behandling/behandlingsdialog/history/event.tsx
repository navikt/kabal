import { isoDateTimeToPretty } from '@app/domain/date';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';
import { BoxNew, HStack, VStack } from '@navikt/ds-react';

interface Props {
  type: HistoryEventTypes;
  borderColorClassName?: string;
  icon: React.FunctionComponent;
  tag: string;
  timestamp: string;
  children: React.ReactNode;
}

export const HistoryEvent = ({ type, tag, icon: Icon, borderColorClassName, timestamp, children }: Props) => {
  const borderColor = borderColorClassName ?? HISTORY_COLORS[type];

  return (
    <VStack asChild>
      <BoxNew
        as="li"
        borderRadius="medium"
        borderWidth="1"
        paddingBlock="0 2"
        overflow="hidden"
        position="relative"
        className={`pl-[2px] before:absolute before:top-0 before:bottom-0 before:left-0 before:rounded-l-sm before:border-inherit before:border-l-3 ${borderColor}`}
      >
        <HStack align="start" justify="space-between" marginBlock="0 2">
          <HStack asChild align="center" gap="1" style={{ backgroundColor: `var(${borderColor})` }}>
            <BoxNew as="span" borderRadius="0 0 medium 0" paddingInline="0 2" paddingBlock="0 space-1">
              <Icon aria-hidden />
              {tag}
            </BoxNew>
          </HStack>
          <time className="pt-0.5 pr-[3px] font-normal text-sm italic leading-none" dateTime={timestamp}>
            {isoDateTimeToPretty(timestamp)}
          </time>
        </HStack>
        <VStack gap="1" paddingInline="2">
          {children}
        </VStack>
      </BoxNew>
    </VStack>
  );
};

const HISTORY_COLORS: Record<HistoryEventTypes, string> = {
  [HistoryEventTypes.TILDELING]: 'border-ax-border-brand-blue-strong',
  [HistoryEventTypes.KLAGER]: 'border-ax-border-meta-lime-strong',
  [HistoryEventTypes.FULLMEKTIG]: 'border-ax-border-info-strong',
  [HistoryEventTypes.SATT_PAA_VENT]: 'border-ax-border-neutral-subtle',
  [HistoryEventTypes.ROL]: 'border-ax-border-meta-purple-strong',
  [HistoryEventTypes.MEDUNDERSKRIVER]: 'border-ax-border-accent-subtle',
  [HistoryEventTypes.FERDIGSTILT]: 'border-ax-border-success-strong',
  [HistoryEventTypes.FEILREGISTRERT]: 'border-ax-border-danger-strong',
  [HistoryEventTypes.VARSLET_BEHANDLINGSTID]: 'border-ax-border-warning-strong',
  [HistoryEventTypes.FORLENGET_BEHANDLINGSTID]: 'border-ax-border-warning-subtle',
};
