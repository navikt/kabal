import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { GosysBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/beskrivelse';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/behandling/behandlingsdetaljer/gosys/domain';
import { Innsendingshjemmel } from '@app/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { Lovhjemmel } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from '@app/components/behandling/behandlingsdetaljer/melding-fra-vedtaksinstans';
import { MottattVedtaksinstans } from '@app/components/behandling/behandlingsdetaljer/mottatt-vedtaksinstans';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { SelectGosysOppgaveModal } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/select-gosys-oppgave';
import { Tilbakekreving } from '@app/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@app/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@app/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@app/components/behandling/styled-components';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Part } from '@app/components/part/part';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Klagebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();
  const { data: gosysOppgave } = useGetGosysOppgaveQuery(
    oppgavebehandling.gosysOppgaveId === null ? skipToken : oppgavebehandling.id,
  );

  const {
    typeId,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraVedtaksinstans,
    resultat,
    ytelseId,
    prosessfullmektig,
    saksnummer,
    varsletFrist,
    id,
  } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <Part
          isDeletable={false}
          label="Klager"
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

        <Saksnummer saksnummer={saksnummer} />

        <Innsendingshjemmel oppgavebehandling={oppgavebehandling} />

        <MottattVedtaksinstans />

        <BehandlingSection label="Varslet frist">
          {varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}
        </BehandlingSection>

        <BehandlingSection label="Fra NAV-enhet">
          {fraNAVEnhetNavn} - {fraNAVEnhet}
        </BehandlingSection>

        <BehandlingSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</BehandlingSection>

        <MeldingFraVedtaksinstans kommentarFraVedtaksinstans={kommentarFraVedtaksinstans} />

        {oppgavebehandling.gosysOppgaveId !== null &&
        gosysOppgave !== undefined &&
        gosysOppgave.beskrivelse !== null ? (
          <GosysBeskrivelse oppgavebeskrivelse={gosysOppgave.beskrivelse} />
        ) : null}

        <BehandlingSection label="Oppgave fra Gosys">
          <SelectGosysOppgaveModal hasGosysOppgave={oppgavebehandling.gosysOppgaveId !== null} />
        </BehandlingSection>

        <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

        <ExtraUtfall utfallIdSet={extraUtfallIdSet} mainUtfall={utfallId} oppgaveId={id} typeId={typeId} />

        <Lovhjemmel />

        <Tilbakekreving />
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
