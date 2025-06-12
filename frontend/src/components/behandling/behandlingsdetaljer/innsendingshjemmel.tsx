import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Direction } from '@app/components/deassign/direction';
import { InnsendingshjemlerList } from '@app/components/hjemler/hjemler';
import { HjemmelList } from '@app/components/oppgavebehandling-footer/deassign/hjemmel-list';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useSetInnsendingshjemlerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tag, Tooltip } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Innsendingshjemmel = ({ oppgavebehandling }: Props) => {
  const hjemmelCount = oppgavebehandling.hjemmelIdList.length;

  return (
    <BehandlingSection label={`Saken er sendt inn med ${hjemmelCount > 1 ? 'lovhjemler' : 'lovhjemmel'}`}>
      <Innsendingshjemler oppgavebehandling={oppgavebehandling} />
    </BehandlingSection>
  );
};

export const Innsendingshjemler = ({ oppgavebehandling }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setInnsendingshjemler, { isError }] = useSetInnsendingshjemlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <HStack align="center" justify="space-between" width="100%" wrap={false}>
      <InnsendingshjemlerList
        size="small"
        hjemmelIdList={oppgavebehandling.hjemmelIdList}
        fallback={
          <Tag size="small" variant="neutral">
            Ingen hjemler
          </Tag>
        }
      />
      {oppgavebehandling.isAvsluttetAvSaksbehandler ? null : (
        <div className="relative w-min shrink-0 grow-0 self-start" ref={ref}>
          <Tooltip content="Endre innsendingshjemler">
            <Button
              size="small"
              variant="tertiary"
              onClick={() => setIsOpen((o) => !o)}
              icon={<PencilIcon aria-hidden />}
              className="ml-auto self-start"
            />
          </Tooltip>
          {isOpen ? (
            <HjemmelList
              onChange={(hjemmelIdList) => setInnsendingshjemler({ oppgaveId: oppgavebehandling.id, hjemmelIdList })}
              selected={oppgavebehandling.hjemmelIdList}
              ytelseId={oppgavebehandling.ytelseId}
              error={isError ? 'Kunne ikke sette innsendingshjemler' : null}
              direction={Direction.DOWN}
            />
          ) : null}
        </div>
      )}
    </HStack>
  );
};
