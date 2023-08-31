import { Heading } from '@navikt/ds-react';
import React from 'react';
import { Rol } from '@app/components/behandling/behandlingsdialog/rol/rol';
import { Saksbehandler } from '@app/components/behandling/behandlingsdialog/saksbehandler';
import { ENVIRONMENT } from '@app/environment';
import { StyledBehandlingSection } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

// TODO: Remove feature toggle when ROL is approved for production.
export const Behandlingsdialog = () => (
  <StyledBehandlingSection>
    <Heading level="1" size="medium" spacing>
      Behandlingsdialog
    </Heading>
    <Saksbehandler />
    <Medunderskriver />
    {ENVIRONMENT.isProduction ? null : <Rol />}
    <Messages />
  </StyledBehandlingSection>
);
