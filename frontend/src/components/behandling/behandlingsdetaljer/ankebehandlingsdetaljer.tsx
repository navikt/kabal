import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { Gosys } from '@app/components/behandling/behandlingsdetaljer/gosys';
import { Innsendingshjemmel } from '@app/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { Lovhjemmel } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { MottattDato } from '@app/components/behandling/behandlingsdetaljer/mottatt-klageinstans';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { Tilbakekreving } from '@app/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@app/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@app/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@app/components/behandling/styled-components';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@app/components/part/fullmektig/fullmektig';
import { Part } from '@app/components/part/part';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading } from '@navikt/ds-react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Ankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId, prosessfullmektig, saksnummer, varsletFrist, id } =
    oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <Part
          isDeletable={false}
          label="Den ankende part"
          part={oppgavebehandling.klager}
          onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
          isLoading={klagerIsLoading}
        />

        <Fullmektig part={prosessfullmektig} />

        <BehandlingSection label="Type">
          <Type type={typeId} />
        </BehandlingSection>

        <BehandlingSection label="Ytelse">
          <Ytelse ytelseId={ytelseId} />
        </BehandlingSection>

        <BehandlingSection label="Klagebehandling fullført av">
          <PreviousSaksbehandler
            previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
            type={SaksTypeEnum.ANKE}
          />
        </BehandlingSection>

        <Saksnummer saksnummer={saksnummer} />

        <Innsendingshjemmel oppgavebehandling={oppgavebehandling} />

        <BehandlingSection label="Varslet frist">
          {varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}
        </BehandlingSection>

        <BehandlingSection label="Behandlet av">
          {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
        </BehandlingSection>

        <MottattDato />

        <Gosys oppgavebehandling={oppgavebehandling} />

        <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

        <ExtraUtfall utfallIdSet={extraUtfallIdSet} mainUtfall={utfallId} oppgaveId={id} typeId={typeId} />

        <Lovhjemmel />

        <Tilbakekreving />
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
