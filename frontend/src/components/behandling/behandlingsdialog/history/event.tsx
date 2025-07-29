import { isoDateTimeToPretty } from '@app/domain/date';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';
import { BoxNew, HStack, VStack } from '@navikt/ds-react';

interface Props {
  type: HistoryEventTypes;
  borderColor?: HistoryColor;
  icon: React.FunctionComponent;
  tag: string;
  timestamp: string;
  children: React.ReactNode;
}

export const HistoryEvent = ({
  type,
  tag,
  icon: Icon,
  borderColor = HISTORY_COLORS[type],
  timestamp,
  children,
}: Props) => {
  return (
    <VStack asChild>
      <BoxNew
        as="li"
        borderRadius="medium"
        borderWidth="1"
        paddingBlock="0 2"
        overflow="hidden"
        position="relative"
        className="pl-[2px] before:absolute before:top-0 before:bottom-0 before:left-0 before:rounded-l-sm before:border-inherit before:border-l-3"
        style={{
          borderColor: `var(${borderColor})`,
        }}
      >
        <HStack align="start" justify="space-between" marginBlock="0 2" paddingInline="0 1">
          <HStack asChild align="center" gap="05">
            <BoxNew
              as="span"
              borderRadius="medium 0 medium 0"
              borderWidth="2"
              paddingInline="0 2"
              paddingBlock="0 space-1"
              className={`leading-none ${TEXT_COLORS[borderColor]}`}
              style={{
                backgroundColor: `var(${borderColor})`,
                borderColor: `var(${borderColor})`,
              }}
            >
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

export enum HistoryColor {
  BRAND_BLUE_STRONG = '--ax-border-brand-blue-strong',
  META_LIME_STRONG = '--ax-border-meta-lime-strong',
  INFO_STRONG = '--ax-border-info-strong',
  NEUTRAL_SUBTLE = '--ax-border-neutral-subtle',
  META_PURPLE_STRONG = '--ax-border-meta-purple-strong',
  ACCENT_SUBTLE = '--ax-border-accent-subtle',
  SUCCESS_STRONG = '--ax-border-success-strong',
  DANGER_STRONG = '--ax-border-danger-strong',
  WARNING_STRONG = '--ax-border-warning-strong',
  WARNING_SUBTLE = '--ax-border-warning-subtle',
}

const HISTORY_COLORS: Record<HistoryEventTypes, HistoryColor> = {
  [HistoryEventTypes.TILDELING]: HistoryColor.BRAND_BLUE_STRONG,
  [HistoryEventTypes.KLAGER]: HistoryColor.META_LIME_STRONG,
  [HistoryEventTypes.FULLMEKTIG]: HistoryColor.INFO_STRONG,
  [HistoryEventTypes.SATT_PAA_VENT]: HistoryColor.NEUTRAL_SUBTLE,
  [HistoryEventTypes.ROL]: HistoryColor.META_PURPLE_STRONG,
  [HistoryEventTypes.MEDUNDERSKRIVER]: HistoryColor.ACCENT_SUBTLE,
  [HistoryEventTypes.FERDIGSTILT]: HistoryColor.SUCCESS_STRONG,
  [HistoryEventTypes.FEILREGISTRERT]: HistoryColor.DANGER_STRONG,
  [HistoryEventTypes.VARSLET_BEHANDLINGSTID]: HistoryColor.WARNING_STRONG,
  [HistoryEventTypes.FORLENGET_BEHANDLINGSTID]: HistoryColor.WARNING_SUBTLE,
};

const TEXT_COLORS: Record<HistoryColor, string> = {
  [HistoryColor.BRAND_BLUE_STRONG]: 'text-ax-text-brand-blue-contrast', // Tildeling
  [HistoryColor.META_LIME_STRONG]: 'text-ax-text-meta-lime-contrast', // Klager
  [HistoryColor.INFO_STRONG]: 'text-ax-text-info-contrast', // Fullmektig
  [HistoryColor.NEUTRAL_SUBTLE]: 'text-ax-text-neutral', // Satt på vent
  [HistoryColor.META_PURPLE_STRONG]: 'text-ax-text-meta-purple-contrast', // ROL
  [HistoryColor.ACCENT_SUBTLE]: 'text-ax-text-neutral', // Medunderskriver
  [HistoryColor.SUCCESS_STRONG]: 'text-ax-text-success-contrast', // Ferdigstilt
  [HistoryColor.DANGER_STRONG]: 'text-ax-text-danger-contrast', // Feilregistrert
  [HistoryColor.WARNING_STRONG]: 'text-ax-text-warning-contrast', // Varslet behandlingstid
  [HistoryColor.WARNING_SUBTLE]: 'text-ax-text-neutral', // Forlenget behandlingstid
};
