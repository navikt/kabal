import { HStack, VStack } from '@navikt/ds-react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@/components/copy-button/copy-button';
import { CopyIdButton } from '@/components/copy-button/copy-id-button';
import { PartLookup } from '@/components/part-lookup/part-lookup';
import type { InvalidReceiver } from '@/components/part-lookup/types';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import type { IPart } from '@/types/oppgave-common';

interface CommonProps {
  label: string;
  /** Label for the lookup button tooltip and aria-label. */
  buttonLabel: string;
  isLoading: boolean;
  invalidReceivers?: InvalidReceiver[];
  warningReceivers?: InvalidReceiver[];
}

interface DeletableProps extends CommonProps {
  isDeletable: true;
  part: IPart | null;
  onChange: (part: IPart | null) => void;
}

interface NonDeletableProps extends CommonProps {
  isDeletable: false;
  part: IPart;
  onChange: (part: IPart) => void;
}

export const Part = ({
  part,
  isDeletable,
  label,
  buttonLabel,
  onChange,
  isLoading,
  invalidReceivers,
  warningReceivers,
}: DeletableProps | NonDeletableProps) => {
  const canEdit = useCanEditBehandling();

  if (canEdit) {
    return (
      <BehandlingSection label={label}>
        <HStack align="center" justify="space-between" wrap={false}>
          {part !== null ? <PartContent part={part} /> : <span>Ikke satt</span>}

          <PartLookup
            label={buttonLabel}
            onChange={(newPart) => onChange(newPart)}
            onClear={isDeletable ? () => onChange(null) : undefined}
            hasValue={part !== null}
            isLoading={isLoading}
            allowUnreachable={!isDeletable}
            invalidReceivers={invalidReceivers}
            warningReceivers={warningReceivers}
          />
        </HStack>
      </BehandlingSection>
    );
  }

  if (part === null) {
    return (
      <BehandlingSection label={label}>
        <span>Ikke satt</span>
      </BehandlingSection>
    );
  }

  return (
    <BehandlingSection label={label}>
      <PartContent part={part} />
    </BehandlingSection>
  );
};

interface PartContentProps {
  part: IPart;
}

const PartContent = ({ part }: PartContentProps) => (
  <VStack align="start" justify="start">
    <HStack align="center" gap="space-4" wrap>
      {part.name === null ? (
        <span>Navn mangler</span>
      ) : (
        <CopyButton size="small" copyText={part.name} text={part.name} activeText={part.name} wrap />
      )}
      {part.identifikator === null ? null : <CopyIdButton size="small" id={part.identifikator} />}
    </HStack>

    <PartStatusList statusList={part.statusList} size="xsmall" />
  </VStack>
);
