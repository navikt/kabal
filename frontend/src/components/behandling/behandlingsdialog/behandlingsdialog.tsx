import { EventHistory } from '@app/components/behandling/behandlingsdialog/history/history';
import { Medunderskriver } from '@app/components/behandling/behandlingsdialog/medunderskriver/medunderskriver';
import { Messages } from '@app/components/behandling/behandlingsdialog/messages/messages';
import { Rol } from '@app/components/behandling/behandlingsdialog/rol/rol';
import { Saksbehandler } from '@app/components/behandling/behandlingsdialog/saksbehandler';
import { StyledBehandlingSection } from '@app/components/behandling/styled-components';
import { Heading } from '@navikt/ds-react';

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
