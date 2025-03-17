import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { ForlengetBehandlingstid } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/forlenget-behandlingstid';
import { Gosys } from '@app/components/behandling/behandlingsdetaljer/gosys';
import { MottattDato } from '@app/components/behandling/behandlingsdetaljer/mottatt-klageinstans';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Type } from '@app/components/type/type';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOmgjøringskravbehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading, VStack } from '@navikt/ds-react';
import { Part } from '../../part/part';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IOmgjøringskravbehandling;
}

export const Omgjøringskravdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId, prosessfullmektig, saksnummer, id } =
    oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <VStack gap="4">
          <Part
            isDeletable={false}
            label="Den som krever omgjøring"
            part={oppgavebehandling.klager}
            onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
            isLoading={klagerIsLoading}
          />

          <Part
            isDeletable
            label="Fullmektig"
            part={prosessfullmektig}
            onChange={(fullmektig) => updateFullmektig({ fullmektig, oppgaveId: oppgavebehandling.id })}
            isLoading={fullmektigIsLoading}
          />

          <BehandlingSection label="Type">
            <Type type={typeId} />
          </BehandlingSection>

          <BehandlingSection label="Ytelse">
            <Ytelse ytelseId={ytelseId} />
          </BehandlingSection>

          <BehandlingSection label="Behandlingen som kreves omgjort er tidligere fullført av">
            <PreviousSaksbehandler
              previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
              type={SaksTypeEnum.OMGJØRINGSKRAV}
            />
          </BehandlingSection>

          <Saksnummer saksnummer={saksnummer} />

          <ForlengetBehandlingstid oppgavebehandling={oppgavebehandling}>
            <MottattDato />
          </ForlengetBehandlingstid>

          <BehandlingSection label="Behandlet av">
            {fraNAVEnhetNavn} - {fraNAVEnhet}
          </BehandlingSection>

          <MottattDato />

          <Gosys oppgavebehandling={oppgavebehandling} />

          <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

          <ExtraUtfall utfallIdSet={extraUtfallIdSet} mainUtfall={utfallId} oppgaveId={id} typeId={typeId} />

          <Lovhjemmel />
        </VStack>
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
