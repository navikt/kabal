import { Heading } from '@navikt/ds-react';
import { EventHistory } from '@/components/behandling/behandlingsdialog/history/history';
import { Medunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/medunderskriver';
import { Messages } from '@/components/behandling/behandlingsdialog/messages/messages';
import { Rol } from '@/components/behandling/behandlingsdialog/rol/rol';
import { Saksbehandler } from '@/components/behandling/behandlingsdialog/saksbehandler';
import { StyledBehandlingSection } from '@/components/behandling/styled-components';

export const Behandlingsdialog = () => (
  <StyledBehandlingSection>
    <Heading level="1" size="medium" spacing>
      Behandlingsdialog
    </Heading>
    <Saksbehandler />
    <Medunderskriver />
    <Rol />
    <Messages />
    <hr />
    <EventHistory />
  </StyledBehandlingSection>
);
