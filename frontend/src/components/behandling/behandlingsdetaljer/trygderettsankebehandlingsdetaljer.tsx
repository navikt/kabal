import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Gosys } from '@app/components/behandling/behandlingsdetaljer/gosys';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/behandling/behandlingsdetaljer/gosys/domain';
import { Innsendingshjemmel } from '@app/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { KjennelseMottatt } from '@app/components/behandling/behandlingsdetaljer/kjennelse-mottatt';
import { Lovhjemmel } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { SendtTilTrygderetten } from '@app/components/behandling/behandlingsdetaljer/sendt-til-trygderetten';
import { Tilbakekreving } from '@app/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@app/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@app/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@app/components/behandling/styled-components';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Part } from '@app/components/part/part';
import { Type } from '@app/components/type/type';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { ITrygderettsankebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading } from '@navikt/ds-react';

interface Props {
  oppgavebehandling: ITrygderettsankebehandling;
}

export const Trygderettsankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();

  const { typeId, resultat, ytelseId, prosessfullmektig, saksnummer, id } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <BehandlingSection label="Den ankende part">
          {oppgavebehandling.klager.name ?? 'Navn mangler'}
        </BehandlingSection>

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

        <BehandlingSection label="Ankebehandling fullført av">
          <PreviousSaksbehandler
            previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
            type={SaksTypeEnum.ANKE_I_TRYGDERETTEN}
          />
        </BehandlingSection>

        <Saksnummer saksnummer={saksnummer} />

        <Innsendingshjemmel oppgavebehandling={oppgavebehandling} />

        <SendtTilTrygderetten />

        <KjennelseMottatt />

        <Gosys oppgavebehandling={oppgavebehandling} />

        <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

        <Lovhjemmel />

        <Tilbakekreving />
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
