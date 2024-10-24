import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Direction } from '@app/components/deassign/direction';
import { Innsendingshjemler } from '@app/components/hjemler/hjemler';
import { HjemmelList } from '@app/components/oppgavebehandling-footer/deassign/hjemmel-list';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useSetInnsendingshjemlerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Tag, Tooltip } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Innsendingshjemmel = ({ oppgavebehandling }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setInnsendingshjemler, { isError }] = useSetInnsendingshjemlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const hjemmelCount = oppgavebehandling.hjemmelIdList.length;

  return (
    <BehandlingSection label={`Saken er sendt inn med ${hjemmelCount > 1 ? 'lovhjemler' : 'lovhjemmel'}`}>
      <Container>
        <Innsendingshjemler
          size="small"
          hjemmelIdList={oppgavebehandling.hjemmelIdList}
          fallback={
            <Tag size="small" variant="neutral">
              Ingen hjemler
            </Tag>
          }
        />
        {oppgavebehandling.isAvsluttetAvSaksbehandler ? null : (
          <PopupContainer ref={ref}>
            <Tooltip content="Endre innsendingshjemler">
              <Button
                size="xsmall"
                variant="tertiary"
                onClick={() => setIsOpen((o) => !o)}
                icon={<PencilIcon aria-hidden />}
                style={{ alignSelf: 'start', marginLeft: 'auto' }}
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
          </PopupContainer>
        )}
      </Container>
    </BehandlingSection>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PopupContainer = styled.div`
  position: relative;
  align-self: start;
  flex-grow: 0;
  flex-shrink: 0;
  width: min-content;
`;
