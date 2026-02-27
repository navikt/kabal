import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@app/components/copy-button/copy-button';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { FullmektigLookup } from '@app/components/part-lookup/fullmektig-lookup';
import { TRYGDERETTEN_ORGNR } from '@app/constants';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import type { IFullmektig } from '@app/types/oppgave-common';
import { HStack, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  part: IFullmektig | null;
}

export const Fullmektig = ({ part }: Props) => {
  const canEdit = useCanEditBehandling();
  const [updateFullmektig, { isLoading }] = useUpdateFullmektigMutation({ fixedCacheKey: part?.id });
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return null;
  }

  const name = part?.name;
  const id = part?.identifikator;
  const hasName = typeof name === 'string' && name.length > 0;
  const hasId = typeof id === 'string' && id.length > 0;

  return (
    <BehandlingSection label="Fullmektig">
      <HStack align="center" justify="space-between" wrap={false}>
        <VStack align="start" justify="start">
          <HStack align="center" gap="space-4" wrap>
            <CopyButton
              size="small"
              copyText={name}
              text={name}
              activeText={name ?? 'Ikke satt'}
              disabled={!hasName}
              wrap
            />
            {hasId ? <CopyIdButton size="small" id={id} /> : null}
          </HStack>
        </VStack>

        {canEdit ? (
          <FullmektigLookup
            label="Endre eller fjern fullmektig"
            part={part}
            onChange={async (fullmektig) => {
              await updateFullmektig({ oppgaveId, fullmektig }).unwrap();
            }}
            onClear={async () => {
              await updateFullmektig({ oppgaveId, fullmektig: null }).unwrap();
            }}
            isLoading={isLoading}
            isClearLoading={isLoading}
            invalidReceivers={[
              {
                id: TRYGDERETTEN_ORGNR,
                message: 'Trygderetten kan ikke settes som fullmektig.',
              },
            ]}
          />
        ) : null}
      </HStack>
    </BehandlingSection>
  );
};
